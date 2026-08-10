import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

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

async function assertOwnership(userId: string, addressId: string) {
  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== userId) return null;
  return address;
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });

    const existing = await assertOwnership(user.id, params.id);
    if (!existing) return NextResponse.json({ error: "Adresse introuvable." }, { status: 404 });

    const body = await request.json();
    const parsed = addressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Formulaire invalide." }, { status: 400 });
    }

    const address = await prisma.$transaction(async (tx) => {
      if (parsed.data.isDefault) {
        await tx.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
      }
      return tx.address.update({ where: { id: params.id }, data: parsed.data });
    });

    return NextResponse.json({ address });
  } catch (error) {
    console.error("Erreur /api/addresses/[id] (PATCH) :", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });

    const existing = await assertOwnership(user.id, params.id);
    if (!existing) return NextResponse.json({ error: "Adresse introuvable." }, { status: 404 });

    await prisma.address.delete({ where: { id: params.id } });

    // Si l'adresse supprimée était la par défaut, en réassigne une autre automatiquement
    if (existing.isDefault) {
      const next = await prisma.address.findFirst({ where: { userId: user.id } });
      if (next) await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erreur /api/addresses/[id] (DELETE) :", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
