export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square rounded-2xl bg-slate-200 dark:bg-slate-700" />
          <div className="mt-3 h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-2 h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-2 h-4 w-1/4 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      ))}
    </div>
  );
}
