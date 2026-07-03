import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faLightbulb,
  faPalette,
  faCode,
  faRocket,
  faChartLine,
  faCheckCircle,
  faStar,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import HeroSplit from "../../components/public/HeroSplit";
import FadeIn from "../../components/ui/FadeIn.jsx";
import SectionHeading from "../../components/ui/SectionHeading.jsx";
import AnimatedCounter from "../../components/ui/AnimatedCounter.jsx";
import { ServiceCardSkeleton } from "../../components/ui/Skeleton.jsx";
import useServiceStore from "../../store/serviceStore";
import useReviewStore from "../../store/reviewStore.js";
import { slugify } from "../../utils/slugify";
import imageUrl from "../../utils/imageUrl";

/* ─── Image resolver ──────────────────────────────────────── */
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

/* ─── Service Card ────────────────────────────────────────── */
const ServiceCard = ({ service }) => (
  <Link
    to={`/services/${slugify(service.service_name)}`}
    className="flex flex-col bg-background border border-border rounded-lg h-full overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300">
    <div className="h-40 overflow-hidden">
      <img
        src={resolveImagePath(service.image)}
        alt={service.service_name}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover bg-surface"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect fill='%23F8FAFC' width='400' height='200'/%3E%3Ctext x='200' y='105' text-anchor='middle' fill='%236B7280' font-size='16' font-family='sans-serif'%3ENo Image%3C/text%3E%3C/svg%3E";
        }}
      />
    </div>
    <div className="flex flex-col items-center text-center p-5 flex-1">
      <h3 className="text-lg font-extrabold text-heading">
        {service.service_name}
      </h3>
      <p className="mt-4 text-sm text-text leading-relaxed line-clamp-3">
        {service.short_description}
      </p>
      <span className="mt-6 mt-auto inline-flex items-center rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-primary-hover transition">
        Read More
      </span>
    </div>
  </Link>
);

/* ─── Process Steps ──────────────────────────────────────── */
const processSteps = [
  {
    icon: faSearch,
    title: "Discovery & Research",
    desc: "We dive deep into your business, audience, and goals to build a strategic foundation.",
  },
  {
    icon: faLightbulb,
    title: "Strategy & Planning",
    desc: "We craft a tailored roadmap with clear timelines, milestones, and deliverables.",
  },
  {
    icon: faPalette,
    title: "Design & Prototyping",
    desc: "Our designers create wireframes and visual mockups that align with your brand identity.",
  },
  {
    icon: faCode,
    title: "Development & Testing",
    desc: "Our engineers build robust, scalable solutions with rigorous quality assurance.",
  },
  {
    icon: faRocket,
    title: "Launch & Deployment",
    desc: "We handle the full launch process, ensuring everything runs smoothly from day one.",
  },
  {
    icon: faChartLine,
    title: "Optimization & Growth",
    desc: "Post-launch, we monitor performance and optimize for continuous improvement.",
  },
];

/* ─── Why Choose Us Reasons ──────────────────────────────── */
const whyChooseReasons = [
  "Custom strategies tailored to your unique business goals",
  "Transparent communication and dedicated project management",
  "Data-driven approach with measurable KPIs and reporting",
  "End-to-end solutions from design to deployment and marketing",
  "Agile development process with fast turnaround times",
  "Long-term partnership focus with ongoing support",
];

/* ─── Industries We Serve ────────────────────────────────── */
const industries = [
  "Healthcare",
  "E-Commerce",
  "Education",
  "Real Estate",
  "Finance",
  "Technology",
  "Hospitality",
  "Retail",
];

/* ─── Case Studies Stats ─────────────────────────────────── */
const caseStudyStats = [
  { target: 98, suffix: "%", label: "Client Retention" },
  { target: 3, suffix: "x", label: "Average ROI" },
  { target: 500, suffix: "+", label: "Projects Delivered" },
  { target: 24, suffix: "/7", label: "Support Available" },
];

/* ─── FAQ Data ────────────────────────────────────────────── */
const faqItems = [
  {
    q: "How long does a typical project take?",
    a: "Project timelines vary based on scope and complexity. A standard website takes 4-8 weeks, while larger digital marketing campaigns may run 3-6 months. We provide a detailed timeline during our discovery phase.",
  },
  {
    q: "What is your pricing structure?",
    a: "We offer flexible pricing models including project-based, retainer, and hourly rates. Each engagement is scoped individually to ensure you only pay for what you need. Contact us for a custom quote.",
  },
  {
    q: "Do you work with small businesses?",
    a: "Absolutely. We partner with businesses of all sizes — from startups and small businesses to large enterprises. Our solutions are scalable and tailored to fit your budget and goals.",
  },
  {
    q: "What results can I expect?",
    a: "While results vary by industry and goals, our clients typically see improved website traffic, higher conversion rates, and stronger brand visibility within the first few months of engagement.",
  },
  {
    q: "Do you provide ongoing support after launch?",
    a: "Yes. We offer ongoing maintenance, optimization, and support packages to ensure your digital presence continues to perform. Our team is available for updates, troubleshooting, and growth strategies.",
  },
];

/* ─── StarRow ─────────────────────────────────────────────── */
function StarRow({ rating }) {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-1 text-amber-500">
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

/* ─── Section: Our Process (Timeline) ─────────────────────── */
function OurProcess() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn>
          <SectionHeading
            eyebrow="How We Work"
            title="Our Process"
            subtitle="A proven methodology that delivers results every time."
          />
        </FadeIn>

        <div className="mt-10 relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />

          <div className="space-y-8 md:space-y-0">
            {processSteps.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <FadeIn
                  key={step.title}
                  delay={i * 100}
                  direction={isLeft ? "left" : "right"}>
                  <div
                    className={`relative md:grid md:grid-cols-2 md:gap-12 md:items-center ${i > 0 ? "md:mt-8" : ""}`}>
                    <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-lg">
                        {i + 1}
                      </div>
                    </div>

                    <div
                      className={`${isLeft ? "md:text-right md:pr-12" : "md:col-start-2 md:pl-12"}`}>
                      <div className="bg-surface border border-border rounded-lg p-6 hover:shadow-sm transition">
                        <div
                          className={`flex items-center gap-3 ${isLeft ? "md:justify-end" : ""}`}>
                          <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
                            <FontAwesomeIcon
                              icon={step.icon}
                              className="text-primary"
                            />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-primary uppercase tracking-wider">
                              Step {i + 1}
                            </div>
                            <h3 className="text-lg font-extrabold text-heading">
                              {step.title}
                            </h3>
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-text leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Why Choose Us ──────────────────────────────── */
function WhyChooseUs() {
  return (
    <section className="py-12 md:py-16 bg-surface">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <FadeIn direction="left">
            <div className="bg-background border border-border rounded-lg p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4">
                  <div className="text-4xl font-extrabold text-primary">
                    98%
                  </div>
                  <div className="mt-1 text-xs text-muted">
                    Client Retention
                  </div>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl font-extrabold text-primary">
                    24/7
                  </div>
                  <div className="mt-1 text-xs text-muted">
                    Support Available
                  </div>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl font-extrabold text-primary">3x</div>
                  <div className="mt-1 text-xs text-muted">Average ROI</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl font-extrabold text-primary">
                    100%
                  </div>
                  <div className="mt-1 text-xs text-muted">
                    Satisfaction Goal
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right">
            <div>
              <SectionHeading
                eyebrow="Our Edge"
                title="Why Choose Us"
                subtitle=""
              />
              <div className="mt-4 space-y-3">
                {whyChooseReasons.map((r, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-primary mt-0.5 shrink-0"
                    />
                    <span className="text-sm text-text leading-relaxed">
                      {r}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Industries We Serve ────────────────────────── */
function IndustriesWeServe() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn>
          <SectionHeading
            eyebrow="Who We Help"
            title="Industries We Serve"
            subtitle="We partner with businesses across a wide range of industries to deliver tailored digital solutions."
          />
        </FadeIn>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {industries.map((ind, i) => (
            <FadeIn key={ind} delay={i * 80}>
              <div className="px-6 py-4 bg-surface border border-border rounded-lg text-center flex items-center justify-center min-w-[150px] font-bold text-heading hover:text-primary transition-colors cursor-default select-none">
                {ind}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Case Studies / Results ─────────────────────── */
function CaseStudiesResults() {
  return (
    <section className="py-12 md:py-16 bg-surface">
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn>
          <SectionHeading
            eyebrow="Proven Results"
            title="Case Studies & Results"
            subtitle="Numbers that speak louder than words. Our track record of delivering measurable outcomes."
          />
        </FadeIn>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {caseStudyStats.map((stat, i) => (
            <FadeIn key={stat.label} delay={i * 100}>
              <div className="bg-background border border-border rounded-lg p-6 text-center hover:shadow-sm transition">
                <div className="text-4xl font-extrabold text-primary">
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                </div>
                <div className="mt-2 text-sm font-semibold text-text">
                  {stat.label}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Client Testimonials ────────────────────────── */
function TestimonialsSection({ reviews, loading }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reviews.length === 0 || paused) return;
    const t = setInterval(
      () => setIndex((v) => (v + 1) % reviews.length),
      3000,
    );
    return () => clearInterval(t);
  }, [reviews.length, paused]);

  if (loading) {
    return (
      <section className="py-12 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="mt-8 flex justify-center">
            <div className="w-full max-w-xl border border-border rounded-lg px-6 py-8 bg-surface text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-200 animate-pulse ring-2 ring-gray-300 ring-offset-2" />
              <div className="mt-4 h-4 w-24 bg-gray-200 rounded mx-auto animate-pulse" />
              <div className="mt-2 h-3 w-16 bg-gray-200 rounded mx-auto animate-pulse" />
              <div className="mt-4 space-y-2">
                <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-gray-200 rounded mx-auto animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!reviews.length) return null;
  const current = reviews[index];

  return (
    <section
      className="py-12 bg-background"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>
      <div className="max-w-5xl mx-auto px-4">
        <FadeIn>
          <SectionHeading
            eyebrow="Testimonials"
            title="What Our Clients Say"
            subtitle="Real feedback from businesses we've helped grow."
          />
        </FadeIn>

        <div className="mt-8 flex justify-center">
          <div className="w-full max-w-6xl border border-border rounded-lg px-6 py-8 bg-surface text-center">
            <div className="mx-auto w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary ring-offset-2 flex items-center justify-center shadow-md">
              {current.user_avatar ? (
                <img
                  src={imageUrl(current.user_avatar)}
                  alt={current.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className={`w-full h-full items-center justify-center text-lg font-bold text-primary-hover ${current.user_avatar ? "hidden" : "flex"}`}>
                {current.name
                  ?.split(" ")
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "?"}
              </div>
            </div>
            <div className="mt-4 font-bold text-heading">{current.name}</div>
            <div className="text-sm text-muted">{current.location}</div>
            <p className="mt-4 text-gray-700 leading-relaxed max-w-2xl mx-auto">
              &ldquo;{current.review_text}&rdquo;
            </p>
            <div className="mt-4">
              <StarRow rating={current.rating} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-5">
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`w-2.5 h-2.5 rounded-full transition cursor-pointer ${
                i === index
                  ? "bg-primary"
                  : "bg-primary-light hover:bg-primary-hover"
              }`}
              onClick={() => setIndex(i)}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section: FAQ Accordion ──────────────────────────────── */
function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (i) => {
    setActiveIndex(activeIndex === i ? null : i);
  };

  return (
    <section className="py-12 md:py-16 bg-surface">
      <div className="max-w-3xl mx-auto px-4">
        <FadeIn>
          <SectionHeading
            eyebrow="Questions"
            title="Frequently Asked Questions"
            subtitle="Find answers to common questions about our services and process."
          />
        </FadeIn>

        <div className="mt-10 space-y-3">
          {faqItems.map((item, i) => (
            <FadeIn key={i} delay={i * 80}>
              <div className="bg-background border border-border rounded-lg overflow-hidden">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer hover:bg-surface transition"
                  onClick={() => toggle(i)}>
                  <span className="font-semibold text-heading text-sm md:text-base pr-4">
                    {item.q}
                  </span>
                  <FontAwesomeIcon
                    icon={activeIndex === i ? faMinus : faPlus}
                    className="text-primary shrink-0"
                  />
                </button>
                {activeIndex === i && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-text leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Final CTA ──────────────────────────────────── */
function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="bg-dark py-16">
      <FadeIn>
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Ready to Grow Your Business?
          </h2>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Let's discuss how our digital marketing expertise can help you
            achieve your goals. Get in touch with us today for a free
            consultation.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              className="inline-flex items-center rounded-lg bg-primary text-white px-6 py-3 text-sm font-semibold hover:bg-primary-hover transition cursor-pointer"
              onClick={() => navigate("/contact")}>
              Contact Us
            </button>
            <Link
              to="/about"
              className="inline-flex items-center rounded-lg border border-white text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition">
              Learn More About Us
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

/* ─── Main Services Page ──────────────────────────────────── */
const Services = () => {
  const { services, loading, error, fetchServices } = useServiceStore();
  const { reviews, loading: reviewsLoading, fetchReviews } = useReviewStore();

  useEffect(() => {
    fetchServices();
    fetchReviews();
  }, [fetchServices, fetchReviews]);

  if (loading)
    return (
      <div>
        <HeroSplit
          title="Services"
          subtitle="We offer a wide range of services to meet your needs."
        />
        <section className="py-14 bg-surface">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      </div>
    );

  if (error)
    return (
      <div>
        <HeroSplit
          title="Services"
          subtitle="We offer a wide range of services to meet your needs."
        />
        <section className="py-14 bg-surface">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center py-20">
              <div className="text-primary font-medium mb-4">{error}</div>
              <button
                type="button"
                onClick={() => fetchServices()}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition cursor-pointer">
                Retry
              </button>
            </div>
          </div>
        </section>
      </div>
    );

  return (
    <div>
      {/* 1. Hero */}
      <HeroSplit
        title="Services"
        subtitle="We offer a wide range of services to meet your needs."
      />

      {/* 2. Services Grid */}
      <section className="py-14 bg-surface">
        <div className="max-w-6xl mx-auto px-4">
          {services.length === 0 ? (
            <div className="text-center py-20">
              <svg
                className="w-16 h-16 mx-auto text-muted opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <div className="mt-4 text-lg font-semibold text-heading">
                No services available
              </div>
              <div className="mt-2 text-sm text-text">
                Check back later for our services.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s, i) => (
                <FadeIn key={s._id} delay={i * 100}>
                  <ServiceCard service={s} />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. Our Process (Timeline) */}
      <OurProcess />

      {/* 4. Why Choose Us */}
      <WhyChooseUs />

      {/* 5. Industries We Serve */}
      <IndustriesWeServe />

      {/* 6. Case Studies / Results */}
      <CaseStudiesResults />

      {/* 7. Client Testimonials */}
      <TestimonialsSection reviews={reviews} loading={reviewsLoading} />

      {/* 8. FAQ */}
      <FAQSection />

      {/* 9. Final CTA */}
      <FinalCTA />
    </div>
  );
};

export default Services;
