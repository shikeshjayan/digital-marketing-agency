import resolveImagePath from "../../utils/resolveImagePath.js";

export default function TeamCard({ member }) {
  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??";
  };

  const hasPhoto = member.photo && member.photo.trim() !== "";
  const hasLinkedin = member.linkedin && member.linkedin.trim() !== "";
  const hasEmail = member.email && member.email.trim() !== "";

  return (
    <div className="flex flex-col bg-background border border-border rounded-lg overflow-hidden w-[300px] max-w-full card-shadow">
      <div className="relative w-full aspect-[3/4] overflow-hidden">
        {hasPhoto ? (
          <img
            src={resolveImagePath(member.photo)}
            alt={member.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
              const fallbackElement = e.target.nextSibling;
              if (fallbackElement) fallbackElement.style.display = "flex";
            }}
          />
        ) : null}

        <div
          className="absolute inset-0 w-full h-full items-center justify-center bg-surface text-primary text-5xl font-bold select-none"
          style={{ display: hasPhoto ? "none" : "flex" }}
        >
          {getInitials(member.name)}
        </div>

        {(hasLinkedin || hasEmail) && (
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {hasLinkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-primary transition-colors backdrop-blur-sm"
                aria-label={`${member.name} on LinkedIn`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            )}
            {hasEmail && (
              <a
                href={`mailto:${member.email}`}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-primary transition-colors backdrop-blur-sm"
                aria-label={`Email ${member.name}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            )}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-5 pb-5 pt-16">
          <h3 className="subheading text-white leading-tight">{member.name}</h3>
          <p className="mt-1 text-sm text-white/80 line-clamp-2 break-words">{member.designation}</p>
        </div>
      </div>
    </div>
  );
}
