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
  initials,
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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300" onClick={onClose} />
      
      {/* Pop-up container radius updated to rounded-lg */}
      <div
        className="relative z-10 bg-background rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col border border-border/50 transform scale-100 transition-all duration-300"
        onClick={(e) => e.stopPropagation()}>

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-muted hover:text-background hover:bg-primary shadow-sm hover:shadow transition duration-200 cursor-pointer"
          aria-label="Close">
          <FontAwesomeIcon icon={faTimes} className="text-xs" />
        </button>

        {isAvatar ? (
          <div className="flex flex-col items-center pt-10 pb-6 border-b border-border/60 bg-background-section px-6 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-4 ring-primary/10 shadow-md flex items-center justify-center bg-surface border border-border">
              {image ? (
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = IMAGE_PLACEHOLDER;
                  }}
                />
              ) : (
                <span className="text-xl sm:text-2xl font-extrabold text-primary tracking-wider select-none">
                  {initials || "?"}
                </span>
              )}
            </div>

            <h2 className="mt-4 text-xl font-bold text-heading leading-tight">{title}</h2>

            {tags && tags.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                {tags.map((tag, i) => tag && (
                  <span
                    key={i}
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      tag.variant === "primary"
                        ? "bg-primary-light text-primary"
                        : tag.variant === "success"
                          ? "bg-success/10 text-success"
                          : "bg-surface text-muted border border-border"
                    }`}>
                    {tag.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : image ? (
          <div className="w-full max-h-48 sm:max-h-64 overflow-hidden rounded-t-lg">
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

        <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
          <div>
            {!isAvatar && (
              <>
                {tags && tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {tags.map((tag, i) => tag && (
                      <span
                        key={i}
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          tag.variant === "primary"
                            ? "bg-primary-light text-primary"
                            : tag.variant === "success"
                              ? "bg-success/10 text-success"
                              : "bg-surface text-muted border border-border"
                        }`}>
                        {tag.label}
                      </span>
                    ))}
                  </div>
                )}
                <h2 className="text-xl font-bold text-heading mb-2">{title}</h2>
              </>
            )}

            {rating !== undefined && (
              <div className={isAvatar ? "flex justify-center mb-4" : "mb-4"}>
                <StarRow rating={rating} />
              </div>
            )}

            <div className={`text-text text-sm sm:text-base leading-relaxed whitespace-pre-line bg-surface rounded-lg p-4 border border-border/40 ${isAvatar ? "italic text-center text-text/90" : ""}`}>
              {isAvatar && <span className="text-primary font-headings text-2xl block -mb-2 text-left leading-none">"</span>}
              {description}
              {isAvatar && <span className="text-primary font-headings text-2xl block text-right leading-none -mt-2">"</span>}
            </div>
          </div>

          {cta && (
            <div className="mt-6">
              <a
                href={cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full rounded-lg bg-primary text-white px-6 py-3 text-sm font-semibold hover:bg-primary-hover shadow-sm hover:shadow transition duration-200 cursor-pointer">
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