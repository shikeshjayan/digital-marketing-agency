import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faSearch,
  faLightbulb,
  faPalette,
  faCode,
  faRocket,
  faChartLine,
  faCheckCircle,
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
} from "@fortawesome/free-solid-svg-icons";
import useProjectStore from "../../store/projectStore.js";
import useReviewStore from "../../store/reviewStore.js";
import HeroSplit from "../../components/public/HeroSplit.jsx";
import FadeIn from "../../components/ui/FadeIn.jsx";
import SectionHeading from "../../components/ui/SectionHeading.jsx";
import AnimatedCounter from "../../components/ui/AnimatedCounter.jsx";
import { ProjectCardSkeleton } from "../../components/ui/Skeleton.jsx";
import imageUrl from "../../utils/imageUrl.js";

const categories = ["All", "Static", "Dynamic", "Landing Pages"];

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

/* ─── Project Card ────────────────────────────────────────── */
const ProjectCard = ({ project }) => {
  return (
    <a
      href={project.live_url}
      target="_blank"
      rel="noreferrer"
      className="group block bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer">
      {/* Large Project Image */}
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

      {/* Card Content */}
      <div className="p-5">
        {/* Project Name */}
        <h3 className="text-lg font-extrabold text-heading group-hover:text-primary transition-colors duration-300 line-clamp-1">
          {project.project_name}
        </h3>

        {/* Category | Status Badges */}
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

        {/* Short Description */}
        <p className="mt-3 text-sm text-text leading-relaxed line-clamp-2">
          {project.short_description}
        </p>

        {/* View Project Link */}
        <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all duration-300">
          <span>View Project</span>
          <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
        </div>
      </div>
    </a>
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
    <section className="py-12 md:py-16 bg-dark">
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn>
          <div className="text-center text-white">
            <div className="font-cursive text-4xl text-primary">Our</div>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold">
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
function FeaturedCaseStudy({ projects }) {
  const navigate = useNavigate();
  const featured = projects.find((p) => p.status === "Active") || projects[0];

  if (!featured) return null;

  return (
    <section className="py-12 md:py-16 bg-surface">
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn>
          <SectionHeading
            eyebrow="Featured Work"
            title="Case Study"
            subtitle="A closer look at one of our most impactful projects."
          />
        </FadeIn>

        <FadeIn delay={100}>
          <div className="mt-10 bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image */}
              <div className="relative overflow-hidden aspect-[16/10] lg:aspect-auto lg:min-h-[360px] bg-surface">
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

              {/* Content */}
              <div className="p-8 lg:p-10 flex flex-col justify-center">
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

                <h3 className="mt-4 text-2xl md:text-3xl font-extrabold text-heading">
                  {featured.project_name}
                </h3>

                <p className="mt-4 text-text leading-relaxed text-sm md:text-base">
                  {featured.short_description}
                </p>

                <p className="mt-3 text-sm text-muted leading-relaxed">
                  {featured.description}
                </p>

                <div className="mt-6">
                  <a
                    href={featured.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary text-white px-6 py-3 text-sm font-semibold hover:bg-primary-hover transition cursor-pointer">
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
    { icon: faChartLine, value: "3x", label: "Average ROI", desc: "Return on investment for our clients" },
    { icon: faBullseye, value: "95%", label: "On-Time Delivery", desc: "Projects delivered within deadline" },
    { icon: faGlobe, value: "10+", label: "Countries Served", desc: "Global client reach" },
    { icon: faCheckCircle, value: "99%", label: "Uptime Guaranteed", desc: "Reliable hosted solutions" },
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

/* ─── Section: Testimonials ───────────────────────────────── */
function StarRow({ rating }) {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-1 text-amber-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < full ? "text-amber-500" : "text-gray-300"}
          aria-hidden="true">
          ★
        </span>
      ))}
    </div>
  );
}

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
            <div className="mx-auto w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary ring-offset-2 flex items-center justify-center shadow-md bg-primary-light">
              <span className="text-lg font-bold text-primary">
                {current.name
                  ?.split(" ")
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "?"}
              </span>
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

/* ─── Section: Our Process (Timeline) ─────────────────────── */
const processSteps = [
  {
    icon: faSearch,
    title: "Discovery & Research",
    desc: "We analyze your business, audience, and competitors to build a strategic foundation.",
  },
  {
    icon: faLightbulb,
    title: "Strategy & Planning",
    desc: "We craft a tailored roadmap with clear timelines, milestones, and deliverables.",
  },
  {
    icon: faPalette,
    title: "Design & Prototyping",
    desc: "Our designers create wireframes and visual mockups aligned with your brand identity.",
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

function OurProcess() {
  return (
    <section className="py-12 md:py-16 bg-surface">
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn>
          <SectionHeading
            eyebrow="How We Work"
            title="Our Process"
            subtitle="A proven methodology that delivers results every time."
          />
        </FadeIn>

        <div className="mt-10 relative">
          {/* Vertical line */}
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
                    {/* Timeline dot */}
                    <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-lg">
                        {i + 1}
                      </div>
                    </div>

                    {/* Content card */}
                    <div
                      className={`${isLeft ? "md:text-right md:pr-12" : "md:col-start-2 md:pl-12"}`}>
                      <div className="bg-background border border-border rounded-lg p-6 hover:shadow-sm transition">
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

/* ─── Section: Final CTA ──────────────────────────────────── */
function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="bg-dark py-16">
      <FadeIn>
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Have a Project in Mind?
          </h2>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Let's bring your vision to life. Get in touch with us today for a
            free consultation and let's discuss how we can help you achieve your
            goals.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              className="inline-flex items-center rounded-lg bg-primary text-white px-6 py-3 text-sm font-semibold hover:bg-primary-hover transition cursor-pointer"
              onClick={() => navigate("/contact")}>
              Start a Project
            </button>
            <Link
              to="/services"
              className="inline-flex items-center rounded-lg border border-white text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition">
              View Services
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

/* ─── Main Projects Page ──────────────────────────────────── */
const Projects = () => {
  const [active, setActive] = useState("All");
  const { projects, loading, error, fetchProjects } = useProjectStore();
  const {
    reviews,
    loading: reviewsLoading,
    fetchReviews,
  } = useReviewStore();

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
        subtitle="A selection of recent work across categories."
        leftColor="bg-dark"
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

          {/* Category Filter Toggle Layout */}
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
      <ResultsAnalytics />

      {/* 6. Industries Served */}
      <IndustriesServed />

      {/* 7. Testimonials */}
      <TestimonialsSection reviews={reviews} loading={reviewsLoading} />

      {/* 8. Our Process */}
      <OurProcess />

      {/* 9. Final CTA */}
      <FinalCTA />
    </div>
  );
};

export default Projects;
