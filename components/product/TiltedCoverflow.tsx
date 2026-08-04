"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { MockProduct } from "@/lib/mock-products";

export function TiltedCoverflow({ products }: { products: MockProduct[] }) {
  const [index, setIndex] = useState(0);

  function go(delta: number) {
    setIndex((i) => Math.max(0, Math.min(products.length - 1, i + delta)));
  }

  if (products.length === 0) return null;

  return (
    <div className="relative mx-auto flex max-w-3xl items-center justify-center gap-4 py-8">
      <button
        aria-label="Précédent"
        onClick={() => go(-1)}
        disabled={index === 0}
        className="liquid-glass shrink-0 rounded-full p-2 text-text disabled:opacity-30"
      >
        <IconChevronLeft size={18} />
      </button>

      <div
        className="flex items-center gap-4 overflow-hidden"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") go(-1);
          if (e.key === "ArrowRight") go(1);
        }}
      >
        {products.map((p, i) => {
          const offset = i - index;
          if (Math.abs(offset) > 2) return null;
          return (
            <motion.div
              key={p.id}
              animate={{
                scale: offset === 0 ? 1 : 0.8,
                opacity: offset === 0 ? 1 : 0.5,
                x: offset * -8,
              }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="w-40 shrink-0"
            >
              <Link href={`/produit/${p.slug}`}>
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--rho-white)] dark:bg-[var(--rho-ink-950)]">
                  <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-2 left-2 text-xs font-medium text-white">
                    {p.name}
                  </span>
                </div>
                <p className="mt-2 text-center text-xs text-text-muted">{formatPrice(p.basePrice)}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <button
        aria-label="Suivant"
        onClick={() => go(1)}
        disabled={index === products.length - 1}
        className="liquid-glass shrink-0 rounded-full p-2 text-text disabled:opacity-30"
      >
        <IconChevronRight size={18} />
      </button>

      <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
        {products.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              i === index
                ? "bg-[var(--rho-ink-950)] dark:bg-[var(--rho-white)]"
                : "bg-slate-300 dark:bg-slate-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
