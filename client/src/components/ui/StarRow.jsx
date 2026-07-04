import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function StarRow({ rating }) {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-1 text-amber-500" aria-label={`${rating} out of 5 stars`} role="img">
      {Array.from({ length: 5 }).map((_, i) => (
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className={i < full ? "text-amber-500" : "text-gray-300"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
