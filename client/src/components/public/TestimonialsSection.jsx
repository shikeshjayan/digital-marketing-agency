import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import FadeIn from "../ui/FadeIn.jsx";
import SectionHeading from "../ui/SectionHeading.jsx";
import StarRow from "../ui/StarRow.jsx";
import DetailModal from "../ui/DetailModal.jsx";
import imageUrl from "../../utils/imageUrl.js";

export default function TestimonialsSection({
  reviews = [],
  loading = false,
  eyebrow = "Testimonials",
  title = "What Our Clients Say",
  subtitle = "Real feedback from businesses we've helped grow.",
  showAvatar = true,
  bg = "bg-background",
}) {
  const [page, setPage] = useState(0);
  const [detail, setDetail] = useState(null);

  if (loading) {
    return (
      <section className={`py-12 ${bg}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="border border-border rounded-lg px-6 py-8 bg-surface text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-gray-200 animate-pulse" />
                <div className="mt-3 h-2 w-16 bg-gray-200 rounded mx-auto animate-pulse" />
                <div className="mt-3 h-4 w-24 bg-gray-200 rounded mx-auto animate-pulse" />
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-gray-200 rounded mx-auto animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!reviews.length) return null;

  const perPage = 3;
  const totalPages = Math.ceil(reviews.length / perPage);
  const visible = reviews.slice(page * perPage, page * perPage + perPage);
  const handleDetail = (review) => setDetail(review);

  const prev = () => setPage((v) => (v - 1 + totalPages) % totalPages);
  const next = () => setPage((v) => (v + 1) % totalPages);

  return (
    <section className={`py-12 ${bg}`}>
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn>
          <div className="text-center">
            <SectionHeading
              eyebrow={eyebrow}
              title={title}
              subtitle={subtitle}
            />
          </div>
        </FadeIn>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              type="button"
              onClick={prev}
              className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-white transition cursor-pointer"
              aria-label="Previous reviews">
              <FontAwesomeIcon icon={faAngleLeft} className="text-sm" />
            </button>
            <span className="text-xs text-muted">
              {page + 1} / {totalPages}
            </span>
            <button
              type="button"
              onClick={next}
              className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-white transition cursor-pointer"
              aria-label="Next reviews">
              <FontAwesomeIcon icon={faAngleRight} className="text-sm" />
            </button>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((review, i) => (
            <FadeIn key={review._id || i} delay={i * 100}>
              <div className="h-full bg-surface border border-border rounded-lg px-6 py-6 flex flex-col items-center text-center hover:shadow-md transition">
                {showAvatar && (
                  <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary ring-offset-2 flex items-center justify-center shadow-sm">
                    {review.user_avatar ? (
                      <img
                        src={imageUrl(review.user_avatar)}
                        alt={review.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full h-full items-center justify-center text-sm font-bold text-primary-hover ${
                        review.user_avatar ? "hidden" : "flex"
                      }`}>
                      {review.name
                        ?.split(" ")
                        .map((w) => w[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) || "?"}
                    </div>
                  </div>
                )}

                <div className="mt-3">
                  <StarRow rating={review.rating} />
                </div>

                <div className="mt-2 font-bold text-heading text-sm">
                  {review.name}
                </div>
                {(review.company || review.location) && (
                  <div className="text-xs text-muted">
                    {review.company && <span>{review.company}</span>}
                    {review.company && review.location && (
                      <span> &middot; </span>
                    )}
                    {review.location && <span>{review.location}</span>}
                  </div>
                )}

                <p className="mt-3 text-text text-sm leading-relaxed flex-1 line-clamp-3">
                  &ldquo;{review.review_text}&rdquo;
                </p>

                {review.review_text && review.review_text.length > 100 && (
                  <button
                    type="button"
                    onClick={() => handleDetail(review)}
                    className="mt-2 text-xs font-semibold text-primary hover:text-primary-hover transition cursor-pointer">
                    Read more
                  </button>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      <DetailModal
        open={!!detail}
        onClose={() => setDetail(null)}
        image={detail?.user_avatar ? imageUrl(detail.user_avatar) : ""}
        imageVariant="avatar"
        title={detail?.name || ""}
        tags={
          detail
            ? [
                detail.company && { label: detail.company, variant: "primary" },
                detail.location && {
                  label: detail.location,
                  variant: "default",
                },
              ].filter(Boolean)
            : []
        }
        rating={detail?.rating}
        description={detail?.review_text || ""}
      />
    </section>
  );
}
