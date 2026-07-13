import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedCounter from "../ui/AnimatedCounter.jsx";
import useInView from "../../hooks/useInView.js";

export default function HeroSplit({
  title,
  titleHighlight = "Our",
  subtitle,
  imageSrc,
  imageAlt = "Hero image",
  gradientFrom = "from-secondary",
  gradientVia = "via-secondary",
  gradientTo = "to-black",
  primaryCTA,
  secondaryCTA,
  trustIndicators,
  children,
}) {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [trustRef, trustInView] = useInView();

  function parseNumericValue(value) {
    const m = String(value ?? "").match(/^(\d+(?:\.\d+)?)(.*)$/);
    return m ? { target: parseFloat(m[1]), suffix: m[2] } : null;
  }

  function handleCTA(to) {
    if (!to) return;
    if (to.startsWith("#")) {
      const el = document.querySelector(to);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (to.startsWith("tel:") || to.startsWith("mailto:")) {
      window.location.href = to;
    } else {
      navigate(to);
    }
  }

  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br ${gradientFrom} ${gradientVia} ${gradientTo} min-h-[520px] md:min-h-[580px] lg:min-h-[620px]`}>
      <div className="absolute inset-0 bg-black/30" />

      <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div
            className={`relative transition-all duration-700 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <img
              src={imageSrc || "/the-creative-idea-Nz3ztzCRE9g-unsplash.png"}
              alt={imageAlt}
              width="380"
              height="380"
              loading="eager"
              decoding="async"
              onLoad={() => setLoaded(true)}
              className="w-full h-[280px] md:h-[340px] lg:h-[380px] rounded-3xl object-contain"
            />
            <div className="absolute -bottom-8 -right-8 -z-10 h-36 w-36 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-primary/30 blur-3xl -z-10" />
          </div>

          <div className="text-center lg:text-left">
            <div
              className={`transition-all duration-700 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: "0ms" }}>
              <h1 className="hero-heading text-white">
                <span className="text-primary">{titleHighlight}</span> {title}
              </h1>
            </div>

            {subtitle && (
              <div
                className={`transition-all duration-700 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: "150ms" }}>
                <p className="mt-6 max-w-xl body-text leading-8 text-white/70 mx-auto lg:mx-0">
                  {subtitle}
                </p>
              </div>
            )}

            {(primaryCTA || secondaryCTA) && (
              <div
                className={`transition-all duration-700 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: "300ms" }}>
                <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  {primaryCTA && (
                    <button
                      type="button"
                      className="inline-flex items-center rounded-lg bg-primary text-white px-6 py-3 text-sm font-semibold hover:bg-primary-hover transition cursor-pointer"
                      onClick={() =>
                        primaryCTA.to
                          ? handleCTA(primaryCTA.to)
                          : primaryCTA.onClick?.()
                      }>
                      {primaryCTA.label}
                    </button>
                  )}
                  {secondaryCTA && (
                    <button
                      type="button"
                      className="inline-flex items-center rounded-lg border border-white text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition cursor-pointer"
                      onClick={() =>
                        secondaryCTA.to
                          ? handleCTA(secondaryCTA.to)
                          : secondaryCTA.onClick?.()
                      }>
                      {secondaryCTA.label}
                    </button>
                  )}
                </div>
              </div>
            )}

            {children}

            {trustIndicators && trustIndicators.length > 0 && (
              <div
                ref={trustRef}
                className={`transition-all duration-700 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: "450ms" }}>
                <div className="mt-8 flex flex-col items-center gap-3 md:flex-row md:items-center md:justify-start md:gap-6">
                  {trustIndicators.map((item, i) => {
                    const parsed = item.target != null
                      ? { target: item.target, suffix: item.suffix || "" }
                      : parseNumericValue(item.value);
                    return (
                      <div key={i} className="flex items-center gap-2 whitespace-nowrap">
                        <span className="text-xl md:text-2xl font-extrabold text-white tabular-nums">
                          {parsed ? (
                            <AnimatedCounter target={parsed.target} suffix={parsed.suffix} isInView={trustInView} />
                          ) : (
                            item.value
                          )}
                        </span>
                        <span className="small-text text-white/60 leading-tight">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
