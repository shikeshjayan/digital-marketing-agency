import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faMicrochip,
  faArrowRight,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import HeroSplit from "../../components/public/HeroSplit";
import FadeIn from "../../components/ui/FadeIn.jsx";
import SectionHeading from "../../components/ui/SectionHeading.jsx";
import AnimatedCounter from "../../components/ui/AnimatedCounter.jsx";
import { ServiceCardSkeleton } from "../../components/ui/Skeleton.jsx";
import OurProcess from "../../components/public/OurProcess.jsx";
import WhyChooseUs from "../../components/public/WhyChooseUs.jsx";
import FAQSection from "../../components/public/FAQSection.jsx";
import FinalCTA from "../../components/public/FinalCTA.jsx";
import TestimonialsSection from "../../components/public/TestimonialsSection.jsx";
import LogoMarquee from "../../components/public/LogoMarquee.jsx";
import usePageStore from "../../store/pageStore";
import { slugify } from "../../utils/slugify";
import resolveImagePath from "../../utils/resolveImagePath";
import ImageLoader from "../../components/ui/ImageLoader.jsx";

/* ==========================================
   Service Card Component
   ========================================== */
const ServiceCard = ({ service }) => (
  <Link
    to={`/services/${slugify(service.service_name)}`}
    className="flex flex-col bg-background border border-border rounded-lg h-full w-full overflow-hidden group hover:-translate-y-1 transition-all duration-300">
    {/* Image Container */}
    <div className="h-48 w-full overflow-hidden shrink-0">
      <ImageLoader
        src={service.hero_image}
        alt={service.service_name}
        type="service"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    </div>

    {/* Content Container */}
    <div className="flex flex-col p-6 flex-1 min-w-0">
      <h3 className="subheading text-heading text-center font-bold line-clamp-1 break-words px-1">
        {service.service_name}
      </h3>

      <p className="mt-3 small-text text-text body-text text-center line-clamp-3 wrap-break-word break-words flex-1">
        {service.short_description}
      </p>

      <div className="mt-6 pt-4 border-t border-border/50 text-center">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all button-text">
          Learn More <FontAwesomeIcon icon={faArrowRight} />
        </span>
      </div>
    </div>
  </Link>
);

/* ==========================================
   Introduction Section Component
   ========================================== */
function Introduction() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <FadeIn>
          <p className="body-text md:subheading text-text">
            We are a full-service digital marketing agency dedicated to helping
            businesses of all sizes grow their online presence and achieve
            measurable results. From custom web development and SEO to social
            media management and brand strategy, our team crafts tailored
            solutions that solve real business problems and drive long-term
            success.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

/* ==========================================
   Industries We Serve Component
   ========================================== */
function IndustriesWeServe({ industries = [] }) {
  if (!industries.length) return null;
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn>
          <SectionHeading
            eyebrow="Who We Help"
            title="Industries We Serve"
            subtitle="We partner with businesses across a wide range of industries to deliver tailored digital solutions that drive growth."
          />
        </FadeIn>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {industries.slice(0, 8).map((ind, i) => {
            return (
              <FadeIn key={ind._id || i} delay={i * 40} className="flex">
                <div className="bg-surface w-full border border-border rounded-lg p-5 text-center hover:-translate-y-0.5 transition-all duration-300 group cursor-default h-full flex flex-col justify-center card-shadow">
                  <div className="w-12 h-12 mx-auto rounded-lg bg-primary-light flex items-center justify-center group-hover:bg-primary transition-colors">
                    {ind.iconType === "image" && ind.icon ? (
                      <img
                        src={resolveImagePath(ind.icon)}
                        alt={ind.name}
                        loading="lazy"
                        decoding="async"
                        className="w-6 h-6 object-contain group-hover:brightness-0 group-hover:invert transition-all"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faBuilding}
                        className="text-primary text-xl group-hover:text-white transition-colors"
                      />
                    )}
                  </div>
                  <h3 className="mt-3 small-text font-bold text-heading">
                    {ind.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-text leading-relaxed">
                    {ind.description}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   Featured Case Studies Component
   ========================================== */
function FeaturedCaseStudies({ caseStudies, loading }) {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn>
          <SectionHeading
            eyebrow="Success Stories"
            title="Featured Case Studies"
            subtitle="Real challenges. Strategic solutions. Measurable outcomes."
          />
        </FadeIn>
        {loading ? (
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-background border border-border rounded-lg p-6 h-64 w-full md:w-[calc(33.33%-16px)] animate-pulse card-shadow">
                <div className="h-4 w-20 bg-surface rounded" />
                <div className="h-5 w-40 bg-surface rounded mt-4" />
                <div className="h-8 w-32 bg-surface rounded mt-3" />
                <div className="h-4 w-full bg-surface rounded mt-3" />
                <div className="h-4 w-2/3 bg-surface rounded mt-2" />
              </div>
            ))}
          </div>
        ) : caseStudies.length === 0 ? (
          <div className="mt-10 text-center py-12">
            <p className="text-muted">
              No featured case studies available yet.
            </p>
          </div>
        ) : (
          <div className="mt-10 flex flex-wrap justify-center gap-6 items-stretch">
            {caseStudies.map((cs, i) => (
              <FadeIn
                key={cs._id}
                delay={i * 40}
                className="w-full md:basis-[calc(50%-12px)] lg:basis-[calc(33.33%-16px)] max-w-sm lg:max-w-none flex min-w-0">
                 <div className="bg-background border border-border rounded-lg p-6 w-full flex flex-col justify-between hover:shadow-md transition group card-shadow min-w-0">
                  <div className="flex flex-col flex-1 min-w-0">
                    {cs.hero_image && (
                      <div className="-mx-6 -mt-6 mb-4 overflow-hidden rounded-t-lg bg-surface shrink-0 min-w-0 h-40 relative">
                        <ImageLoader
                          src={cs.hero_image}
                          alt={cs.title}
                          type="case-study"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <span className="text-xs font-semibold text-primary bg-primary-light px-2.5 py-1 rounded-sb w-fit text-xxs truncate max-w-full">
                      {cs.results?.[0]?.title || "Case Study"}
                    </span>

                    <h3 className="mt-3 text-base font-bold text-heading line-clamp-1 break-words">
                      {cs.title}
                    </h3>

                    {cs.results?.[0] && (
                      <div className="mt-3 text-2xl font-extrabold text-primary">
                        {cs.results[0].value}
                      </div>
                    )}

                    <p
                      className="mt-2 mb-4 text-sm leading-relaxed text-text break-words"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}>
                      {cs.overview}
                    </p>
                  </div>

                  <div className="mt-auto pt-2">
                    <Link
                      to={`/case-studies/${cs.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all button-text">
                      Read Case Study <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ==========================================
   Technologies & Platforms Component
   ========================================== */
function TechnologiesPlatforms({ technologies = [] }) {
  if (!technologies.length) return null;
  return (
    <section className="py-16 md:py-20 bg-background-section">
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn>
          <SectionHeading
            eyebrow="Our Ecosystem"
            title="Technologies & Platforms"
            subtitle="We work with the tools and platforms that power modern digital businesses."
          />
        </FadeIn>
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {technologies.map((tech, i) => (
            <FadeIn key={tech._id || i} delay={i * 30}>
              <div className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-3 hover:border-primary/30 transition-all duration-200 cursor-default card-shadow">
                <div className="w-9 h-9 rounded-md bg-primary-light flex items-center justify-center shrink-0">
                  {tech.iconType === "image" && tech.icon ? (
                    <img
                      src={resolveImagePath(tech.icon)}
                      alt={tech.name}
                      loading="lazy"
                      decoding="async"
                      className="w-5 h-5 object-contain"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faMicrochip}
                      className="text-primary text-sm"
                    />
                  )}
                </div>
                <span className="small-text font-semibold text-heading">
                  {tech.name}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   Proven Results / Our Impact Component
   ========================================== */
function ResultsStatistics({ stats = [] }) {
  const displayStats = stats.slice(0, 4);
  if (!displayStats.length) return null;
  return (
    <section className="py-16 md:py-20 bg-background-section">
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn>
          <SectionHeading
            eyebrow="Proven Results"
            title="Our Impact"
            subtitle="Numbers that speak louder than words. Our track record of delivering measurable outcomes."
          />
        </FadeIn>

        <FadeIn>
          {({ isInView, ref }) => (
            <div
              ref={ref}
              className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {displayStats.map((stat, i) => {
                const numericTarget =
                  Number(String(stat.target || "").replace(/[^0-9.]/g, "")) ||
                  0;

                return (
                  <div
                    key={stat.key || i}
                    className="bg-surface border border-border rounded-lg p-6 text-center hover:shadow-md transition card-shadow">
                    <div className="text-4xl font-extrabold text-primary">
                      <AnimatedCounter
                        target={numericTarget}
                        suffix={stat.suffix || ""}
                        isInView={isInView}
                      />
                    </div>
                    <div className="mt-2 text-sm font-semibold text-text">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </FadeIn>
      </div>
    </section>
  );
}

/* ==========================================
   Paginated Services Section
   ========================================== */
function PaginatedServicesSection({ services = [] }) {
  const [page, setPage] = useState(0);

  if (!services || services.length === 0) {
    return (
      <section className="py-16 md:py-20 bg-background-section">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn>
            <SectionHeading
              eyebrow="What We Offer"
              title="Our Services"
              subtitle="Comprehensive digital solutions tailored to your business goals."
            />
          </FadeIn>
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
            <div className="mt-4 text-lg font-semibold text-heading subheading">
              No services available
            </div>
            <div className="mt-2 text-sm text-text small-text">
              Check back later for our services.
            </div>
          </div>
        </div>
      </section>
    );
  }

  const perPage = 3;
  const totalPages = Math.ceil(services.length / perPage);
  const visible = services.slice(page * perPage, page * perPage + perPage);

  const prev = () => setPage((v) => (v - 1 + totalPages) % totalPages);
  const next = () => setPage((v) => (v + 1) % totalPages);

  return (
    <section className="py-16 md:py-20 bg-background-section">
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn>
          <div className="text-center sm:text-left">
            <SectionHeading
              eyebrow="What We Offer"
              title="Our Services"
              subtitle="Comprehensive digital solutions tailored to your business goals."
            />
          </div>
        </FadeIn>

        {totalPages > 1 && (
          <FadeIn>
            <div className="flex items-center justify-center sm:justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={prev}
                className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-white transition cursor-pointer"
                aria-label="Previous services">
                <FontAwesomeIcon icon={faAngleLeft} className="text-sm" />
              </button>
              <button
                type="button"
                onClick={next}
                className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-white transition cursor-pointer"
                aria-label="Next services">
                <FontAwesomeIcon icon={faAngleRight} className="text-sm" />
              </button>
            </div>
          </FadeIn>
        )}

        <div
          key={page}
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-page-fade">
          {visible.map((s, i) => (
            <FadeIn key={s._id} delay={i * 100} className="flex w-full">
              <ServiceCard service={s} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   Main Services Page Component
   ========================================== */
export default function Services() {
  const { servicesPage, loading, error, fetchPageServices } = usePageStore();

  const services = servicesPage?.services ?? [];
  const reviews = servicesPage?.reviews ?? [];
  const caseStudies = servicesPage?.caseStudies ?? [];
  const caseStudiesLoading = loading;
  const industries = servicesPage?.industries ?? [];
  const technologies = servicesPage?.technologies ?? [];
  const faqs = servicesPage?.faqs ?? [];
  const content = servicesPage?.siteContent ?? null;
  const companyStats = content?.companyStats ?? [];

  const getStat = (key) => {
    const s = companyStats.find((st) => st.key === key);
    return s ? `${s.target}${s.suffix}` : "";
  };

  const whyChooseUsStats = [
    "clientRetention",
    "support247",
    "averageRoi",
    "satisfactionGoal",
  ]
    .map((key) => companyStats.find((s) => s.key === key))
    .filter(Boolean)
    .map((s) => ({
      target: Number(String(s.target || "").replace(/[^0-9.]/g, "")) || 0,
      suffix: s.suffix || "",
      label: s.label,
    }));

  useEffect(() => {
    fetchPageServices();
  }, [fetchPageServices]);

  if (loading)
    return (
      <div>
        <HeroSplit
          title="Services"
          subtitle="We offer a wide range of services to meet your needs."
        />
        <section className="py-14 bg-surface">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)] max-w-sm lg:max-w-none">
                  <ServiceCardSkeleton />
                </div>
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
                onClick={() => fetchPageServices()}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition cursor-pointer button-text">
                Retry
              </button>
            </div>
          </div>
        </section>
      </div>
    );

  return (
    <div className="animate-page-fade">
      {/* 1. Hero */}
      <HeroSplit
        title="Services"
        titleHighlight="Our"
        subtitle="From high-converting websites to data-driven marketing campaigns, we deliver end-to-end digital solutions that help businesses attract more customers, increase revenue, and scale with confidence."
        primaryCTA={{ label: "Get a Free Quote", to: "/contact" }}
        secondaryCTA={{ label: "View Portfolio", to: "/projects" }}
        imageSrc="/services.webp"
        imageAlt="Our Services"
        trustIndicators={[
          {
            value: getStat("projectsCompleted") || "500+",
            label: "Projects\nCompleted",
          },
          {
            value: getStat("clientRetention") || "98%",
            label: "Client\nSatisfaction",
          },
          {
            value: getStat("yearsExperience") || "10+",
            label: "Years\nExperience",
          },
        ]}
      />

      {/* 2. Introduction */}
      <Introduction />

      {/* 3. Services Paginated Grid */}
      <PaginatedServicesSection services={services} />

      {/* 4. Why Choose Us */}
      <FadeIn>
        <WhyChooseUs stats={whyChooseUsStats} bg="bg-background" />
      </FadeIn>

      {/* 5. Our Process */}
      <FadeIn>
        <OurProcess bg="bg-background-section" />
      </FadeIn>

      {/* 6. Industries We Serve */}
      <IndustriesWeServe industries={industries} />

      {/* 7. Technologies & Platforms */}
      <TechnologiesPlatforms technologies={technologies} />

      {/* 8. Featured Case Studies */}
      <FeaturedCaseStudies
        caseStudies={caseStudies}
        loading={caseStudiesLoading}
      />

      {/* 9. Results & Statistics */}
      <ResultsStatistics stats={content?.companyStats} />

      {/* 10. Client Testimonials */}
      <FadeIn>
        <TestimonialsSection
          reviews={reviews}
          loading={loading}
          bg="bg-background"
        />
      </FadeIn>

      {/* 11. FAQ */}
      <FadeIn>
        <FAQSection
          items={faqs.slice(0, 5).map((f) => ({ q: f.question, a: f.answer }))}
          bg="bg-background-section"
        />
      </FadeIn>

      {/* 12. Final CTA */}
      <FadeIn>
        <FinalCTA />
      </FadeIn>

      {/* 13. Trust Section */}
      <FadeIn>
        <LogoMarquee logos={content?.trustMarqueeLogos} bg="bg-background" />
      </FadeIn>
    </div>
  );
}
