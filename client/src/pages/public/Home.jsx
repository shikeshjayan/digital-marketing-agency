import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { slugify } from "../../utils/slugify.js";
import FadeIn from "../../components/ui/FadeIn.jsx";
import LogoMarquee from "../../components/public/LogoMarquee.jsx";
import StatsSection from "../../components/public/StatsSection.jsx";
import TestimonialsSection from "../../components/public/TestimonialsSection.jsx";
import usePageStore from "../../store/pageStore.js";

function HeroCarousel() {
  const navigate = useNavigate();
  const slides = useMemo(
    () => [
      {
        subheading: "Grow your business with digital strategies that work.",
        description:
          "From high-converting websites to data-driven marketing campaigns, we help businesses attract more customers and increase revenue.",
      },
      {
        subheading: "Your success is our strategy.",
        description:
          "We combine web development, SEO, branding, and digital marketing to build a strong online presence that delivers measurable results.",
      },
      {
        subheading: "Turn clicks into customers.",
        description:
          "We create conversion-focused websites and marketing campaigns that help businesses generate more leads, sales, and long-term growth.",
      },
      {
        subheading: "Designed for performance. Built for growth.",
        description:
          "Our team delivers modern websites, engaging content, and strategic marketing that help your business stand out online.",
      },
      {
        subheading: "Elevate your brand in the digital world.",
        description:
          "We design impactful digital experiences that strengthen your brand and connect you with the right audience.",
      },
      {
        subheading: "Creative thinking meets measurable results.",
        description:
          "From strategy and branding to development and marketing, we help businesses grow with confidence.",
      },
    ],
    [],
  );

  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setIndex((v) => (v + 1) % slides.length);
    }, 5000);
    return () => clearInterval(t);
  }, [slides.length, paused]);

  function go(next) {
    if (animating) return;
    setAnimating(true);
    setIndex(next);
    window.setTimeout(() => setAnimating(false), 450);
  }

  return (
    <section
      className="bg-primary relative overflow-hidden min-h-[520px] md:min-h-[580px] lg:min-h-[620px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-lg rotate-12" />
        <div className="absolute top-24 left-24 w-24 h-24 bg-white/10 rounded-lg rotate-12" />
        <div className="absolute bottom-10 right-16 w-20 h-20 bg-white/10 rounded-lg rotate-12" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div
            className={`relative transition-all duration-700 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <img
              src="/homepage.webp"
              alt="Digital Marketing Agency Hero"
              width="380"
              height="380"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              onLoad={() => setLoaded(true)}
              className="w-full h-[280px] md:h-[340px] lg:h-[380px] rounded-3xl object-cover"
            />
            <div className="absolute -bottom-8 -right-8 -z-10 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
          </div>
          <div className="text-white text-center lg:text-left min-h-[12.5rem] lg:min-h-[14rem]" key={index}>
            <div className="animate-page-fade">
              <div className="small-text font-bold tracking-widest uppercase inline-block px-3 py-1 rounded">
                DIGITAL MARKETING AGENCY
              </div>
              <h2 className="mt-3 hero-heading text-white">
                {slides[index].subheading}
              </h2>
               <p className="mt-4 body-text text-white/90 max-w-prose">
                 {slides[index].description}
               </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              <button
                type="button"
                className="inline-flex items-center rounded-lg bg-background text-primary px-6 py-3 text-sm font-bold hover:bg-primary-hover hover:text-background transition cursor-pointer"
                onClick={() => navigate("/contact")}>
                Get Started
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-lg border border-white px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition cursor-pointer"
                onClick={() => navigate("/services")}>
                Our Services
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-white/15 border border-white/20 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer"
            onClick={() => go((index - 1 + slides.length) % slides.length)}
            aria-label="Previous slide">
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`w-2.5 h-2.5 rounded-full transition cursor-pointer ${
                i === index ? "bg-background" : "bg-white/40 hover:bg-white/70"
              }`}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-white/15 border border-white/20 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer"
            onClick={() => go((index + 1) % slides.length)}
            aria-label="Next slide">
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </div>
      </div>
    </section>
  );
}

function ServicesCarousel({ services }) {
  const displayServices = useMemo(() => services.slice(0, 9), [services]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchRef = useRef(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const chunks = useMemo(() => {
    const size = isMobile ? 1 : 3;
    const res = [];
    for (let i = 0; i < displayServices.length; i += size) {
      res.push(displayServices.slice(i, i + size));
    }
    return res;
  }, [displayServices, isMobile]);

  useEffect(() => {
    if (chunks.length <= 1 || paused) return;
    const t = setInterval(() => {
      setIndex((v) => (v + 1) % chunks.length);
    }, 4500);
    return () => clearInterval(t);
  }, [chunks.length, paused]);

  function go(next) {
    setIndex(next);
  }

  const handleTouchStart = useCallback((e) => {
    touchRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (touchRef.current === null || chunks.length <= 1) return;
      const diff = touchRef.current - e.changedTouches[0].clientX;
      const threshold = 50;
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          go((index + 1) % chunks.length);
        } else {
          go((index - 1 + chunks.length) % chunks.length);
        }
      }
      touchRef.current = null;
    },
    [index, chunks.length],
  );

  if (displayServices.length === 0) {
    return (
      <section className="py-12 bg-background-section">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-background rounded-lg  border border-border overflow-hidden card-shadow">
            <div className="px-6 py-12 md:px-10 text-center">
              <p className="text-muted body-text font-body">No featured services available at the moment.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentChunk = chunks[Math.min(index, chunks.length - 1)] || [];

  return (
    <section className="py-12 bg-background-section">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Heading with "Our Solutions" mini-heading removed completely */}
        <div className="text-center mb-10">
          <h2 className="section-heading text-heading">Featured Services</h2>
        </div>

        <div className="relative">
          <div className="relative">
            <div
              className="touch-pan-y"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}>
              
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch animate-scroll-effect">
                {currentChunk.map((item, i) => (
                  <div 
                    key={item._id}
                    className="bg-background rounded-lg  border border-border overflow-hidden flex flex-col justify-between p-6 h-full min-h-[250px] card-shadow"
                  >
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <h3 className="subheading text-heading line-clamp-1">
                        {item.service_name.split(" ").slice(0, 2).join(" ")}{" "}
                        <span className="text-heading">
                          {item.service_name.split(" ").slice(2).join(" ")}
                        </span>
                      </h3>
                      <p className="mt-3 small-text text-text line-clamp-4 flex-1">
                        {item.short_description || item.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between">
                      <Link
                        to={`/services/${slugify(item.service_name)}`}
                        className="inline-flex items-center rounded-lg bg-primary text-white px-4 py-2 button-text hover:bg-primary-hover transition cursor-pointer">
                        Read More
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {chunks.length > 1 && (
              <>
                <div className="hidden md:block absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
                  <button
                    type="button"
                    className="w-12 h-12 rounded-full bg-background border border-border  hover:bg-surface flex items-center justify-center cursor-pointer card-shadow"
                    onClick={() => go((index - 1 + chunks.length) % chunks.length)}
                    aria-label="Previous slide layer">
                    <FontAwesomeIcon icon={faAngleLeft} />
                  </button>
                </div>
                <div className="hidden md:block absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
                  <button
                    type="button"
                    className="w-12 h-12 rounded-full bg-background border border-border  hover:bg-surface flex items-center justify-center cursor-pointer card-shadow"
                    onClick={() => go((index + 1) % chunks.length)}
                    aria-label="Next slide layer">
                    <FontAwesomeIcon icon={faAngleRight} />
                  </button>
                </div>
              </>
            )}
          </div>

          {chunks.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                type="button"
                className="md:hidden w-9 h-9 rounded-full bg-background border border-border hover:bg-surface flex items-center justify-center cursor-pointer card-shadow"
                onClick={() => go((index - 1 + chunks.length) % chunks.length)}
                aria-label="Previous slide">
                <FontAwesomeIcon icon={faAngleLeft} />
              </button>
              <div className="hidden md:flex items-center gap-2">
                {chunks.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`w-2.5 h-2.5 rounded-full transition cursor-pointer ${
                      i === index ? "bg-primary" : "bg-primary-light hover:bg-primary-hover"
                    }`}
                    onClick={() => go(i)}
                    aria-label={`Go to slide panel index ${i + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                className="md:hidden w-9 h-9 rounded-full bg-background border border-border hover:bg-surface flex items-center justify-center cursor-pointer card-shadow"
                onClick={() => go((index + 1) % chunks.length)}
                aria-label="Next slide">
                <FontAwesomeIcon icon={faAngleRight} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function TechnologyStack({ items = [] }) {
  if (!items.length) return null;
  return (
    <section className="bg-secondary py-14 text-center">
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn className="w-full">
          <div className="text-white">
            <div className="font-headings text-4xl  font-bold text-primary">Our</div>
            <h2 className="mt-2 section-heading">Technology Stack</h2>
          </div>
        </FadeIn>

        <div className="mt-10 flex flex-wrap justify-center gap-6">
          {items.map((it, i) => (
            <FadeIn key={it.name} delay={i * 80}>
              <div className="w-28 h-28 flex flex-col items-center justify-center text-white  rounded-lg hover:text-primary hover:scale-110 transition-all duration-300 cursor-default">
                <div className="text-2xl font-extrabold">{it.code}</div>
                <div
                  className="mt-1 text-sm text-white/90 text-center max-w-20 truncate"
                  title={it.name}>
                  {it.name}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { homePage, loading, error, fetchPageHome } = usePageStore();
  const navigate = useNavigate();

  const services = homePage?.services ?? [];
  const reviews = homePage?.reviews ?? [];
  const content = homePage?.siteContent ?? null;
  const techItems = content?.technologyStackItems ?? [];
  const companyStats = content?.companyStats ?? [];
  const trustLogos = content?.trustMarqueeLogos ?? [];

  useEffect(() => {
    fetchPageHome();
  }, [fetchPageHome]);

  if (error)
    return (
      <div>
        <HeroCarousel />
        <section className="py-14 bg-surface">
          <div className="max-w-6xl mx-auto px-4 text-center py-20">
            <div className="text-primary font-medium mb-4">{error}</div>
            <button
              type="button"
              onClick={() => fetchPageHome()}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition cursor-pointer button-text">
              Retry
            </button>
          </div>
        </section>
      </div>
    );

  return (
    <div>
      <HeroCarousel />

      {loading ? (
        <section className="py-12 md:py-16 bg-background-section">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-surface border border-border rounded-lg p-6 text-center animate-pulse card-shadow">
                  <div className="w-10 h-10 bg-surface-border rounded-lg mx-auto" />
                  <div className="mt-3 h-8 w-16 bg-surface-border rounded mx-auto" />
                  <div className="mt-1 h-4 w-20 bg-surface-border rounded mx-auto" />
                </div>
              ))}
            </div>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-background border border-border rounded-lg p-6 min-h-[250px] animate-pulse card-shadow">
                  <div className="h-5 w-3/4 bg-surface-border rounded" />
                  <div className="mt-3 space-y-2">
                    <div className="h-3 w-full bg-surface-border rounded" />
                    <div className="h-3 w-5/6 bg-surface-border rounded" />
                    <div className="h-3 w-4/6 bg-surface-border rounded" />
                  </div>
                  <div className="mt-5 pt-4 border-t border-border">
                    <div className="h-9 w-24 bg-surface-border rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <>
          <StatsSection stats={companyStats} />
          <ServicesCarousel services={services} />
        </>
      )}

      {loading ? (
        <section className="bg-secondary py-14">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-28 h-28 bg-white/10 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <TechnologyStack items={techItems} />
      )}

      {loading ? (
        <section className="py-12 bg-background">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-[calc(20%-12px)] min-w-[140px] h-16 bg-surface border border-border rounded-lg animate-pulse card-shadow" />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <LogoMarquee logos={trustLogos} bg="bg-background" />
      )}

      {/* Team teaser */}
      <section className="bg-secondary py-16 text-white">
        <FadeIn>
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="section-heading">
              <span className="font-headings text-primary pr-2">Meet</span> Our
              Team
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={100}>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto text-center leading-relaxed px-4">
            A creative and technical team focused on delivering premium
            digital experiences.
          </p>
        </FadeIn>
        <div className="mt-8 flex justify-center">
          <FadeIn delay={200}>
            <button
              type="button"
              className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-sm font-bold hover:bg-primary-hover transition cursor-pointer"
              onClick={() => navigate("/team")}>
              Read More
            </button>
          </FadeIn>
        </div>
      </section>

      <TestimonialsSection
        reviews={reviews}
        loading={loading}
        eyebrow="Feedback"
        title="That Speaks"
        bg="bg-background-section"
      />
    </div>
  );
}