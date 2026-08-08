import { NextResponse } from "next/server";
import { getShopSettings } from "@/lib/settings";

export async function GET() {
  try {
    const settings = await getShopSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Erreur /api/settings :", error);
    return NextResponse.json({ settings: null }, { status: 500 });
  }
}
