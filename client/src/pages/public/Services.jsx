import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faMicrochip, faArrowRight } from "@fortawesome/free-solid-svg-icons";
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
import useServiceStore from "../../store/serviceStore";
import useReviewStore from "../../store/reviewStore.js";
import useCaseStudyStore from "../../store/caseStudyStore";
import useIndustryStore from "../../store/industryStore.js";
import useTechnologyStore from "../../store/technologyStore.js";
import useFaqStore from "../../store/faqStore.js";
import useSiteContentStore from "../../store/siteContentStore.js";
import { slugify } from "../../utils/slugify";
import resolveImagePath from "../../utils/resolveImagePath";
import ImageLoader from "../../components/ui/ImageLoader.jsx";

/* ─── Service Card ────────────────────────────────────────── */
const ServiceCard = ({ service }) => (
  <Link
    to={`/services/${slugify(service.service_name)}`}
    className="flex flex-col bg-background border border-border rounded-lg h-full overflow-hidden group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
    <div className="h-48 overflow-hidden">
      <ImageLoader
        src={service.hero_image}
        alt={service.service_name}
        type="service"
        className="w-full h-full transition-transform duration-500 group-hover:scale-110"
      />
    </div>
    <div className="flex flex-col items-center text-center p-6 flex-1">
      <h3 className="subheading text-heading">
        {service.service_name}
      </h3>
      <p className="mt-3 small-text text-text body-text line-clamp-3">
        {service.short_description}
      </p>
      <span className="mt-auto pt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
        Learn More <FontAwesomeIcon icon={faArrowRight} />
      </span>
    </div>
  </Link>
);

/* ─── Introduction ────────────────────────────────────────── */
function Introduction() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <FadeIn>
          <p className="body-text md:subheading text-text">
            We are a full-service digital marketing agency dedicated to helping businesses
            of all sizes grow their online presence and achieve measurable results. From
            custom web development and SEO to social media management and brand strategy,
            our team crafts tailored solutions that solve real business problems and drive
            long-term success.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── Industries We Serve ─────────────────────────────────── */
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
        
        {/* Fixed: Converted to dynamic flex layout wrapping rules with explicit basis mapping to support Tailwind CSS v4 compiler metrics flawlessly */}
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          {industries.map((ind, i) => (
            <FadeIn key={ind._id || i} delay={i * 80}>
              <div className="bg-surface border border-border rounded-lg p-5 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group cursor-default h-full">
                <div className="w-12 h-12 mx-auto rounded-lg bg-primary-light flex items-center justify-center group-hover:bg-primary transition-colors">
                  {ind.iconType === "image" && ind.icon ? (
                    <img src={resolveImagePath(ind.icon)} alt={ind.name} className="w-6 h-6 object-contain group-hover:brightness-0 group-hover:invert transition-all" />
                  ) : (
                    <FontAwesomeIcon icon={faBuilding} className="text-primary text-xl group-hover:text-white transition-colors" />
                  )}
                </div>
                <h3 className="mt-3 small-text font-bold text-heading">{ind.name}</h3>
                <p className="mt-1.5 text-xs text-text leading-relaxed">{ind.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Featured Case Studies ───────────────────────────────── */
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
              <div key={i} className="bg-background border border-border rounded-lg p-6 h-64 w-full md:w-[calc(33.33%-16px)] animate-pulse">
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
            <p className="text-muted">No featured case studies available yet.</p>
          </div>
        ) : (
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            {caseStudies.map((cs, i) => (
              <FadeIn key={cs._id} delay={i * 100} className="w-full md:basis-[calc(50%-12px)] lg:basis-[calc(33.33%-16px)] max-w-sm lg:max-w-none">
                <div className="bg-background border border-border rounded-lg p-6 h-full flex flex-col hover:shadow-md transition group">
                  {cs.hero_image && (
                    <div className="-mx-6 -mt-6 mb-4 overflow-hidden rounded-t-lg">
                      <img
                        src={resolveImagePath(cs.hero_image)}
                        alt={cs.title}
                        className="w-full h-40 object-cover"
                      />
                    </div>
                  )}
                  <span className="text-xs font-semibold text-primary bg-primary-light px-2.5 py-1 rounded w-fit">
                    {cs.results?.[0]?.title || "Case Study"}
                  </span>
                  <h3 className="mt-3 body-text font-bold text-heading">{cs.title}</h3>
                  {cs.results?.[0] && (
                    <div className="mt-3 text-2xl font-extrabold text-primary">
                       {cs.results[0].value}
                    </div>
                  )}
                  <p className="mt-2 small-text text-text body-text flex-1 line-clamp-3">{cs.overview}</p>
                  <Link
                    to={`/case-studies/${cs.slug}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                    Read Case Study <FontAwesomeIcon icon={faArrowRight} />
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Technologies & Platforms ────────────────────────────── */
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
            <FadeIn key={tech._id || i} delay={i * 60}>
              <div className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-3 hover:shadow-sm hover:border-primary/30 transition-all duration-200 cursor-default">
                <div className="w-9 h-9 rounded-md bg-primary-light flex items-center justify-center shrink-0">
                  {tech.iconType === "image" && tech.icon ? (
                    <img src={resolveImagePath(tech.icon)} alt={tech.name} className="w-5 h-5 object-contain" />
                  ) : (
                    <FontAwesomeIcon icon={faMicrochip} className="text-primary text-sm" />
                  )}
                </div>
                <span className="small-text font-semibold text-heading">{tech.name}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Case Studies Stats ──────────────────────────────────── */
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
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {displayStats.map((stat, i) => (
            <FadeIn key={stat.key || i} delay={i * 100}>
              <div className="bg-surface border border-border rounded-lg p-6 text-center hover:shadow-sm transition">
                <div className="text-4xl font-extrabold text-primary">
                  <AnimatedCounter target={stat.target} suffix={stat.suffix || ""} />
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

/* ─── Main Services Page ──────────────────────────────────── */
export default function Services() {
  const { services, loading, error, fetchServices } = useServiceStore();
  const { reviews, loading: reviewsLoading, fetchReviews } = useReviewStore();
  const { caseStudies, loading: caseStudiesLoading, fetchCaseStudies } = useCaseStudyStore();
  const { industries, fetchIndustries } = useIndustryStore();
  const { technologies, fetchTechnologies } = useTechnologyStore();
  const { faqs, fetchFAQs } = useFaqStore();
  const { content, fetchPublicSiteContent } = useSiteContentStore();

  const companyStats = content?.companyStats ?? [];

  const getStat = (key) => {
    const s = companyStats.find((st) => st.key === key);
    return s ? `${s.target}${s.suffix}` : "";
  };

  const whyChooseUsStats = ['clientRetention', 'support247', 'averageRoi', 'satisfactionGoal']
    .map(key => companyStats.find(s => s.key === key))
    .filter(Boolean)
    .map(s => ({ value: `${s.target}${s.suffix}`, label: s.label }));

  useEffect(() => {
    fetchServices();
    fetchReviews();
    fetchCaseStudies({ featured: true, limit: 3 });
    fetchIndustries();
    fetchTechnologies();
    fetchFAQs();
    fetchPublicSiteContent();
  }, [fetchServices, fetchReviews, fetchCaseStudies, fetchIndustries, fetchTechnologies, fetchFAQs, fetchPublicSiteContent]);

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
        titleHighlight="Our"
        subtitle="From high-converting websites to data-driven marketing campaigns, we deliver end-to-end digital solutions that help businesses attract more customers, increase revenue, and scale with confidence."
        primaryCTA={{ label: "Get a Free Quote", to: "/contact" }}
        secondaryCTA={{ label: "View Portfolio", to: "/projects" }}
        imageSrc="/services.webp"
        imageAlt="Our Services"
        trustIndicators={[
          { value: getStat("projectsCompleted") || "500+", label: "Projects\nCompleted" },
          { value: getStat("clientRetention") || "98%", label: "Client\nSatisfaction" },
          { value: getStat("yearsExperience") || "10+", label: "Years\nExperience" },
        ]}
      />

      {/* 2. Introduction */}
      <Introduction />

      {/* 3. Services Grid */}
      <section className="py-16 md:py-20 bg-background-section">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn>
            <SectionHeading
              eyebrow="What We Offer"
              title="Our Services"
              subtitle="Comprehensive digital solutions tailored to your business goals."
            />
          </FadeIn>
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
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s, i) => (
                <FadeIn key={s._id} delay={i * 100}>
                  <ServiceCard service={s} />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Why Choose Us */}
      <WhyChooseUs stats={whyChooseUsStats} bg="bg-background" />

      {/* 5. Our Process */}
      <OurProcess bg="bg-background-section" />

      {/* 6. Industries We Serve */}
      <IndustriesWeServe industries={industries} />

      {/* 7. Technologies & Platforms */}
      <TechnologiesPlatforms technologies={technologies} />

      {/* 8. Featured Case Studies */}
      <FeaturedCaseStudies caseStudies={caseStudies} loading={caseStudiesLoading} />

      {/* 9. Results & Statistics */}
      <ResultsStatistics stats={content?.companyStats} />

      {/* 10. Client Testimonials */}
      <TestimonialsSection reviews={reviews} loading={reviewsLoading} bg="bg-background" />

      {/* 11. FAQ */}
      <FAQSection items={faqs.map((f) => ({ q: f.question, a: f.answer }))} bg="bg-background-section" />

      {/* 12. Final CTA */}
      <FinalCTA />

      {/* 13. Trust Section */}
      <LogoMarquee logos={content?.trustMarqueeLogos} bg="bg-background" />
    </div>
  );
}