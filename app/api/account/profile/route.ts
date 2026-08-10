import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

const profileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  usualSize: z.number().positive().optional().nullable(),
  favoriteStyle: z.string().optional(),
});

export async function PATCH(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });

    const body = await request.json();
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Formulaire invalide." }, { status: 400 });
    }

    const { phone, ...rest } = parsed.data;

    if (phone) {
      const existing = await prisma.user.findUnique({ where: { phone } });
      if (existing && existing.id !== user.id) {
        return NextResponse.json(
          { error: "Ce numéro de téléphone est déjà utilisé par un autre compte." },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { ...rest, phone: phone || null },
    });

    return NextResponse.json({
      user: {
        id: updated.id,
        email: updated.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
        phone: updated.phone,
        usualSize: updated.usualSize,
        favoriteStyle: updated.favoriteStyle,
        role: updated.role,
        loyaltyPoints: updated.loyaltyPoints,
      },
    });
  } catch (error) {
    console.error("Erreur /api/account/profile :", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
