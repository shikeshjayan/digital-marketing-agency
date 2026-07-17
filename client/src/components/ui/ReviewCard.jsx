import StarRow from "./StarRow.jsx";

export default function ReviewCard({ review, onReadMore }) {
  const isLongText = review.review_text && review.review_text.length > 100;
  const initials = review.name
    ? review.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";
  const shortText = isLongText
    ? review.review_text.slice(0, 100).trim()
    : review.review_text;

  return (
    <div className="h-full bg-surface border border-border rounded-lg p-6 flex flex-col justify-between hover:shadow-md transition overflow-hidden">
      <div>
        <div className="flex items-center gap-3 w-full min-w-0">
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

        <div className="mt-4 text-text text-sm leading-relaxed wrap-break-word break-words w-full italic text-left">
          <span className="inline">&ldquo;{shortText}</span>
          {isLongText ? (
            <span className="inline">
              ...{" "}
              <button
                type="button"
                onClick={() => onReadMore(review)}
                className="inline text-sm font-bold text-primary hover:text-primary-hover hover:underline transition cursor-pointer not-italic select-none p-0 bg-transparent border-none outline-none">
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
  );
}
