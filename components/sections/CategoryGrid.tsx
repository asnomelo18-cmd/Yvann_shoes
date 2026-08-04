"use client";

import Link from "next/link";
import {
  IconMan,
  IconWoman,
  IconBabyCarriage,
  IconShoe,
  IconRun,
} from "@tabler/icons-react";

const CATEGORIES = [
  { label: "Homme", href: "/boutique?genre=homme", icon: IconMan },
  { label: "Femme", href: "/boutique?genre=femme", icon: IconWoman },
  { label: "Enfant", href: "/boutique?genre=enfant", icon: IconBabyCarriage },
  { label: "Sneakers", href: "/boutique?categorie=sneakers", icon: IconShoe },
  { label: "Running", href: "/boutique?categorie=running", icon: IconRun },
];

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
      <h2 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
        Trouvez votre catégorie
      </h2>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {CATEGORIES.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-surface px-4 py-8 transition-colors hover:border-yvann-gold-500 dark:border-slate-700"
          >
            <Icon size={28} className="text-yvann-gold-600" />
            <span className="text-sm font-medium text-text">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
