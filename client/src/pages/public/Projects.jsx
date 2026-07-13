import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faClock,
  faCogs,
  faChevronLeft,
  faChevronRight,
  faArrowRight,
  faChartLine,
  faBullseye,
  faGlobe,
  faCheckCircle,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import usePageStore from "../../store/pageStore";
import HeroSplit from "../../components/public/HeroSplit.jsx";
import FadeIn from "../../components/ui/FadeIn.jsx";
import SectionHeading from "../../components/ui/SectionHeading.jsx";
import AnimatedCounter from "../../components/ui/AnimatedCounter.jsx";
import { ProjectCardSkeleton } from "../../components/ui/Skeleton.jsx";
import FinalCTA from "../../components/public/FinalCTA.jsx";
import TestimonialsSection from "../../components/public/TestimonialsSection.jsx";
import ImageLoader from "../../components/ui/ImageLoader.jsx";

/* ==========================================
   Project Card Component
   ========================================== */
const ProjectCard = ({ project }) => {
  return (
    <div className="group block bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary transition-all duration-300 h-full flex flex-col w-full">
      <div className="relative overflow-hidden aspect-[16/10] w-full bg-surface">
        <ImageLoader
          src={project.thumbnail || project.image}
          alt={project.project_name}
          type="project"
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="subheading text-heading group-hover:text-primary transition-colors duration-300 line-clamp-1">
          {project.project_name}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-xs flex-wrap">
          {project.services?.length > 0 && (
            <span className="inline-block px-2.5 py-0.5 rounded-sm bg-primary-light text-primary font-semibold text-xxs">
              {typeof project.services[0] === "object" ? project.services[0].service_name : "Service"}
            </span>
          )}
          {project.industries?.length > 0 && (
            <span className="inline-block px-2.5 py-0.5 rounded-sm bg-surface text-text font-semibold border border-border text-xxs">
              {typeof project.industries[0] === "object" ? project.industries[0].name : "Industry"}
            </span>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted text-xxs">
          {project.client?.name && (
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faBuilding} className="text-[10px]" />
              {project.client.name}
            </span>
          )}
          {project.completion_date && (
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faClock} className="text-[10px]" />
              {new Date(project.completion_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
            </span>
          )}
        </div>
        {project.technologies && project.technologies.length > 0 && (
          <div className="mt-2 flex items-center gap-1 text-xs text-muted text-xxs">
            <FontAwesomeIcon icon={faCogs} className="text-[10px]" />
            <span className="truncate">{project.technologies.map(t => typeof t === "object" ? t.name : t).join(", ")}</span>
          </div>
        )}
        <p className="mt-3 small-text text-text body-text line-clamp-2">
          {project.short_description}
        </p>
        <div className="mt-auto pt-4 flex items-center gap-4 text-sm font-semibold button-text">
          <Link
            to={`/projects/${project.slug}`}
            className="text-primary hover:text-primary-hover transition">
            Read more
          </Link>
          <a
            href={project.project_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-hover hover:gap-3 transition-all duration-300">
            <span>View Project</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </a>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   Project Statistics / Our Track Record Component
   ========================================== */
function ProjectStatistics({ stats = [] }) {
  const displayStats = stats.slice(0, 4);
  if (!displayStats.length) return null;
  return (
    <section className="py-12 md:py-16 bg-background-section">
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn>
          <div className="text-center text-text">
            <h2 className="mt-2 section-heading">
              <span className="font-headings text-primary mr-4">
                Our
              </span>
              Track Record
            </h2>
            <p className="mt-3 text-text max-w-xl mx-auto small-text md:body-text">
              Numbers that speak for our commitment to delivering excellence.
            </p>
          </div>
        </FadeIn>

        {/* Dynamic scroll tracking added for Track Record numbers */}
        <FadeIn>
          {({ isInView, ref }) => (
            <div ref={ref} className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
              {displayStats.map((s, i) => {
                const numericTarget = Number(String(s.target || "").replace(/[^0-9.]/g, "")) || 0;

                return (
                  <div key={s.key || i} className="bg-white/5 border border-white/10 rounded-lg p-6 text-center hover:bg-white/10 transition">
                    <div className="text-3xl md:text-4xl font-extrabold text-primary">
                      <AnimatedCounter 
                        target={numericTarget} 
                        suffix={s.suffix || ""} 
                        isInView={isInView} 
                      />
                    </div>
                    <div className="mt-2 small-text md:body-text text-text/70">
                      {s.label}
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
   Featured Case Study Component
   ========================================== */
function FeaturedCaseStudy({ projects }) {
  const featured = projects.find((p) => p.status === "Published") || projects[0];
  if (!featured) return null;
  return (
    <section className="py-12 md:py-16 bg-background-section">
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn>
          <SectionHeading
            eyebrow="Featured Work"
            title="Case Study"
            subtitle="A closer look at one of our most impactful projects."
          />
        </FadeIn>
        <FadeIn delay={40}>
          <div className="mt-8 bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative overflow-hidden aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:min-h-[320px] bg-surface">
                <ImageLoader
                  src={featured.thumbnail || featured.image}
                  alt={featured.project_name}
                  type="project"
                  className="w-full h-full"
                />
              </div>
              <div className="p-5 sm:p-6 lg:p-8 flex flex-col">
                <div className="flex items-center gap-2 text-xs flex-wrap">
                  {featured.services?.length > 0 && (
                    <span className="inline-block px-2.5 py-0.5 rounded-sm bg-primary-light text-primary font-semibold text-xxs">
                      {typeof featured.services[0] === "object" ? featured.services[0].service_name : "Service"}
                    </span>
                  )}
                  {featured.industries?.length > 0 && (
                    <span className="inline-block px-2.5 py-0.5 rounded-sm bg-surface text-text font-semibold border border-border text-xxs">
                      {typeof featured.industries[0] === "object" ? featured.industries[0].name : "Industry"}
                    </span>
                  )}
                </div>
                <h3 className="mt-3 subheading text-heading">
                  {featured.project_name}
                </h3>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted text-xxs">
                  {featured.client?.name && (
                    <span className="flex items-center gap-1.5">
                      <FontAwesomeIcon
                        icon={faBuilding}
                        className="text-[10px]"
                      />
                      {featured.client.name}
                    </span>
                  )}
                  {featured.completion_date && (
                    <span className="flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                      {new Date(featured.completion_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                    </span>
                  )}
                </div>
                {featured.technologies && featured.technologies.length > 0 && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-muted text-xxs">
                    <FontAwesomeIcon icon={faCogs} className="text-[10px]" />
                    <span>{featured.technologies.map(t => typeof t === "object" ? t.name : t).join(", ")}</span>
                  </div>
                )}
                <p className="mt-4 text-text small-text leading-relaxed">
                  {featured.short_description}
                </p>
                {featured.short_description &&
                  featured.short_description.length > 120 && (
                    <Link
                      to={`/projects/${featured.slug}`}
                      className="mt-1.5 self-start text-xs font-semibold text-primary hover:text-primary-hover transition text-xxs">
                      Read more
                    </Link>
                  )}
                <div className="mt-auto pt-5">
                  <a
                    href={featured.project_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-primary-hover transition cursor-pointer button-text">
                    <span>View Live Project</span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ==========================================
   Results & Analytics Component
   ========================================== */
function ResultsAnalytics({ stats = [] }) {
  const getStat = (key, type) => {
    const s = stats.find((st) => st.key === key);
    if (!s) return type === "target" ? 0 : "";
    return type === "target" 
      ? Number(String(s.target || "").replace(/[^0-9.]/g, "")) || 0
      : s.suffix || "";
  };

  const metrics = [
    {
      icon: faChartLine,
      target: getStat("averageRoi", "target") || 3,
      suffix: getStat("averageRoi", "suffix") || "x",
      label: "Average ROI",
      desc: "Return on investment for our clients",
    },
    {
      icon: faBullseye,
      target: getStat("onTimeDelivery", "target") || 95,
      suffix: getStat("onTimeDelivery", "suffix") || "%",
      label: "On-Time Delivery",
      desc: "Projects delivered within deadline",
    },
    {
      icon: faGlobe,
      target: getStat("countriesServed", "target") || 10,
      suffix: getStat("countriesServed", "suffix") || "+",
      label: "Countries Served",
      desc: "Global client reach",
    },
    {
      icon: faCheckCircle,
      target: getStat("uptimeGuaranteed", "target") || 99,
      suffix: getStat("uptimeGuaranteed", "suffix") || "%",
      label: "Uptime Guaranteed",
      desc: "Reliable hosted solutions",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn>
          <SectionHeading
            eyebrow="Performance"
            title="Results & Analytics"
            subtitle="Data-driven outcomes that demonstrate our impact."
          />
        </FadeIn>

        {/* Dynamic scroll tracking wrapper added for Results metrics */}
        <FadeIn>
          {({ isInView, ref }) => (
            <div ref={ref} className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((m) => (
                <div key={m.label} className="bg-surface border border-border rounded-lg p-6 text-center h-full hover:shadow-sm transition group flex flex-col items-center">
                  <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center mx-auto group-hover:bg-primary group-hover:text-white transition shrink-0">
                    <FontAwesomeIcon
                      icon={m.icon}
                      className="text-xl text-primary group-hover:text-white transition"
                    />
                  </div>
                  <div className="mt-4 text-3xl font-extrabold text-heading">
                    <AnimatedCounter 
                      target={m.target} 
                      suffix={m.suffix} 
                      isInView={isInView} 
                    />
                  </div>
                  <div className="mt-1 text-sm font-semibold text-heading subheading">
                    {m.label}
                  </div>
                  <div className="mt-auto pt-3 text-xs text-muted text-xxs w-full">
                    {m.desc}
                  </div>
                </div>
              ))}
            </div>
          )}
        </FadeIn>
      </div>
    </section>
  );
}

/* ==========================================
   Client Logos (Trusted By) Component
   ========================================== */
function ClientLogos({ logos = [] }) {
  if (!logos.length) return null;
  return (
    <section className="py-12 md:py-16 bg-background-section">
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn>
          <SectionHeading
            eyebrow="Trusted By"
            title="Our Clients"
            subtitle="We've had the privilege of working with amazing brands across industries."
          />
        </FadeIn>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {logos.map((logo, i) => (
            <FadeIn key={i} delay={i * 30} className="w-[calc(50%-8px)] sm:w-[calc(33.33%-11px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-12px)] min-w-[140px]">
              <div className="flex items-center justify-center bg-background border border-border rounded-lg px-4 py-5 hover:shadow-sm hover:border-primary/30 transition-all duration-200 cursor-default h-full w-full">
                <span className="text-sm font-semibold text-muted text-center small-text">
                  {logo}
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
   Before / After Results Component
   ========================================== */
const beforeAfterData = [
  { metric: "Organic Traffic", before: "4,200/mo", after: "12,100/mo" },
  { metric: "Lead Generation", before: "20/mo", after: "68/mo" },
  { metric: "Conversion Rate", before: "1.8%", after: "4.7%" },
  { metric: "Monthly Revenue", before: "$12K", after: "$38K" },
];

function BeforeAfterResults() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn>
          <SectionHeading
            eyebrow="Impact"
            title="Before & After"
            subtitle="Real transformations that speak for our work."
          />
        </FadeIn>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {beforeAfterData.map((item, i) => (
            <FadeIn key={item.metric} delay={i * 40}>
              <div className="bg-surface border border-border rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between">
                <div className="text-base font-bold text-heading small-text tracking-wide mb-4">
                  {item.metric}
                </div>
                
                <div className="flex flex-col items-center justify-center gap-1.5 flex-1 w-full">
                  <div className="w-full">
                    <div className="text-[10px] text-muted uppercase tracking-wider font-semibold opacity-70">
                      Before
                    </div>
                    <div className="text-lg font-extrabold text-muted/90 subheading truncate px-1">
                      {item.before}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center text-primary/70 my-1">
                    <FontAwesomeIcon icon={faArrowDown} className="text-xs" />
                  </div>
                  
                  <div className="w-full">
                    <div className="text-[10px] text-primary uppercase tracking-wider font-bold">
                      After
                    </div>
                    <div className="text-xl font-extrabold text-primary subheading truncate px-1">
                      {item.after}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================
   Main Projects Page Component
   ========================================== */
const Projects = () => {
  const [active, setActive] = useState("All");
  const { projectsPage, loading, error, fetchPageProjects } = usePageStore();

  const projects = projectsPage?.projects ?? [];
  const reviews = projectsPage?.reviews ?? [];
  const services = projectsPage?.services ?? [];
  const content = projectsPage?.siteContent ?? null;
  const scrollContainerRef = useRef(null);

  const categoryFilters = [
    { id: "All", label: "All" },
    ...services.map((s) => ({ id: s._id, label: s.service_name })),
  ];

  const companyStats = content?.companyStats ?? [];
  const getStat = (key) => {
    const s = companyStats.find((st) => st.key === key);
    return s ? `${s.target}${s.suffix}` : "";
  };

  useEffect(() => {
    fetchPageProjects(active);
  }, [active, fetchPageProjects]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 240;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-background min-h-screen animate-page-fade">
      {/* 1. Hero */}
      <HeroSplit
        title="Projects"
        titleHighlight="Our"
        subtitle="Explore our portfolio of successful projects. From static sites to dynamic platforms, see how we've helped businesses achieve their digital goals."
        primaryCTA={{ label: "Start a Project", to: "/contact" }}
        secondaryCTA={{ label: "Our Services", to: "/services" }}
        imageSrc="/projects.webp"
        imageAlt="Our Projects"
        trustIndicators={[
          { value: getStat("projectsCompleted") || "500+", label: "Projects\nCompleted" },
          { value: getStat("satisfiedClients") || "100+", label: "Happy\nClients" },
          { value: getStat("clientRetention") || "98%", label: "Client\nRetention" },
        ]}
      />

      {/* 2. Project Statistics */}
      <ProjectStatistics stats={companyStats} />

      {/* 3. Category Filter + Projects Grid */}
      <section className="py-14 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn>
            <SectionHeading
              eyebrow="Portfolio"
              title="Our Projects"
              subtitle="Browse through our work filtered by category."
            />
          </FadeIn>
          
          <div className="mt-8 relative max-w-4xl mx-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="w-9 h-9 flex items-center justify-center text-text bg-background border border-border rounded-lg shadow-2xs hover:text-primary hover:border-primary/50 transition shrink-0 z-10 cursor-pointer"
              aria-label="Scroll Left"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
            </button>
            <div
              ref={scrollContainerRef}
              className="flex gap-2 overflow-x-auto scroll-smooth py-1 flex-1 no-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {categoryFilters.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActive(cat.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition cursor-pointer whitespace-nowrap shrink-0 button-text ${
                    active === cat.id
                      ? "bg-primary text-white border-primary"
                      : "bg-background text-text border-border hover:border-primary/50 hover:text-primary"
                  }`}>
                  {cat.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="w-9 h-9 flex items-center justify-center text-text bg-background border border-border rounded-lg shadow-2xs hover:text-primary hover:border-primary/50 transition shrink-0 z-10 cursor-pointer"
              aria-label="Scroll Right"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
            </button>
          </div>
          {loading ? (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="mt-14 text-center">
              <div className="text-primary font-medium mb-4 body-text">{error}</div>
              <button
                type="button"
                onClick={() => fetchPageProjects(active)}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition cursor-pointer button-text">
                Retry
              </button>
            </div>
          ) : projects.length === 0 ? (
            <div className="mt-14 text-center py-10">
              <svg
                className="w-16 h-16 mx-auto text-muted opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <div className="mt-4 text-lg font-semibold text-heading subheading">
                No projects found
              </div>
              <div className="mt-2 text-sm text-text small-text">
                No projects available for this category.
              </div>
            </div>
          ) : (
            <div className="mt-10 flex flex-wrap justify-center gap-6">
              {projects.map((p, i) => (
                <FadeIn key={p._id} delay={i * 40} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)]">
                  <ProjectCard project={p} />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Featured Case Study */}
      <FeaturedCaseStudy projects={projects} />

      {/* 5. Results & Analytics */}
      <ResultsAnalytics stats={companyStats} />

      {/* 6. Client Logos */}
      <ClientLogos logos={content?.trustMarqueeLogos} />

      {/* 7. Before & After Results */}
      <BeforeAfterResults />

      {/* 8. Testimonials */}
      <FadeIn>
        <TestimonialsSection
          reviews={reviews}
          loading={loading}
          bg="bg-background-section"
        />
      </FadeIn>

      {/* 9. Final CTA */}
      <FadeIn>
        <FinalCTA
          title="Have a Project in Mind?"
          description="Let's bring your vision to life. Get in touch with us today for a free consultation and let's discuss how we can help you achieve your goals."
          primaryLabel="Start a Project"
          secondaryLabel="View Services"
          secondaryTo="/services"
        />
      </FadeIn>
    </div>
  );
};

export default Projects;