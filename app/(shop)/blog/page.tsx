import { IconNotes } from "@tabler/icons-react";

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 text-center sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-text">Blog</h1>
      <p className="mt-2 text-text-muted">Actus sneakers, guides d'entretien et nouveautés.</p>

      <div className="mt-16 flex flex-col items-center gap-3 text-text-muted">
        <IconNotes size={32} />
        <p className="text-sm">Les premiers articles arrivent bientôt.</p>
      </div>
    </div>
  );
}
