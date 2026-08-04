import Link from "next/link";
import {
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandFacebook,
  IconBrandX,
} from "@tabler/icons-react";

const COLUMNS = [
  {
    title: "Boutique",
    links: [
      { label: "Homme", href: "/boutique?genre=homme" },
      { label: "Femme", href: "/boutique?genre=femme" },
      { label: "Enfant", href: "/boutique?genre=enfant" },
      { label: "Nouveautés", href: "/boutique?tri=nouveautes" },
      { label: "Soldes", href: "/boutique?soldes=1" },
    ],
  },
  {
    title: "Aide",
    links: [
      { label: "Guide des pointures", href: "/aide/guide-pointures" },
      { label: "Livraison", href: "/aide/livraison" },
      { label: "Retours", href: "/aide/retours" },
      { label: "FAQ", href: "/aide/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "RHO",
    links: [
      { label: "À propos", href: "/a-propos" },
      { label: "Blog", href: "/blog" },
      { label: "CGV", href: "/legal/cgv" },
      { label: "Confidentialité", href: "/legal/confidentialite" },
      { label: "Cookies", href: "/legal/cookies" },
    ],
  },
];

const SOCIALS = [
  { icon: IconBrandInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: IconBrandTiktok, href: "https://tiktok.com", label: "TikTok" },
  { icon: IconBrandFacebook, href: "https://facebook.com", label: "Facebook" },
  { icon: IconBrandX, href: "https://x.com", label: "X" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-surface dark:border-slate-800">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-16 sm:px-8 lg:grid-cols-5 lg:px-12">
        <div className="col-span-2 lg:col-span-2">
          <img src="/logo/rho-mark-dark.svg" alt="RHO" className="h-7 w-auto dark:hidden" />
          <img
            src="/logo/rho-mark.svg"
            alt="RHO"
            className="hidden h-7 w-auto dark:block"
          />
          <p className="mt-4 max-w-xs text-sm text-text-muted">
            La boutique en ligne de chaussures sneakers, running et ville.
          </p>
          <div className="mt-5 flex gap-3">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-300 p-2 text-text-muted transition-colors hover:border-rho-blue-500 hover:text-rho-blue-600 dark:border-slate-700"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-text">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted transition-colors hover:text-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 px-6 py-6 text-center text-xs text-text-muted dark:border-slate-800">
        © {new Date().getFullYear()} RHO. Tous droits réservés.
      </div>
    </footer>
  );
}
