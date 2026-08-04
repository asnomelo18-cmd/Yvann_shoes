"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative flex h-[100svh] min-h-[640px] w-full items-end overflow-hidden bg-rho-ink-950">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-poster.jpg"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/hero-shoe.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-rho-ink-950/80 via-transparent to-rho-ink-950/10" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 sm:px-8 lg:px-12">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Chaque pas
          <br />
          compte. <span className="text-white/60">Chaque paire</span>
          <br />
          <span className="text-white/60">est unique.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="mt-6 max-w-md text-base text-white/80 sm:text-lg"
        >
          RHO rassemble les meilleures sneakers, running et chaussures de ville
          — livraison rapide et retours faciles sur toute votre commande.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Link
            href="/boutique"
            className="rounded-full bg-rho-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-rho-blue-700"
          >
            Voir la collection
          </Link>
          <Link
            href="/boutique?tri=nouveautes"
            className="liquid-glass rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          >
            Nouveautés du mois
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
