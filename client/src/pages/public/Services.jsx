import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeartPulse,
  faCartShopping,
  faGraduationCap,
  faBuilding,
  faMoneyBillTrendUp,
  faMicrochip,
  faConciergeBell,
  faStore,
  faArrowRight,
  faSearch,
  faAd,
  faEnvelope,
  faChartLine,
  faGlobe,
  faPalette,
  faShoppingBag,
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
import useServiceStore from "../../store/serviceStore";
import useReviewStore from "../../store/reviewStore.js";
import { slugify } from "../../utils/slugify";
import resolveImagePath from "../../utils/resolveImagePath";

/* ─── Service Card ────────────────────────────────────────── */
const ServiceCard = ({ service }) => (
  <Link
    to={`/services/${slugify(service.service_name)}`}
    className="flex flex-col bg-background border border-border rounded-lg h-full overflow-hidden group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
    <div className="h-48 overflow-hidden">
      <img
        src={resolveImagePath(service.image)}
        alt={service.service_name}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover bg-surface transition-transform duration-500 group-hover:scale-110"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect fill='%23F8FAFC' width='400' height='200'/%3E%3Ctext x='200' y='105' text-anchor='middle' fill='%236B7280' font-size='16' font-family='sans-serif'%3ENo Image%3C/text%3E%3C/svg%3E";
        }}
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

/* ─── Industries We Serve ────────────────────────────────── */
const industries = [
  { name: "Healthcare", icon: faHeartPulse, desc: "Digital solutions for clinics, hospitals, and health tech startups." },
  { name: "E-Commerce", icon: faCartShopping, desc: "Conversion-focused stores and marketplace strategies." },
  { name: "Education", icon: faGraduationCap, desc: "Engaging platforms for schools, courses, and ed-tech." },
  { name: "Real Estate", icon: faBuilding, desc: "Listings, virtual tours, and lead generation systems." },
  { name: "Finance", icon: faMoneyBillTrendUp, desc: "Trust-building websites for fintech and advisory firms." },
  { name: "Technology", icon: faMicrochip, desc: "SaaS, apps, and tech product marketing." },
  { name: "Hospitality", icon: faConciergeBell, desc: "Booking-driven designs for hotels and restaurants." },
  { name: "Retail", icon: faStore, desc: "Omnichannel strategies for physical and online stores." },
];

function IndustriesWeServe() {
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

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {industries.map((ind, i) => (
            <FadeIn key={ind.name} delay={i * 80}>
              <div className="bg-surface border border-border rounded-lg p-5 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group cursor-default h-full">
                <div className="w-12 h-12 mx-auto rounded-lg bg-primary-light flex items-center justify-center group-hover:bg-primary transition-colors">
                  <FontAwesomeIcon
                    icon={ind.icon}
                    className="text-primary text-xl group-hover:text-white transition-colors"
                  />
                </div>
                <h3 className="mt-3 small-text font-bold text-heading">{ind.name}</h3>
                <p className="mt-1.5 text-xs text-text leading-relaxed">{ind.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Featured Case Studies ──────────────────────────────── */
const featuredCases = [
  {
    client: "NovaTech Solutions",
    industry: "Technology",
    metric: "+312% Organic Traffic",
    result: "Top-3 rankings for 15 target keywords in 6 months.",
  },
  {
    client: "GreenLeaf Retail",
    industry: "Retail / E-Commerce",
    metric: "+47% Conversion Rate",
    result: "2.8x increase in monthly revenue after UX redesign.",
  },
  {
    client: "BrightPath Academy",
    industry: "Education",
    metric: "+180% Enrollment Inquiries",
    result: "65% reduction in cost-per-lead via Google Ads.",
  },
];

function FeaturedCaseStudies() {
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

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCases.map((cs, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="bg-background border border-border rounded-lg p-6 h-full flex flex-col hover:shadow-md transition group">
                <span className="text-xs font-semibold text-primary bg-primary-light px-2.5 py-1 rounded w-fit">
                  {cs.industry}
                </span>
                <h3 className="mt-3 body-text font-bold text-heading">{cs.client}</h3>
                <div className="mt-3 text-2xl font-extrabold text-primary">
                  {cs.metric}
                </div>
                <p className="mt-2 small-text text-text body-text flex-1">{cs.result}</p>
                <Link
                  to="/projects"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                  Read Case Study <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Technologies & Platforms ──────────────────────────── */
const technologies = [
  { name: "Google Ads", icon: faAd },
  { name: "Meta Ads", icon: faGlobe },
  { name: "SEO", icon: faSearch },
  { name: "WordPress", icon: faGlobe },
  { name: "Shopify", icon: faShoppingBag },
  { name: "WooCommerce", icon: faCartShopping },
  { name: "Google Analytics", icon: faChartLine },
  { name: "Search Console", icon: faSearch },
  { name: "HubSpot", icon: faChartLine },
  { name: "Mailchimp", icon: faEnvelope },
  { name: "Brand Strategy", icon: faPalette },
  { name: "Custom Development", icon: faMicrochip },
];

function TechnologiesPlatforms() {
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
            <FadeIn key={tech.name} delay={i * 60}>
              <div className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-3 hover:shadow-sm hover:border-primary/30 transition-all duration-200 cursor-default">
                <div className="w-9 h-9 rounded-md bg-primary-light flex items-center justify-center shrink-0">
                  <FontAwesomeIcon icon={tech.icon} className="text-primary text-sm" />
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

/* ─── Case Studies Stats ─────────────────────────────────── */
const caseStudyStats = [
  { target: 98, suffix: "%", label: "Client Retention" },
  { target: 3, suffix: "x", label: "Average ROI" },
  { target: 500, suffix: "+", label: "Projects Delivered" },
  { target: 24, suffix: "/7", label: "Support Available" },
];

function ResultsStatistics() {
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
          {caseStudyStats.map((stat, i) => (
            <FadeIn key={stat.label} delay={i * 100}>
              <div className="bg-surface border border-border rounded-lg p-6 text-center hover:shadow-sm transition">
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
  {
    q: "How do you handle communication during a project?",
    a: "We assign a dedicated project manager to every engagement. You'll receive regular progress updates, have access to a shared dashboard, and can reach us via email, phone, or Slack during business hours.",
  },
  {
    q: "What if I need revisions after the project is delivered?",
    a: "We include a revision round in every project scope. If additional changes are needed beyond the initial agreement, we offer flexible revision packages at transparent rates so you're never caught off guard.",
  },
  {
    q: "Can you help with post-launch marketing and growth?",
    a: "Yes. Our services extend well beyond launch. We offer SEO, paid advertising, social media management, content marketing, and analytics reporting to keep your business growing long after the site goes live.",
  },
];

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
        titleHighlight="Our"
        subtitle="From high-converting websites to data-driven marketing campaigns, we deliver end-to-end digital solutions that help businesses attract more customers, increase revenue, and scale with confidence."
        primaryCTA={{ label: "Get a Free Quote", to: "/contact" }}
        secondaryCTA={{ label: "View Portfolio", to: "/projects" }}
        imageSrc="/services.webp"
        imageAlt="Our Services"
        trustIndicators={[
          { value: "500+", label: "Projects\nCompleted" },
          { value: "98%", label: "Client\nSatisfaction" },
          { value: "10+", label: "Years\nExperience" },
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

      {/* 4. Why Choose Us (moved above Our Process) */}
      <WhyChooseUs bg="bg-background" />

      {/* 5. Our Process */}
      <OurProcess bg="bg-background-section" />

      {/* 6. Industries We Serve */}
      <IndustriesWeServe />

      {/* 7. Technologies & Platforms */}
      <TechnologiesPlatforms />

      {/* 8. Featured Case Studies */}
      <FeaturedCaseStudies />

      {/* 9. Results & Statistics */}
      <ResultsStatistics />

      {/* 10. Client Testimonials */}
      <TestimonialsSection reviews={reviews} loading={reviewsLoading} bg="bg-background" />

      {/* 11. FAQ */}
      <FAQSection items={faqItems} bg="bg-background-section" />

      {/* 12. Final CTA */}
      <FinalCTA />

      {/* 13. Trust Section */}
      <LogoMarquee bg="bg-background" />
    </div>
  );
};

export default Services;
