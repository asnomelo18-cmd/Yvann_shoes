import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { hashPassword, verifyPassword } from "@/lib/auth";

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "8 caractères minimum"),
});

export async function PATCH(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });

    const body = await request.json();
    const parsed = passwordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Formulaire invalide." }, { status: 400 });
    }

    if (!user.passwordHash || !(await verifyPassword(parsed.data.currentPassword, user.passwordHash))) {
      return NextResponse.json({ error: "Mot de passe actuel incorrect." }, { status: 401 });
    }

    const passwordHash = await hashPassword(parsed.data.newPassword);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erreur /api/account/password :", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
