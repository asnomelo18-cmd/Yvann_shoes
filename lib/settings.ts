import { prisma } from "@/lib/prisma";

export interface ShopSettings {
  shopName: string;
  legalName: string;
  phone: string;
  email: string;
  social: {
    instagram: string;
    tiktok: string;
    facebook: string;
    x: string;
  };
  payment: {
    orangeMoney: string;
    mtnMoney: string;
    wave: string;
    bankAccount: string;
  };
  shippingZones: { name: string; price: number }[];
}

export const DEFAULT_SETTINGS: ShopSettings = {
  shopName: "Yvann Boutique",
  legalName: "Yvann Boutique",
  phone: "",
  email: "",
  social: { instagram: "", tiktok: "", facebook: "", x: "" },
  payment: { orangeMoney: "", mtnMoney: "", wave: "", bankAccount: "" },
  shippingZones: [
    { name: "Yopougon", price: 1000 },
    { name: "Hors Yopougon", price: 2500 },
  ],
};

const SETTINGS_KEY = "shop.settings";

export async function getShopSettings(): Promise<ShopSettings> {
  const row = await prisma.setting.findUnique({ where: { key: SETTINGS_KEY } });
  if (!row) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...(row.value as object) } as ShopSettings;
}

export async function saveShopSettings(settings: ShopSettings) {
  await prisma.setting.upsert({
    where: { key: SETTINGS_KEY },
    update: { value: settings as any },
    create: { key: SETTINGS_KEY, value: settings as any },
  });
}
