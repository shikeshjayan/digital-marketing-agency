import { useState } from "react";
import resolveImagePath from "../../utils/resolveImagePath.js";

const typeLabels = {
  project: "Project",
  service: "Service",
  "case-study": "Case Study",
  team: "Team",
  industry: "Industry",
  technology: "Technology",
  image: "Image",
};

export default function ImageLoader({
  src,
  alt = "",
  className = "",
  type = "image",
}) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const resolvedSrc = resolveImagePath(src);
  const label = typeLabels[type] || typeLabels.image;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && !errored && (
        <div className="absolute inset-0 animate-pulse bg-surface" />
      )}
      {errored ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-surface gap-2">
          <img
            src="/crown-99.png"
            alt="CrawlCrown Logo"
            className="w-10 h-10 object-contain opacity-60"
          />
          <span className="text-[10px] font-semibold text-muted uppercase tracking-widest">
            {label}
          </span>
          <span className="text-xs text-muted/70">Image Not Available</span>
        </div>
      ) : (
        <img
          src={resolvedSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          } ${className}`}
        />
      )}
    </div>
  );
}
