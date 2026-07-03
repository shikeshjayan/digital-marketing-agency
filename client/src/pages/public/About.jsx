import { useEffect, useMemo } from "react";
import HeroSplit from "../../components/public/HeroSplit.jsx";
import FadeIn from "../../components/ui/FadeIn.jsx";
import useTeamStore from "../../store/teamStore.js";
import imageUrl from "../../utils/imageUrl.js";

// Port Resolver helper ensuring executive profile pictures load cleanly during development loops
const resolveImagePath = (path) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  
  const isDev = import.meta.env.DEV;
  const hasApiUrlEnv = !!import.meta.env.VITE_API_URL;
  
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  if (isDev && !hasApiUrlEnv) {
    return `http://localhost:5000${cleanPath}`;
  }
  return imageUrl(cleanPath);
};

function ProfileRow({ name, title, description, placeholderInitials, photoUrl }) {
  const imageSrc = photoUrl ? resolveImagePath(photoUrl) : null;

  return (
    <div className="group flex flex-col sm:flex-row gap-6 items-start bg-background border border-border rounded-lg p-6 md:p-8 transition duration-300 cursor-pointer select-none h-full w-full min-w-0">
      {/* Visual Asset Block */}
      <div className="flex justify-center items-center cursor-pointer shrink-0 mx-auto sm:mx-0 bg-surface rounded-lg overflow-hidden">
        <div className="w-32 sm:w-36 aspect-square flex items-center justify-center overflow-hidden cursor-pointer">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={name || "Executive Profile"}
              loading="lazy"
              className="w-full h-full object-cover object-top rounded-lg aspect-square"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "none";
                const fallbackElement = e.target.nextSibling;
                if (fallbackElement) fallbackElement.style.display = "flex";
              }}
            />
          ) : null}

          {/* Centered raw fallback initials text with no box/square container underneath */}
          <span
            className="w-full text-4xl font-black font-sans tracking-widest text-primary uppercase py-2 flex items-center justify-center text-center cursor-pointer select-none group-hover:scale-110 transition-transform duration-500"
            style={{ display: imageSrc ? "none" : "flex" }}>
            {placeholderInitials}
          </span>
        </div>
      </div>

      {/* Profile Details Block - flex-1 and flex-col forces it to stretch to the exact bottom line */}
      <div className="text-text cursor-pointer text-center sm:text-left min-w-0 flex-1 flex flex-col h-full">
        <div className="text-xl font-extrabold text-heading cursor-pointer hover:text-primary transition-colors duration-300 truncate w-full">
          {name}
        </div>
        <div className="mt-1 text-xs font-bold text-primary uppercase tracking-wider cursor-pointer truncate w-full">
          {title}
        </div>
        {/* flex-1 guarantees this text field occupies all naturally distributed layout room evenly */}
        <p className="mt-3 leading-relaxed text-justify text-text text-sm break-words w-full flex-1">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function About() {
  const store = useTeamStore();
  const team = store.team ?? [];
  const fetchTeam = store.fetchTeam || (() => {});

  // Automatically fetch team records upon component mounting
  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  // Filters for active team profiles and sorts them by display_order rank dynamically
  const activeExecutives = useMemo(() => {
    return [...team]
      .filter((m) => m.status === "Active")
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  }, [team]);

  return (
    <div className="bg-background min-h-screen">
      <HeroSplit
        title="Us"
        titleHighlight="About"
        subtitle="Welcome to a team that blends creative design, reliable development, and performance marketing."
        leftColor="bg-dark"
      />

      <section className="py-14 bg-surface">
        <div className="max-w-6xl mx-auto px-4 space-y-12 md:space-y-16">
          {/* Welcome Banner Card */}
          <FadeIn>
            <div className="py-4 md:py-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center cursor-pointer select-none text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold text-heading tracking-tight cursor-pointer leading-tight">
                Hello, <span className="text-primary">Welcome</span> to Digital Marketing
              </h2>
              <div className="text-sm text-text leading-relaxed text-justify space-y-3 cursor-pointer">
                <p className="cursor-pointer">
                  We help brands navigate and scale modern digital landscapes by
                  executing high-performance web engineering alongside robust
                  marketing strategy. Our engineering principles cut out
                  unnecessary layers to zero in on real results: identifying
                  exact business goals, transforming concepts into scalable
                  customer pipelines, building platforms with structural
                  cleanliness, and monitoring active engagement behaviors.
                </p>
                <p className="cursor-pointer">
                  By linking functional data capture analytics directly with
                  human-centric interfaces, we transform your digital channels
                  from static online bookmarks into high-velocity engines that
                  attract attention, build lasting consumer confidence, and
                  reliably optimize monetization cycles.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Profile Cards Wrapper - auto-rows-fr forces cards in the same row to match maximum heights perfectly */}
          {activeExecutives.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 auto-rows-fr">
              {activeExecutives.map((member, index) => {
                const initialsFallback = member.name
                  ? member.name
                      .trim()
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "??";

                return (
                  <FadeIn key={member._id} delay={index * 100} className="w-full h-full">
                    <ProfileRow
                      name={member.name}
                      title={member.designation}
                      placeholderInitials={initialsFallback}
                      photoUrl={member.photo}
                      description={member.description}
                    />
                  </FadeIn>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}