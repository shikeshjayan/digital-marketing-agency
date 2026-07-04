import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import FadeIn from "../ui/FadeIn.jsx";
import SectionHeading from "../ui/SectionHeading.jsx";
import StarRow from "../ui/StarRow.jsx";
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
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reviews.length === 0 || paused) return;
    const t = setInterval(
      () => setIndex((v) => (v + 1) % reviews.length),
      3000,
    );
    return () => clearInterval(t);
  }, [reviews.length, paused]);

  if (loading) {
    return (
      <section className={`py-12 ${bg}`}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="mt-8 flex justify-center">
            <div className="w-full max-w-xl border border-border rounded-lg px-6 py-8 bg-surface text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-200 animate-pulse ring-2 ring-gray-300 ring-offset-2" />
              <div className="mt-4 h-4 w-24 bg-gray-200 rounded mx-auto animate-pulse" />
              <div className="mt-2 h-3 w-16 bg-gray-200 rounded mx-auto animate-pulse" />
              <div className="mt-4 space-y-2">
                <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-gray-200 rounded mx-auto animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!reviews.length) return null;
  const current = reviews[index];

  return (
    <section
      className={`py-12 ${bg}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>
      <div className="max-w-5xl mx-auto px-4">
        <FadeIn>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
          />
        </FadeIn>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setIndex((v) => (v - 1 + reviews.length) % reviews.length)}
            className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-white transition cursor-pointer shrink-0"
            aria-label="Previous testimonial">
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>

          <div className="w-full max-w-2xl border border-border rounded-lg px-6 py-8 bg-surface text-center">
            <div className="mx-auto w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary ring-offset-2 flex items-center justify-center shadow-md">
              {showAvatar && current.user_avatar ? (
                <img
                  src={imageUrl(current.user_avatar)}
                  alt={current.name}
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
                className={`w-full h-full items-center justify-center text-lg font-bold text-primary-hover ${
                  showAvatar && current.user_avatar ? "hidden" : "flex"
                }`}>
                {current.name
                  ?.split(" ")
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "?"}
              </div>
            </div>
            <div className="mt-4 font-bold text-heading">{current.name}</div>
            {(current.company || current.location) && (
              <div className="text-sm text-muted">
                {current.company && <span>{current.company}</span>}
                {current.company && current.location && <span> &middot; </span>}
                {current.location && <span>{current.location}</span>}
              </div>
            )}
            <p className="mt-4 text-gray-700 leading-relaxed max-w-2xl mx-auto">
              &ldquo;{current.review_text}&rdquo;
            </p>
            <div className="mt-4">
              <StarRow rating={current.rating} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIndex((v) => (v + 1) % reviews.length)}
            className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-white transition cursor-pointer shrink-0"
            aria-label="Next testimonial">
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-5">
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`w-2.5 h-2.5 rounded-full transition cursor-pointer ${
                i === index
                  ? "bg-primary"
                  : "bg-primary-light hover:bg-primary-hover"
              }`}
              onClick={() => setIndex(i)}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
