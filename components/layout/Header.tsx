"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  IconChevronDown,
  IconMenu2,
  IconX,
  IconShoppingBag,
  IconHeart,
  IconGitCompare,
  IconUser,
  IconLogout,
  IconLayoutDashboard,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useSession, useLogout } from "@/services/auth";
import { useWishlist } from "@/services/wishlist";
import { useCompareList } from "@/services/compare";

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Homme",
    href: "/boutique?genre=homme",
    children: [
      { label: "Sneakers", href: "/boutique?genre=homme&categorie=sneakers" },
      { label: "Running", href: "/boutique?genre=homme&categorie=running" },
      { label: "Ville", href: "/boutique?genre=homme&categorie=ville" },
    ],
  },
  {
    label: "Femme",
    href: "/boutique?genre=femme",
    children: [
      { label: "Sneakers", href: "/boutique?genre=femme&categorie=sneakers" },
      { label: "Running", href: "/boutique?genre=femme&categorie=running" },
      { label: "Ville", href: "/boutique?genre=femme&categorie=ville" },
    ],
  },
  { label: "Enfant", href: "/boutique?genre=enfant" },
  { label: "Sneakers", href: "/boutique?categorie=sneakers" },
  { label: "Running", href: "/boutique?categorie=running" },
  { label: "Nouveautés", href: "/boutique?tri=nouveautes" },
  { label: "Soldes", href: "/boutique?soldes=1" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const cartCount = useCartStore((s) => s.lines.reduce((n, l) => n + l.quantity, 0));
  const openCart = useCartStore((s) => s.open);
  const { data: wishlistItems } = useWishlist();
  const wishlistCount = wishlistItems?.length ?? 0;
  const { data: compareItems } = useCompareList();
  const compareCount = compareItems?.length ?? 0;
  const { data: session } = useSession();
  const logout = useLogout();

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <nav className="flex w-full items-center justify-between rounded-full border border-yvann-gold-600/20 bg-yvann-black-950/95 px-4 py-2.5 shadow-lg shadow-black/20 backdrop-blur-md sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo/yvann-mark.svg" alt="Yvann" className="h-7 w-auto" />
          </Link>

          {/* Nav desktop */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                onMouseLeave={() => item.children && setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:text-white"
                >
                  {item.label}
                  {item.children && <IconChevronDown size={14} />}
                </Link>

                <AnimatePresence>
                  {item.children && openDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-2 min-w-[180px] rounded-2xl border border-yvann-gold-600/20 bg-yvann-black-950/95 p-2 shadow-lg shadow-black/20 backdrop-blur-md"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block rounded-xl px-3 py-2 text-sm text-white/90 hover:bg-white/10 hover:text-white"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>

          {/* Actions droite */}
          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/favoris"
              aria-label="Favoris"
              className="relative rounded-full p-2 text-white/90 hover:bg-white/10 hover:text-white"
            >
              <IconHeart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-yvann-gold-600 px-0.5 text-[10px] font-semibold text-yvann-black-950">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/comparateur"
              aria-label="Comparateur"
              className="relative rounded-full p-2 text-white/90 hover:bg-white/10 hover:text-white"
            >
              <IconGitCompare size={20} />
              {compareCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-yvann-gold-600 px-0.5 text-[10px] font-semibold text-yvann-black-950">
                  {compareCount}
                </span>
              )}
            </Link>
            <button
              aria-label="Panier"
              onClick={openCart}
              className="relative rounded-full p-2 text-white/90 hover:bg-white/10 hover:text-white"
            >
              <IconShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-yvann-gold-500 px-0.5 text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {!session ? (
              <>
                <Link
                  href="/connexion"
                  className="rounded-full px-3 py-2 text-sm font-medium text-white/90 hover:text-white"
                >
                  Se connecter
                </Link>
                <Link
                  href="/inscription"
                  className="liquid-glass rounded-full px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
                >
                  Créer un compte
                </Link>
              </>
            ) : (
              <>
                {["ADMIN", "MANAGER", "SUPPORT", "VENDEUR"].includes(session.role) && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 rounded-full bg-yvann-gold-600/15 px-3 py-2 text-sm font-medium text-yvann-gold-400 hover:bg-yvann-gold-600/25"
                  >
                    <IconLayoutDashboard size={16} /> Admin
                  </Link>
                )}
                <Link
                  href="/compte"
                  className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-white/90 hover:text-white"
                >
                  <IconUser size={16} /> {session.firstName ?? "Mon compte"}
                </Link>
                <button
                  aria-label="Déconnexion"
                  onClick={() => logout.mutate()}
                  className="rounded-full p-2 text-white/90 hover:bg-white/10 hover:text-white"
                >
                  <IconLogout size={18} />
                </button>
              </>
            )}
          </div>

          {/* Bouton menu mobile */}
          <button
            aria-label="Ouvrir le menu"
            className="rounded-full p-2 text-white lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <IconMenu2 size={22} />
          </button>
        </nav>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-yvann-black-950/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex items-center justify-between px-5 py-4">
              <img src="/logo/yvann-mark.svg" alt="Yvann" className="h-7 w-auto" />
              <button
                aria-label="Fermer le menu"
                className="rounded-full p-2 text-white"
                onClick={() => setMobileOpen(false)}
              >
                <IconX size={22} />
              </button>
            </div>
            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } },
              }}
              className="flex flex-col gap-1 px-5 py-4"
            >
              {NAV_ITEMS.map((item) => (
                <motion.li
                  key={item.label}
                  variants={{
                    hidden: { opacity: 0, x: -12 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block border-b border-white/10 py-3 text-lg font-medium text-white"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
              <li className="mt-4 flex flex-col gap-3">
                {!session ? (
                  <div className="flex gap-3">
                    <Link
                      href="/connexion"
                      className="flex-1 rounded-full border border-white/20 py-2.5 text-center text-sm font-medium text-white"
                    >
                      Se connecter
                    </Link>
                    <Link
                      href="/inscription"
                      className="flex flex-1 items-center justify-center gap-2 rounded-full bg-yvann-gold-600 py-2.5 text-center text-sm font-semibold text-white"
                    >
                      <IconUser size={16} /> Créer un compte
                    </Link>
                  </div>
                ) : (
                  <>
                    {["ADMIN", "MANAGER", "SUPPORT", "VENDEUR"].includes(session.role) && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-2 rounded-full bg-yvann-gold-600/15 py-2.5 text-center text-sm font-semibold text-yvann-gold-400"
                      >
                        <IconLayoutDashboard size={16} /> Espace admin
                      </Link>
                    )}
                    <Link
                      href="/compte"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-full border border-white/20 py-2.5 text-center text-sm font-medium text-white"
                    >
                      <IconUser size={16} /> {session.firstName ?? "Mon compte"}
                    </Link>
                    <button
                      onClick={() => {
                        logout.mutate();
                        setMobileOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 rounded-full py-2.5 text-center text-sm font-medium text-white/70"
                    >
                      <IconLogout size={16} /> Déconnexion
                    </button>
                  </>
                )}
              </li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
