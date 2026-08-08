import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  icon: React.ComponentType<any>;
  tone?: "default" | "warning" | "success" | "danger";
}) {
  const toneClasses: Record<string, string> = {
    default: "text-yvann-gold-700 bg-yvann-gold-500/10",
    warning: "text-yvann-warningText bg-yvann-warning/10",
    success: "text-yvann-successText bg-yvann-success/10",
    danger: "text-yvann-danger bg-yvann-danger/10",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-surface p-5 dark:border-slate-800">
      <div className={cn("inline-flex rounded-xl p-2", toneClasses[tone])}>
        <Icon size={20} />
      </div>
      <p className="mt-4 text-2xl font-semibold text-text">{value}</p>
      <p className="text-xs text-text-muted">{label}</p>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-surface p-5 dark:border-slate-800">
      <div className="h-9 w-9 rounded-xl bg-slate-200 dark:bg-slate-700" />
      <div className="mt-4 h-6 w-16 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mt-2 h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}
