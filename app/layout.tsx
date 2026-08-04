import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: {
    default: "RHO — Chaque pas compte",
    template: "%s | RHO",
  },
  description:
    "RHO, la boutique en ligne de chaussures sneakers, running et ville. Livraison rapide, retours faciles.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
