import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faArrowRight,
  faGlobe,
  faShoppingCart,
  faHospital,
  faBuilding,
  faGraduationCap,
  faUtensils,
  faCar,
  faDumbbell,
  faHome,
  faPlane,
  faCheckCircle,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import useProjectStore from "../../store/projectStore.js";
import useReviewStore from "../../store/reviewStore.js";
import HeroSplit from "../../components/public/HeroSplit.jsx";
import FadeIn from "../../components/ui/FadeIn.jsx";
import SectionHeading from "../../components/ui/SectionHeading.jsx";
import AnimatedCounter from "../../components/ui/AnimatedCounter.jsx";
import { ProjectCardSkeleton } from "../../components/ui/Skeleton.jsx";
import OurProcess from "../../components/public/OurProcess.jsx";
import FinalCTA from "../../components/public/FinalCTA.jsx";
import TestimonialsSection from "../../components/public/TestimonialsSection.jsx";
import DetailModal from "../../components/ui/DetailModal.jsx";
import resolveImagePath from "../../utils/resolveImagePath.js";

const categories = ["All", "Static", "Dynamic", "Landing Pages"];

/* ─── Project Card ────────────────────────────────────────── */
const ProjectCard = ({ project, onDetail }) => {
  return (
    <div className="group block bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary transition-all duration-300">
      <div className="relative overflow-hidden aspect-[16/10] w-full bg-surface">
        <img
          src={resolveImagePath(project.image)}
          alt={project.project_name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect fill='%23F8FAFC' width='400' height='250'/%3E%3Ctext x='200' y='130' text-anchor='middle' fill='%236B7280' font-size='16' font-family='sans-serif'%3ENo Image%3C/text%3E%3C/svg%3E";
          }}
        />
      </div>

      <div className="p-5">
        <h3 className="subheading text-heading group-hover:text-primary transition-colors duration-300 line-clamp-1">
          {project.project_name}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary-light text-primary font-semibold">
            {project.category}
          </span>
          <span className="text-muted">|</span>
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full font-semibold ${
              project.status === "Active"
                ? "bg-green-50 text-green-600"
                : "bg-gray-100 text-gray-500"
            }`}>
            {project.status}
          </span>
        </div>

        <p className="mt-3 small-text text-text body-text line-clamp-2">
          {project.short_description}
        </p>

        <div className="mt-4 flex items-center gap-4 text-sm font-semibold">
          <button
            type="button"
            onClick={() => onDetail(project)}
            className="text-primary hover:text-primary-hover transition cursor-pointer">
            Read more
          </button>
          <a
            href={project.live_url}
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
function ProjectStatistics() {
  const stats = [
    { target: 150, suffix: "+", label: "Projects Completed" },
    { target: 50, suffix: "+", label: "Happy Clients" },
    { target: 98, suffix: "%", label: "Client Retention" },
    { target: 24, suffix: "/7", label: "Support Available" },
  ];

  return (
    <section className="py-12 md:py-16 bg-secondary">
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn>
          <div className="text-center text-white">
            <h2 className="mt-2 section-heading">
              <span className="font-headings text-4xl text-primary mr-4">Our</span>
              Track Record
            </h2>
            <p className="mt-3 text-gray-300 max-w-xl mx-auto text-sm md:text-base">
              Numbers that speak for our commitment to delivering excellence.
            </p>
          </div>
        </FadeIn>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <FadeIn key={s.label} delay={i * 100}>
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center hover:bg-white/10 transition">
                <div className="text-3xl md:text-4xl font-extrabold text-primary">
                  <AnimatedCounter target={s.target} suffix={s.suffix} />
                </div>
                <div className="mt-2 text-xs md:text-sm text-gray-300">
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
function FeaturedCaseStudy({ projects, onDetail }) {
  const featured = projects.find((p) => p.status === "Active") || projects[0];

  if (!featured) return null;

  return (
    <section className="py-10 md:py-12 bg-surface">
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
              <div className="relative overflow-hidden aspect-[16/10] lg:aspect-auto lg:min-h-[260px] bg-surface">
                <img
                  src={resolveImagePath(featured.image)}
                  alt={featured.project_name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect fill='%23F8FAFC' width='400' height='250'/%3E%3Ctext x='200' y='130' text-anchor='middle' fill='%236B7280' font-size='16' font-family='sans-serif'%3ENo Image%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>

              <div className="p-5 lg:p-6 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary-light text-primary font-semibold">
                    {featured.category}
                  </span>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full font-semibold ${
                      featured.status === "Active"
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                    {featured.status}
                  </span>
                </div>

                <h3 className="mt-3 subheading text-heading">
                  {featured.project_name}
                </h3>

                <p className="mt-2 text-text small-text line-clamp-3">
                  {featured.short_description}
                </p>
                {featured.short_description &&
                  featured.short_description.length > 120 && (
                    <button
                      type="button"
                      onClick={() => onDetail(featured)}
                      className="mt-1 text-xs font-semibold text-primary hover:text-primary-hover transition cursor-pointer">
                      Read more
                    </button>
                  )}

                <div className="mt-4">
                  <a
                    href={featured.live_url}
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
function ResultsAnalytics() {
  const metrics = [
    {
      icon: faChartLine,
      value: "3x",
      label: "Average ROI",
      desc: "Return on investment for our clients",
    },
    {
      icon: faBullseye,
      value: "95%",
      label: "On-Time Delivery",
      desc: "Projects delivered within deadline",
    },
    {
      icon: faGlobe,
      value: "10+",
      label: "Countries Served",
      desc: "Global client reach",
    },
    {
      icon: faCheckCircle,
      value: "99%",
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

/* ─── Section: Industries Served ──────────────────────────── */
const industries = [
  { icon: faBuilding, name: "Corporate" },
  { icon: faShoppingCart, name: "E-Commerce" },
  { icon: faHospital, name: "Healthcare" },
  { icon: faGraduationCap, name: "Education" },
  { icon: faUtensils, name: "Food & Beverage" },
  { icon: faCar, name: "Automotive" },
  { icon: faDumbbell, name: "Fitness & Wellness" },
  { icon: faHome, name: "Real Estate" },
  { icon: faPlane, name: "Travel & Tourism" },
  { icon: faGlobe, name: "Technology" },
];

function IndustriesServed() {
  return (
    <section className="py-12 md:py-16 bg-surface">
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn>
          <SectionHeading
            eyebrow="Who We Help"
            title="Industries Served"
            subtitle="Tailored digital solutions for diverse business sectors."
          />
        </FadeIn>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {industries.map((ind, i) => (
            <FadeIn key={ind.name} delay={i * 60}>
              <div className="bg-background border border-border rounded-lg p-5 text-center hover:border-primary hover:shadow-sm transition group cursor-default">
                <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center mx-auto group-hover:bg-primary group-hover:text-white transition">
                  <FontAwesomeIcon
                    icon={ind.icon}
                    className="text-xl text-primary group-hover:text-white transition"
                  />
                </div>
                <div className="mt-3 text-sm font-semibold text-heading">
                  {ind.name}
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
  const [detail, setDetail] = useState(null);
  const handleDetail = (project) => setDetail(project);
  const { projects, loading, error, fetchProjects } = useProjectStore();
  const { reviews, loading: reviewsLoading, fetchReviews } = useReviewStore();

  useEffect(() => {
    fetchProjects(active);
  }, [active, fetchProjects]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

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
          { value: "150+", label: "Projects\nCompleted" },
          { value: "50+", label: "Happy\nClients" },
          { value: "98%", label: "Client\nRetention" },
        ]}
      />

      {/* 2. Project Statistics */}
      <ProjectStatistics />

      {/* 3. Category Filter + Projects Grid */}
      <section className="py-14 bg-surface">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn>
            <SectionHeading
              eyebrow="Portfolio"
              title="Our Projects"
              subtitle="Browse through our work filtered by category."
            />
          </FadeIn>

          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition cursor-pointer ${
                  active === c
                    ? "bg-primary text-white border-primary"
                    : "bg-background text-text border-border hover:border-primary/50 hover:text-primary"
                }`}>
                {c}
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
                <FadeIn key={p.project_id || p._id} delay={i * 100}>
                  <ProjectCard project={p} onDetail={handleDetail} />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Featured Case Study */}
      <FeaturedCaseStudy projects={projects} onDetail={handleDetail} />

      {/* 5. Results & Analytics */}
      <ResultsAnalytics />

      {/* 6. Industries Served */}
      <IndustriesServed />

      {/* 7. Testimonials */}
      <TestimonialsSection reviews={reviews} loading={reviewsLoading} />

      {/* 8. Our Process */}
      <OurProcess />

      {/* 9. Final CTA */}
      <FinalCTA
        title="Have a Project in Mind?"
        description="Let's bring your vision to life. Get in touch with us today for a free consultation and let's discuss how we can help you achieve your goals."
        primaryLabel="Start a Project"
        secondaryLabel="View Services"
        secondaryTo="/services"
      />

      <DetailModal
        open={!!detail}
        onClose={() => setDetail(null)}
        image={detail ? resolveImagePath(detail.image) : ""}
        title={detail?.project_name || ""}
        tags={
          detail
            ? [
                { label: detail.category, variant: "primary" },
                {
                  label: detail.status,
                  variant: detail.status === "Active" ? "success" : "default",
                },
              ]
            : []
        }
        description={detail?.description || detail?.short_description || ""}
        cta={
          detail?.live_url
            ? { label: "View Project", href: detail.live_url }
            : null
        }
      />
    </div>
  );
};

export default Projects;
