import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import FadeIn from "../ui/FadeIn.jsx";
import SectionHeading from "../ui/SectionHeading.jsx";
import ReviewCard from "../ui/ReviewCard.jsx";
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
                className="border border-border rounded-lg px-6 py-8 bg-surface text-center card-shadow">
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
        
        <FadeIn>
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
            <div className="flex items-center justify-center sm:justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={prev}
                className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-white transition cursor-pointer card-shadow"
                aria-label="Previous reviews">
                <FontAwesomeIcon icon={faAngleLeft} className="text-sm" />
              </button>
              <button
                type="button"
                onClick={next}
                className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-white transition cursor-pointer card-shadow"
                aria-label="Next reviews">
                <FontAwesomeIcon icon={faAngleRight} className="text-sm" />
              </button>
            </div>
          </FadeIn>
        )}

        <div key={page} className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-page-fade">
          {visible.map((review, i) => (
              <FadeIn key={review._id || i} delay={i * 100}>
                <ReviewCard review={review} onReadMore={setDetail} />
              </FadeIn>
          ))}
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
              ].filter(Boolean)
            : []
        }
        location={detail?.location}
        rating={detail?.rating}
        description={detail?.review_text || ""}
      />
    </section>
  );
}