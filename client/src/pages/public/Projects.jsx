import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faArrowRight,
  faGlobe,
  faCheckCircle,
  faChartLine,
  faBuilding,
  faClock,
  faCogs,
} from "@fortawesome/free-solid-svg-icons";
import useProjectStore from "../../store/projectStore.js";
import useSiteContentStore from "../../store/siteContentStore.js";
import useServiceStore from "../../store/serviceStore.js";
import useReviewStore from "../../store/reviewStore.js";
import HeroSplit from "../../components/public/HeroSplit.jsx";
import FadeIn from "../../components/ui/FadeIn.jsx";
import SectionHeading from "../../components/ui/SectionHeading.jsx";
import AnimatedCounter from "../../components/ui/AnimatedCounter.jsx";
import { ProjectCardSkeleton } from "../../components/ui/Skeleton.jsx";
import FinalCTA from "../../components/public/FinalCTA.jsx";
import TestimonialsSection from "../../components/public/TestimonialsSection.jsx";
import ImageLoader from "../../components/ui/ImageLoader.jsx";

/* ─── Project Card ────────────────────────────────────────── */
const ProjectCard = ({ project }) => {
  return (
    <div className="group block bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary transition-all duration-300 h-full flex flex-col">
      <div className="relative overflow-hidden aspect-[16/10] w-full bg-surface">
        <ImageLoader
          src={project.thumbnail || project.image}
          alt={project.project_name}
          type="project"
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-5">
        <h3 className="subheading text-heading group-hover:text-primary transition-colors duration-300 line-clamp-1">
          {project.project_name}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-xs flex-wrap">
          {project.services?.length > 0 && (
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary-light text-primary font-semibold">
              {typeof project.services[0] === "object" ? project.services[0].service_name : "Service"}
            </span>
          )}
          {project.industries?.length > 0 && (
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-surface text-text font-semibold border border-border">
              {typeof project.industries[0] === "object" ? project.industries[0].name : "Industry"}
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
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
          <div className="mt-2 flex items-center gap-1 text-xs text-muted">
            <FontAwesomeIcon icon={faCogs} className="text-[10px]" />
            <span className="truncate">{project.technologies.map(t => typeof t === "object" ? t.name : t).join(", ")}</span>
          </div>
        )}

        <p className="mt-3 small-text text-text body-text line-clamp-2">
          {project.short_description}
        </p>

        <div className="mt-auto pt-4 flex items-center gap-4 text-sm font-semibold">
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

/* ─── Section: Project Statistics ─────────────────────────── */
function ProjectStatistics({ stats = [] }) {
  const displayStats = stats.slice(0, 4);
  if (!displayStats.length) return null;

  return (
    <section className="py-12 md:py-16 bg-background-section">
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn>
          <div className="text-center text-text">
            <h2 className="mt-2 section-heading">
              <span className="font-headings text-4xl text-primary mr-4">
                Our
              </span>
              Track Record
            </h2>
            <p className="mt-3 text-text max-w-xl mx-auto small-text md:body-text">
              Numbers that speak for our commitment to delivering excellence.
            </p>
          </div>
        </FadeIn>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayStats.map((s, i) => (
            <FadeIn key={s.key || i} delay={i * 100}>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center hover:bg-white/10 transition">
                <div className="text-3xl md:text-4xl font-extrabold text-primary">
                  <AnimatedCounter target={s.target} suffix={s.suffix} />
                </div>
                <div className="mt-2 small-text md:body-text text-text/70">
                  {s.label}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Featured Case Study ────────────────────────── */
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

        <FadeIn delay={100}>
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
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary-light text-primary font-semibold">
                      {typeof featured.services[0] === "object" ? featured.services[0].service_name : "Service"}
                    </span>
                  )}
                  {featured.industries?.length > 0 && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-surface text-text font-semibold border border-border">
                      {typeof featured.industries[0] === "object" ? featured.industries[0].name : "Industry"}
                    </span>
                  )}
                </div>

                <h3 className="mt-3 subheading text-heading">
                  {featured.project_name}
                </h3>

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
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
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-muted">
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
                      className="mt-1.5 self-start text-xs font-semibold text-primary hover:text-primary-hover transition">
                      Read more →
                    </Link>
                  )}

                <div className="mt-auto pt-5">
                  <a
                    href={featured.project_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-primary-hover transition cursor-pointer">
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

/* ─── Section: Results & Analytics ────────────────────────── */
function ResultsAnalytics({ stats = [] }) {
  const getStatValue = (key) => {
    const s = stats.find((st) => st.key === key);
    return s ? `${s.target}${s.suffix}` : "";
  };

  const metrics = [
    {
      icon: faChartLine,
      value: getStatValue("averageRoi") || "3x",
      label: "Average ROI",
      desc: "Return on investment for our clients",
    },
    {
      icon: faBullseye,
      value: getStatValue("onTimeDelivery") || "95%",
      label: "On-Time Delivery",
      desc: "Projects delivered within deadline",
    },
    {
      icon: faGlobe,
      value: getStatValue("countriesServed") || "10+",
      label: "Countries Served",
      desc: "Global client reach",
    },
    {
      icon: faCheckCircle,
      value: getStatValue("uptimeGuaranteed") || "99%",
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

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <FadeIn key={m.label} delay={i * 100}>
              <div className="bg-surface border border-border rounded-lg p-6 text-center h-full hover:shadow-sm transition group">
                <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center mx-auto group-hover:bg-primary group-hover:text-white transition">
                  <FontAwesomeIcon
                    icon={m.icon}
                    className="text-xl text-primary group-hover:text-white transition"
                  />
                </div>
                <div className="mt-4 text-3xl font-extrabold text-heading">
                  {m.value}
                </div>
                <div className="mt-1 text-sm font-semibold text-heading">
                  {m.label}
                </div>
                <div className="mt-1 text-xs text-muted">{m.desc}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Client Logos (Trusted By) ──────────────────── */
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

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {logos.map((logo, i) => (
            <FadeIn key={i} delay={i * 60}>
              <div className="flex items-center justify-center bg-background border border-border rounded-lg px-4 py-5 hover:shadow-sm hover:border-primary/30 transition-all duration-200 cursor-default">
                <span className="text-sm font-semibold text-muted text-center">
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

/* ─── Section: Before / After Results ────────────────────── */
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
            <FadeIn key={item.metric} delay={i * 100}>
              <div className="bg-surface border border-border rounded-lg p-5 text-center hover:shadow-sm transition h-full flex flex-col">
                <div className="text-sm font-bold text-heading">
                  {item.metric}
                </div>
                <div className="mt-4 flex items-center justify-center gap-4 flex-1">
                  <div>
                    <div className="text-xs text-muted uppercase tracking-wider">
                      Before
                    </div>
                    <div className="mt-1 text-lg font-bold text-muted">
                      {item.before}
                    </div>
                  </div>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="text-primary text-sm"
                  />
                  <div>
                    <div className="text-xs text-primary uppercase tracking-wider font-semibold">
                      After
                    </div>
                    <div className="mt-1 text-lg font-bold text-primary">
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

/* ─── Main Projects Page ──────────────────────────────────── */
const Projects = () => {
  const [active, setActive] = useState("All");
  const { projects, loading, error, fetchProjects } = useProjectStore();
  const { reviews, loading: reviewsLoading, fetchReviews } = useReviewStore();
  const { content, fetchPublicSiteContent } = useSiteContentStore();
  const { services, fetchServices } = useServiceStore();

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
    fetchProjects(active);
  }, [active, fetchProjects]);

  useEffect(() => {
    fetchReviews();
    fetchPublicSiteContent();
    fetchServices();
  }, [fetchReviews, fetchPublicSiteContent, fetchServices]);

  return (
    <div className="bg-background min-h-screen">
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

          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            {categoryFilters.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActive(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition cursor-pointer ${
                  active === cat.id
                    ? "bg-primary text-white border-primary"
                    : "bg-background text-text border-border hover:border-primary/50 hover:text-primary"
                }`}>
                {cat.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="mt-14 text-center">
              <div className="text-primary font-medium mb-4">{error}</div>
              <button
                type="button"
                onClick={() => fetchProjects(active)}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition cursor-pointer">
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
              <div className="mt-4 text-lg font-semibold text-heading">
                No projects found
              </div>
              <div className="mt-2 text-sm text-text">
                No projects available for this category.
              </div>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p, i) => (
                <FadeIn key={p._id} delay={i * 100} className="h-full">
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
      <TestimonialsSection
        reviews={reviews}
        loading={reviewsLoading}
        bg="bg-background-section"
      />

      {/* 9. Final CTA */}
      <FinalCTA
        title="Have a Project in Mind?"
        description="Let's bring your vision to life. Get in touch with us today for a free consultation and let's discuss how we can help you achieve your goals."
        primaryLabel="Start a Project"
        secondaryLabel="View Services"
        secondaryTo="/services"
      />
    </div>
  );
};

export default Projects;
