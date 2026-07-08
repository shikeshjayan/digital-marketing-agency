import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import FadeIn from "../ui/FadeIn.jsx";
import SectionHeading from "../ui/SectionHeading.jsx";
import StarRow from "../ui/StarRow.jsx";
import DetailModal from "../ui/DetailModal.jsx";

export default function TestimonialsSection({
  reviews = [],
  loading = false,
  eyebrow = "Testimonials",
  title = "What Our Clients Say",
  subtitle = "Real feedback from businesses we've helped grow.",
  bg = "bg-background",
}) {
  const [page, setPage] = useState(0);
  const [detail, setDetail] = useState(null);

  if (loading) {
    return (
      <section className={`py-12 ${bg}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="h-8 w-48 bg-surface rounded mx-auto animate-pulse" />
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="border border-border rounded-lg px-6 py-8 bg-surface text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-surface animate-pulse" />
                <div className="mt-3 h-2 w-16 bg-surface rounded mx-auto animate-pulse" />
                <div className="mt-3 h-4 w-24 bg-surface rounded mx-auto animate-pulse" />
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-full bg-surface rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-surface rounded mx-auto animate-pulse" />
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

  const prev = () => setPage((v) => (v - 1 + totalPages) % totalPages);
  const next = () => setPage((v) => (v + 1) % totalPages);

  return (
    <section className={`py-12 ${bg}`}>
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Responsive flex row placing heading on left and navigation action buttons on top-right side */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <FadeIn className="flex-1">
            <div className="text-center sm:text-left">
              <SectionHeading
                eyebrow={eyebrow}
                title={title}
                subtitle={subtitle}
              />
            </div>
          </FadeIn>

          {totalPages > 1 && (
            <FadeIn>
              <div className="flex items-center justify-center sm:justify-end gap-2 shrink-0 pb-1">
                <button
                  type="button"
                  onClick={prev}
                  className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-white transition cursor-pointer shadow-sm"
                  aria-label="Previous reviews">
                  <FontAwesomeIcon icon={faAngleLeft} className="text-sm" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-white transition cursor-pointer shadow-sm"
                  aria-label="Next reviews">
                  <FontAwesomeIcon icon={faAngleRight} className="text-sm" />
                </button>
              </div>
            </FadeIn>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((review, i) => {
            const isLongText = review.review_text && review.review_text.length > 100;
            const initials = review.name ? review.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';
            const shortText = isLongText ? review.review_text.slice(0, 100).trim() : review.review_text;

            return (
              <FadeIn key={review._id || i} delay={i * 100}>
                <div className="h-full bg-surface border border-border rounded-lg p-6 flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <div className="flex items-center gap-3 w-full min-w-0">
                      {/* Initials Circle with light red highlight branding style */}
                      <div className="w-12 h-12 rounded-full bg-primary-light/40 border border-primary/20 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                        <span className="text-sm font-extrabold text-primary select-none tracking-wider">
                          {initials}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <div className="font-bold text-heading text-sm truncate">
                          {review.name}
                        </div>
                        {(review.company || review.location) && (
                          <div className="text-xs text-muted truncate">
                            {review.company && <span>{review.company}</span>}
                            {review.company && review.location && <span> &middot; </span>}
                            {review.location && <span>{review.location}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-start">
                      <StarRow rating={review.rating} />
                    </div>

                    {/* Flat inline sentence container to avoid responsive hidden line-clamp breaks */}
                    <div className="mt-4 text-text text-sm leading-relaxed break-words w-full italic text-left">
                      <span className="inline">
                        &ldquo;{shortText}
                      </span>
                      {isLongText ? (
                        <span className="inline">
                          ...{" "}
                          <button
                            type="button"
                            onClick={() => setDetail(review)}
                            className="inline text-xs font-bold text-primary hover:text-primary-hover hover:underline transition cursor-pointer not-italic select-none p-0 bg-transparent border-none outline-none">
                            Read more
                          </button>
                          &rdquo;
                        </span>
                      ) : (
                        <span className="inline">&rdquo;</span>
                      )}
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>

      {/* DetailModal maps empty images to consistently generate name letter bubbles inside popups */}
      <DetailModal
        open={!!detail}
        onClose={() => setDetail(null)}
        image="" 
        imageVariant="avatar"
        title={detail?.name || ""}
        initials={
          detail?.name
            ? detail.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
            : "?"
        }
        tags={
          detail
            ? [
                detail.company && { label: detail.company, variant: "primary" },
                detail.location && { label: detail.location, variant: "default" },
              ].filter(Boolean)
            : []
        }
        rating={detail?.rating}
        description={detail?.review_text || ""}
      />
    </section>
  );
}