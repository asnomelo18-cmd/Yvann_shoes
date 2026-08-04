import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: {
    default: "Yvann Boutique — La mode à vos pieds",
    template: "%s | Yvann Boutique",
  },
  description:
    "Yvann Boutique — la mode à vos pieds. Sneakers, running et chaussures de ville, livraison rapide et retours faciles.",
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
