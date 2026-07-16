import { Link } from "react-router-dom";
import AnimatedCounter from "../ui/AnimatedCounter.jsx";
import FadeIn from "../ui/FadeIn.jsx";

export default function StatsSection({ stats = [], bg = "bg-background" }) {
  const displayStats = stats.slice(0, 3);
  if (!displayStats.length) return null;
  return (
    <section className={`py-12 ${bg}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <FadeIn direction="left">
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-full max-w-md">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-background border border-border card-shadow">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-semibold text-heading">
                    Innovation meets execution
                  </span>
                </div>
                <h3 className="mt-4 section-heading text-heading">
                  Why teams trust us
                </h3>
                <p className="mt-3 text-text body-text font-body">
                  We combine design, engineering, and marketing strategy to
                  deliver websites and campaigns that perform.
                </p>
                <div className="mt-8">
                  <Link
                    to="/about"
                    className="inline-flex rounded-lg bg-primary text-white px-5 py-2.5 button-text hover:bg-primary-hover transition cursor-pointer">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
            {displayStats.map((stat, i) => (
              <FadeIn key={stat.key || i} delay={(i + 1) * 100} className="h-full">
                {({ isInView, ref }) => (
                <div ref={ref} className="bg-background border border-border rounded-lg p-6 text-center  flex flex-col items-center justify-center h-full min-h-[120px] card-shadow">
                  <div className="text-4xl font-extrabold text-heading">
                    <AnimatedCounter target={stat.target} suffix={stat.suffix || ""} isInView={isInView} />
                  </div>
                  <div className="mt-2 small-text font-semibold text-text"
                  style={{ '--font-size-st': '12px' }}
                  >
                    {stat.label}
                  </div>
                </div>
                )}
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
