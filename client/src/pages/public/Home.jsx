import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { slugify } from "../../utils/slugify.js";
import AnimatedCounter from "../../components/ui/AnimatedCounter.jsx";
import FadeIn from "../../components/ui/FadeIn.jsx";
import LogoMarquee from "../../components/public/LogoMarquee.jsx";
import TestimonialsSection from "../../components/public/TestimonialsSection.jsx";
import useServiceStore from "../../store/serviceStore.js";
import useReviewStore from "../../store/reviewStore.js";

function HeroCarousel() {
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
          <div className="text-white min-h-50" key={index}>
            <div className="animate-page-fade">
              <div className="text-sm font-bold tracking-widest uppercase inline-block px-3 py-1 rounded">
                DIGITAL MARKETING AGENCY
              </div>
              <h2 className="mt-3 hero-heading text-white">
                {slides[index].subheading}
              </h2>
              <p className="mt-4 body-text text-white/90 max-w-prose">
                {slides[index].description}
              </p>
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
  const displayServices = useMemo(() => services.slice(0, 3), [services]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchRef = useRef(null);

  useEffect(() => {
    if (displayServices.length === 0 || paused) return;
    const t = setInterval(() => {
      setIndex((v) => (v + 1) % displayServices.length);
    }, 3500);
    return () => clearInterval(t);
  }, [displayServices.length, paused]);

  function go(next) {
    setIndex(next);
  }

  const handleTouchStart = useCallback((e) => {
    touchRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (touchRef.current === null) return;
      const diff = touchRef.current - e.changedTouches[0].clientX;
      const threshold = 50;
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          go((index + 1) % displayServices.length);
        } else {
          go((index - 1 + displayServices.length) % displayServices.length);
        }
      }
      touchRef.current = null;
    },
    [index, displayServices.length],
  );

  if (displayServices.length === 0) {
    return (
      <section className="py-12 bg-background-section">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-background rounded-lg shadow-sm border border-border overflow-hidden">
            <div className="px-6 py-10 md:px-10">
              <div className="animate-pulse space-y-4">
                <div className="h-4 w-24 bg-surface rounded" />
                <div className="h-6 w-64 bg-surface rounded" />
                <div className="h-16 w-full max-w-xl bg-surface rounded" />
                <div className="h-10 w-28 bg-surface rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const current = displayServices[index];

  return (
    <section className="py-12 bg-background-section">
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative">
          <div className="relative">
            <div
              className="bg-background rounded-lg shadow-sm border border-border overflow-hidden touch-pan-y"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}>
              <div className="min-h-[280px] md:min-h-[260px] lg:min-h-[280px]">
                <div className="px-6 py-10 md:px-10 h-full">
                  <div className="flex items-stretch gap-6 h-full">
                    <div className="hidden md:flex items-center justify-center">
                      <div className="w-24 h-24 rounded-lg flex items-center justify-center">
                        <div
                          className="text-8xl font-extrabold text-muted select-none"
                          aria-hidden="true">
                          {index + 1}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col text-center md:text-left h-full">
                      <div className="text-sm text-muted">Featured Service</div>
                      <h3 className="mt-2 section-heading text-heading">
                        {current.service_name.split(" ").slice(0, 2).join(" ")}{" "}
                        <span className="text-primary-hover">
                          {current.service_name.split(" ").slice(2).join(" ")}
                        </span>
                      </h3>
                      <p className="mt-3 text-text body-text max-w-xl line-clamp-2 mx-auto md:mx-0 flex-1">
                        {current.description}
                      </p>
                      <div className="mt-auto pt-6 flex items-center justify-center md:justify-start gap-3">
                        <button
                          type="button"
                          className="md:hidden w-10 h-10 rounded-full bg-surface border border-border hover:bg-border flex items-center justify-center cursor-pointer"
                          onClick={() =>
                            go(
                              (index - 1 + displayServices.length) %
                                displayServices.length,
                            )
                          }
                          aria-label="Previous service">
                          <FontAwesomeIcon
                            icon={faAngleLeft}
                            className="text-sm"
                          />
                        </button>
                        <Link
                          to={`/services/${slugify(current.service_name)}`}
                          className="inline-flex items-center rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-primary-hover transition cursor-pointer">
                          Read More
                        </Link>
                        <button
                          type="button"
                          className="md:hidden w-10 h-10 rounded-full bg-surface border border-border hover:bg-border flex items-center justify-center cursor-pointer"
                          onClick={() =>
                            go((index + 1) % displayServices.length)
                          }
                          aria-label="Next service">
                          <FontAwesomeIcon
                            icon={faAngleRight}
                            className="text-sm"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:block absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
              <button
                type="button"
                className="w-12 h-12 rounded-full bg-background border border-border shadow-sm hover:bg-surface flex items-center justify-center cursor-pointer"
                onClick={() =>
                  go(
                    (index - 1 + displayServices.length) %
                      displayServices.length,
                  )
                }
                aria-label="Previous service">
                <FontAwesomeIcon icon={faAngleLeft} />
              </button>
            </div>
            <div className="hidden md:block absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
              <button
                type="button"
                className="w-12 h-12 rounded-full bg-background border border-border shadow-sm hover:bg-surface flex items-center justify-center cursor-pointer"
                onClick={() => go((index + 1) % displayServices.length)}
                aria-label="Next service">
                <FontAwesomeIcon icon={faAngleRight} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6">
            {displayServices.map((s, i) => (
              <button
                key={s._id}
                type="button"
                className={`w-2.5 h-2.5 rounded-full transition cursor-pointer ${
                  i === index
                    ? "bg-primary"
                    : "bg-primary-light hover:bg-primary-hover"
                }`}
                onClick={() => go(i)}
                aria-label={`Go to service ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const techItems = [
  { name: "WordPress", code: "WP" },
  { name: "Angular", code: "AG" },
  { name: "HTML5", code: "H5" },
  { name: "CSS3", code: "C3" },
  { name: "Bootstrap", code: "BS" },
  { name: "jQuery", code: "JQ" },
  { name: "PHP", code: "PH" },
];

function TechnologyStack() {
  return (
    <section className="bg-secondary py-14">
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn>
          <div className="text-center text-white">
            <div className="font-headings text-4xl text-primary">Our</div>
            <h2 className="mt-2 section-heading">Technology Stack</h2>
          </div>
        </FadeIn>

        <div className="mt-10 flex flex-wrap justify-center gap-6">
          {techItems.map((it, i) => (
            <FadeIn key={it.name} delay={i * 80}>
              <div className="w-28 h-28 flex flex-col items-center justify-center text-white  rounded-lg hover:text-primary hover:scale-110 transition-all duration-300 cursor-default shadow-lg">
                <div className="text-2xl font-extrabold">{it.code}</div>
                <div
                  className="mt-1 text-xs text-white/90 text-center max-w-20 truncate"
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

function StatsSection() {
  return (
    <section className="bg-background py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <FadeIn direction="left">
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-full max-w-md">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-background border border-border">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-semibold text-heading">
                    Innovation meets execution
                  </span>
                </div>
                <h3 className="mt-4 section-heading text-heading">
                  Why teams trust us
                </h3>
                <p className="mt-3 text-text body-text">
                  We combine design, engineering, and marketing strategy to
                  deliver websites and campaigns that perform.
                </p>
                <div className="mt-8">
                  <Link
                    to="/about"
                    className="inline-flex rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-primary-hover transition cursor-pointer">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <FadeIn delay={100}>
              <div className="bg-background border border-border rounded-lg p-6 text-center shadow-sm flex flex-col items-center justify-center min-h-[120px]">
                <div className="text-4xl font-extrabold text-heading">
                  <AnimatedCounter target={8} suffix="+" />
                </div>
                <div className="mt-2 text-sm font-semibold text-text">
                  Years of Experience
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <div className="bg-background border border-border rounded-lg p-6 text-center shadow-sm flex flex-col items-center justify-center min-h-[120px]">
                <div className="text-4xl font-extrabold text-heading">
                  <AnimatedCounter target={500} suffix="+" />
                </div>
                <div className="mt-2 text-sm font-semibold text-text">
                  Projects Completed
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={300}>
              <div className="bg-background border border-border rounded-lg p-6 text-center shadow-sm flex flex-col items-center justify-center min-h-[120px]">
                <div className="text-4xl font-extrabold text-heading">
                  <AnimatedCounter target={500} suffix="+" />
                </div>
                <div className="mt-2 text-sm font-semibold text-text">
                  Satisfied Clients
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { services, fetchServices } = useServiceStore();
  const { reviews, loading: reviewsLoading, fetchReviews } = useReviewStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
    fetchReviews();
  }, [fetchServices, fetchReviews]);

  return (
    <div>
      <HeroCarousel />
      <StatsSection />
      <ServicesCarousel services={services} />
      <TechnologyStack />
      <LogoMarquee bg="bg-background" />

      {/* Team teaser */}
      <section className="bg-secondary py-16 text-white">
        <FadeIn>
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="section-heading">
              <span className="font-headings text-primary pr-2">Meet</span> Our
              Team
            </div>
            <p className="mt-4 text-white/70 max-w-2xl mx-auto leading-relaxed">
              A creative and technical team focused on delivering premium
              digital experiences.
            </p>
            <div className="mt-8">
              <button
                type="button"
                className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold hover:bg-primary-hover transition cursor-pointer"
                onClick={() => navigate("/team")}>
                Read More
              </button>
            </div>
          </div>
        </FadeIn>
      </section>

      <TestimonialsSection
        reviews={reviews}
        loading={reviewsLoading}
        eyebrow="Feedback"
        title="That Speaks"
        bg="bg-background-section"
      />
    </div>
  );
}
