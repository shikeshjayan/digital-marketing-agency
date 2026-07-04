import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import StarRow from "./StarRow.jsx";

const IMAGE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260'%3E%3Crect fill='%23F8FAFC' width='400' height='260'/%3E%3Ctext x='200' y='135' text-anchor='middle' fill='%236B7280' font-size='14' font-family='sans-serif'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function DetailModal({
  open,
  onClose,
  image,
  imageVariant = "banner",
  title,
  tags = [],
  description,
  rating,
  cta,
}) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const isAvatar = imageVariant === "avatar";

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative z-10 bg-background radius-m shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 z-50 w-8 h-8 radius-sb bg-surface border border-border flex items-center justify-center text-muted hover:text-heading hover:bg-background transition cursor-pointer"
          aria-label="Close">
          <FontAwesomeIcon icon={faTimes} className="text-xs" />
        </button>

        {isAvatar && image ? (
          <div className="flex flex-col items-center pt-6 sm:pt-8 pb-5 sm:pb-6 border-b border-border bg-surface">
            <div className="w-16 h-16 sm:w-20 sm:h-20 radius-sb overflow-hidden ring-4 ring-primary/20 shadow-sm">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = IMAGE_PLACEHOLDER;
                }}
              />
            </div>
          </div>
        ) : image ? (
          <div className="w-full max-h-48 sm:max-h-75 overflow-hidden radius-m">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = IMAGE_PLACEHOLDER;
              }}
            />
          </div>
        ) : null}

        <div className="p-4 sm:p-6">
          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className={`inline-block px-2.5 py-0.5 radius-sb text-xs font-semibold ${
                    tag.variant === "primary"
                      ? "bg-primary-light text-primary"
                      : tag.variant === "success"
                        ? "bg-green-50 text-green-600"
                        : "bg-surface text-muted border border-border"
                  }`}>
                  {tag.label}
                </span>
              ))}
            </div>
          )}

          {rating !== undefined && (
            <div className="mb-3">
              <StarRow rating={rating} />
            </div>
          )}

          <h2 className="text-lg sm:subheading text-heading font-semibold leading-snug">{title}</h2>

          <p className="mt-3 sm:mt-4 text-text text-sm sm:body-text whitespace-pre-line">
            {description}
          </p>

          {cta && (
            <div className="mt-5 sm:mt-6">
              <a
                href={cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-lg bg-primary text-white px-6 py-3 button-text font-semibold hover:bg-primary-hover transition cursor-pointer">
                {cta.label}
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
