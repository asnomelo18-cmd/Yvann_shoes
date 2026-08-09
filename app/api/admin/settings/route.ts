import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSuperAdmin } from "@/lib/session";
import { getShopSettings, saveShopSettings } from "@/lib/settings";

export async function GET() {
  const admin = await requireSuperAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const settings = await getShopSettings();
  return NextResponse.json({ settings });
}

const settingsSchema = z.object({
  shopName: z.string().min(1),
  legalName: z.string().min(1),
  phone: z.string(),
  email: z.string(),
  social: z.object({
    instagram: z.string(),
    tiktok: z.string(),
    facebook: z.string(),
    x: z.string(),
  }),
  payment: z.object({
    orangeMoney: z.string(),
    mtnMoney: z.string(),
    wave: z.string(),
    bankAccount: z.string(),
  }),
  shippingZones: z.array(z.object({ name: z.string().min(1), price: z.number().nonnegative() })),
});

export async function PUT(request: Request) {
  const admin = await requireSuperAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await request.json();
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Formulaire invalide." }, { status: 400 });
  }

  await saveShopSettings(parsed.data);
  return NextResponse.json({ settings: parsed.data });
}
