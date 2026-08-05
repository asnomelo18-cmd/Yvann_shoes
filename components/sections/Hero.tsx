"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative flex h-[100svh] min-h-[640px] w-full items-end overflow-hidden bg-yvann-black-950">
      {/* Fond animé — dégradé noir profond avec halos or/bronze qui dérivent lentement */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0b] via-[#151513] to-[#0a0a0b]" />

        <motion.div
          aria-hidden
          className="absolute -left-1/4 top-[-10%] h-[70vh] w-[70vh] rounded-full bg-yvann-gold-600/20 blur-[120px]"
          animate={{ x: [0, 60, -20, 0], y: [0, 40, -30, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute right-[-10%] top-1/4 h-[55vh] w-[55vh] rounded-full bg-yvann-bronze-500/20 blur-[120px]"
          animate={{ x: [0, -50, 30, 0], y: [0, -30, 40, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute bottom-[-15%] left-1/3 h-[50vh] w-[50vh] rounded-full bg-yvann-gold-500/15 blur-[130px]"
          animate={{ x: [0, 40, -40, 0], y: [0, -20, 20, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Grain léger pour la texture premium */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* Voile pour garantir la lisibilité du texte, quel que soit le mouvement des halos */}
      <div className="absolute inset-0 bg-gradient-to-t from-yvann-black-950/90 via-yvann-black-950/30 to-yvann-black-950/40" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 sm:px-8 lg:px-12">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl text-5xl font-semibold leading-[1.05] tracking-tight text-yvann-cream sm:text-6xl lg:text-7xl"
        >
          La mode
          <br />
          à vos pieds. <span className="text-yvann-gold-400">Chaque paire</span>
          <br />
          <span className="text-yvann-gold-400">a du caractère.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="mt-6 max-w-md text-base text-yvann-cream/80 sm:text-lg"
        >
          Yvann Boutique rassemble les meilleures sneakers, running et
          chaussures de ville — livraison rapide et retours faciles sur toute
          votre commande.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Link
            href="/boutique"
            className="rounded-full bg-yvann-gold-600 px-6 py-3 text-sm font-semibold text-yvann-black-950 transition-colors hover:bg-yvann-gold-500"
          >
            Voir la collection
          </Link>
          <Link
            href="/boutique?tri=nouveautes"
            className="liquid-glass rounded-full px-6 py-3 text-sm font-semibold text-yvann-cream transition-transform hover:scale-[1.02]"
          >
            Nouveautés du mois
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
