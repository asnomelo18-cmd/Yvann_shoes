import { IconStar, IconCircleCheck } from "@tabler/icons-react";
import type { ProductReview } from "@/lib/mock-product-details";

export function ReviewsSection({
  avgRating,
  reviewCount,
  reviews,
}: {
  avgRating: number;
  reviewCount: number;
  reviews: ProductReview[];
}) {
  return (
    <section className="mt-14 border-t border-slate-200 pt-10 dark:border-slate-800">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-text">Avis clients</h2>
        <div className="flex items-center gap-1 text-sm text-text-muted">
          <IconStar size={16} className="fill-rho-warning text-rho-warning" />
          {avgRating.toFixed(1)} · {reviewCount || reviews.length} avis
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-slate-100 pb-6 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <IconStar
                    key={i}
                    size={14}
                    className={
                      i < review.rating
                        ? "fill-rho-warning text-rho-warning"
                        : "text-slate-300 dark:text-slate-700"
                    }
                  />
                ))}
              </div>
              {review.verifiedPurchase && (
                <span className="flex items-center gap-1 text-xs text-rho-success">
                  <IconCircleCheck size={13} /> Achat vérifié
                </span>
              )}
            </div>
            <h3 className="mt-2 text-sm font-medium text-text">{review.title}</h3>
            <p className="mt-1 text-sm text-text-muted">{review.comment}</p>
            <p className="mt-2 text-xs text-text-muted">
              {review.author} ·{" "}
              {new Date(review.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
