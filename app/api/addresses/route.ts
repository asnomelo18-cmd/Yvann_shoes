import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Erreur /api/addresses (GET) :", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

const addressSchema = z.object({
  label: z.string().optional(),
  fullName: z.string().min(2),
  phone: z.string().min(8),
  line1: z.string().min(3),
  line2: z.string().optional(),
  city: z.string().min(2),
  region: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(2),
  isDefault: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });

    const body = await request.json();
    const parsed = addressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Formulaire invalide." }, { status: 400 });
    }

    const address = await prisma.$transaction(async (tx) => {
      if (parsed.data.isDefault) {
        await tx.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
      }
      // La toute première adresse du client devient automatiquement la par défaut
      const count = await tx.address.count({ where: { userId: user.id } });
      return tx.address.create({
        data: { ...parsed.data, userId: user.id, isDefault: parsed.data.isDefault || count === 0 },
      });
    });

    return NextResponse.json({ address }, { status: 201 });
  } catch (error) {
    console.error("Erreur /api/addresses (POST) :", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
