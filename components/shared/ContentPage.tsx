export function ContentPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-text">{title}</h1>
      {subtitle && <p className="mt-2 text-text-muted">{subtitle}</p>}
      <div className="prose-yvann mt-8 space-y-6 text-sm leading-relaxed text-text-muted [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-text [&_li]:ml-4 [&_li]:list-disc [&_strong]:text-text">
        {children}
      </div>
    </div>
  );
}
