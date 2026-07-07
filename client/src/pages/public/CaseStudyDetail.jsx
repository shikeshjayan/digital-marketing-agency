import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRocket, faBullseye, faLightbulb, faChartLine,
  faCheckCircle, faCalendarAlt, faClock, faQuoteLeft,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import useCaseStudyStore from "../../store/caseStudyStore.js";
import resolveImagePath from "../../utils/resolveImagePath.js";
import FinalCTA from "../../components/public/FinalCTA.jsx";
import FadeIn from "../../components/ui/FadeIn.jsx";
import { SkeletonBlock } from "../../components/ui/Skeleton.jsx";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const { fetchCaseStudyBySlug, selectedCaseStudy, loading, error } = useCaseStudyStore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    fetchCaseStudyBySlug(slug).then(() => setLoaded(true));
  }, [slug, fetchCaseStudyBySlug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading && !selectedCaseStudy) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <SkeletonBlock className="h-8 w-64 mb-4" />
        <SkeletonBlock className="h-64 w-full mb-4" />
        <SkeletonBlock className="h-4 w-full mb-2" />
        <SkeletonBlock className="h-4 w-3/4" />
      </div>
    );
  }

  if (error || !selectedCaseStudy) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-heading text-xl font-bold">Case Study Not Found</div>
        <p className="text-muted mt-2">The case study you are looking for does not exist or has been removed.</p>
        {selectedCaseStudy?.project?.slug ? (
          <Link to={`/projects/${selectedCaseStudy.project.slug}`} className="inline-block mt-4 text-primary hover:text-primary-hover font-medium">
            &larr; Back to Project
          </Link>
        ) : (
          <Link to="/projects" className="inline-block mt-4 text-primary hover:text-primary-hover font-medium">
            &larr; Back to Projects
          </Link>
        )}
      </div>
    );
  }

  const cs = selectedCaseStudy;
  const project = cs.project || {};

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-secondary overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-white/30">/</span>
            <Link to="/projects" className="hover:text-white transition-colors">Projects</Link>
            <span className="text-white/30">/</span>
            <Link to={project?.slug ? `/projects/${project.slug}` : "/projects"} className="hover:text-white transition-colors truncate max-w-[200px]">{project?.project_name || "Project"}</Link>
            <span className="text-white/30">/</span>
            <span className="text-white truncate">{cs.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <FadeIn>
              <div>
                {cs.featured && (
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary text-white rounded-full mb-4">
                    Featured Case Study
                  </span>
                )}
                <h1 className="hero-heading text-white">{cs.title}</h1>
                <p className="mt-4 text-white/70 text-lg leading-relaxed">{cs.overview}</p>

                <div className="flex flex-wrap gap-3 mt-6">
                  {project.project_name && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white/80 text-xs rounded-full">
                      {project.project_name}
                    </span>
                  )}
                  {project.industries?.[0] && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white/80 text-xs rounded-full">
                      {typeof project.industries[0] === "object" ? project.industries[0].name : project.industries[0]}
                    </span>
                  )}
                  {cs.timeline?.duration && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white/80 text-xs rounded-full">
                      <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                      {cs.timeline.duration}
                    </span>
                  )}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="relative">
                <img
                  src={resolveImagePath(cs.hero_image)}
                  alt={cs.title}
                  className="w-full aspect-[16/9] object-cover"
                  width="800"
                  height="450"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 space-y-12">

        {/* Overview */}
        <FadeIn>
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <FontAwesomeIcon icon={faRocket} />
              </span>
              <h2 className="section-heading text-heading">Overview</h2>
            </div>
            <p className="text-text leading-relaxed body-text">{cs.overview}</p>
          </section>
        </FadeIn>

        {/* Challenge */}
        <FadeIn>
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning">
                <FontAwesomeIcon icon={faBullseye} />
              </span>
              <h2 className="section-heading text-heading">The Challenge</h2>
            </div>
            <p className="text-text leading-relaxed body-text">{cs.challenge}</p>
          </section>
        </FadeIn>

        {/* Objectives */}
        {cs.objectives?.length > 0 && (
          <FadeIn>
            <section>
              <h2 className="section-heading text-heading mb-4">Objectives</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cs.objectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-surface border border-border rounded-lg">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-primary mt-0.5 shrink-0" />
                    <span className="text-text body-text">{obj}</span>
                  </div>
                ))}
              </div>
            </section>
          </FadeIn>
        )}

        {/* Strategy */}
        {cs.strategy && (
          <FadeIn>
            <section>
              <h2 className="section-heading text-heading mb-4">Strategy</h2>
              <p className="text-text leading-relaxed body-text">{cs.strategy}</p>
            </section>
          </FadeIn>
        )}

        {/* Solution */}
        <FadeIn>
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center text-info">
                <FontAwesomeIcon icon={faLightbulb} />
              </span>
              <h2 className="section-heading text-heading">The Solution</h2>
            </div>
            <p className="text-text leading-relaxed body-text">{cs.solution}</p>
          </section>
        </FadeIn>

        {/* Deliverables */}
        {cs.deliverables?.length > 0 && (
          <FadeIn>
            <section>
              <h2 className="section-heading text-heading mb-4">Deliverables</h2>
              <div className="flex flex-wrap gap-2">
                {cs.deliverables.map((d, i) => (
                  <span key={i} className="px-4 py-2 bg-surface border border-border text-text text-sm rounded-full">
                    {d}
                  </span>
                ))}
              </div>
            </section>
          </FadeIn>
        )}

        {/* Timeline */}
        {cs.timeline && (cs.timeline.duration || cs.timeline.started_at) && (
          <FadeIn>
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </span>
                <h2 className="section-heading text-heading">Timeline</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {cs.timeline.duration && (
                  <div className="p-4 bg-surface border border-border rounded-lg text-center">
                    <div className="text-muted text-sm mb-1">Duration</div>
                    <div className="font-bold text-heading">{cs.timeline.duration}</div>
                  </div>
                )}
                {cs.timeline.started_at && (
                  <div className="p-4 bg-surface border border-border rounded-lg text-center">
                    <div className="text-muted text-sm mb-1">Started</div>
                    <div className="font-bold text-heading">{formatDate(cs.timeline.started_at)}</div>
                  </div>
                )}
                {cs.timeline.completed_at && (
                  <div className="p-4 bg-surface border border-border rounded-lg text-center">
                    <div className="text-muted text-sm mb-1">Completed</div>
                    <div className="font-bold text-heading">{formatDate(cs.timeline.completed_at)}</div>
                  </div>
                )}
              </div>
            </section>
          </FadeIn>
        )}

        {/* Development Process */}
        {cs.development_process?.length > 0 && (
          <FadeIn>
            <section>
              <h2 className="section-heading text-heading mb-6">Development Process</h2>
              <div className="space-y-4">
                {cs.development_process.map((step, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-surface border border-border rounded-lg">
                    <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {i + 1}
                    </span>
                    <div>
                      <div className="font-bold text-heading">{step.title}</div>
                      <p className="text-text text-sm mt-1 body-text">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </FadeIn>
        )}

        {/* Challenges & Solutions */}
        {cs.challenges_and_solutions?.length > 0 && (
          <FadeIn>
            <section>
              <h2 className="section-heading text-heading mb-6">Challenges & Solutions</h2>
              <div className="space-y-4">
                {cs.challenges_and_solutions.map((item, i) => (
                  <div key={i} className="border border-border rounded-lg overflow-hidden">
                    <div className="p-4 bg-warning/5 border-b border-border">
                      <div className="text-sm font-semibold text-warning mb-1">Challenge</div>
                      <p className="text-text body-text">{item.challenge}</p>
                    </div>
                    <div className="p-4 bg-info/5">
                      <div className="text-sm font-semibold text-info mb-1">Solution</div>
                      <p className="text-text body-text">{item.solution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </FadeIn>
        )}

        {/* Results */}
        {cs.results?.length > 0 && (
          <FadeIn>
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
                  <FontAwesomeIcon icon={faChartLine} />
                </span>
                <h2 className="section-heading text-heading">Results</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cs.results.map((r, i) => (
                  <div key={i} className="p-4 bg-surface border border-border rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">{r.value}</div>
                    <div className="text-muted text-sm mt-1">{r.title}</div>
                  </div>
                ))}
              </div>
            </section>
          </FadeIn>
        )}

        {/* Gallery */}
        {cs.gallery?.length > 0 && (
          <FadeIn>
            <section>
              <h2 className="section-heading text-heading mb-4">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {cs.gallery.map((img, i) => (
                  <img
                    key={i}
                    src={resolveImagePath(img)}
                    alt={`Gallery ${i + 1}`}
                    className="w-full aspect-video object-cover border border-border"
                    loading="lazy"
                  />
                ))}
              </div>
            </section>
          </FadeIn>
        )}

        {/* Client Testimonial */}
        {cs.client_testimonial?.quote && (
          <FadeIn>
            <section className="p-6 md:p-8 bg-background-section border border-border rounded-lg">
              <FontAwesomeIcon icon={faQuoteLeft} className="text-primary text-2xl mb-4" />
              <blockquote className="text-text text-lg leading-relaxed italic body-text">
                &ldquo;{cs.client_testimonial.quote}&rdquo;
              </blockquote>
              <div className="mt-4 flex items-center gap-3">
                <div>
                  <div className="font-bold text-heading">{cs.client_testimonial.client_name}</div>
                  <div className="text-muted text-sm">
                    {[cs.client_testimonial.designation, cs.client_testimonial.company].filter(Boolean).join(" at ")}
                  </div>
                </div>
              </div>
            </section>
          </FadeIn>
        )}

        {/* Project Link */}
        {project.project_url && (
          <FadeIn>
            <div className="text-center">
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors">
                View Live Project
                <FontAwesomeIcon icon={faExternalLinkAlt} className="text-sm" />
              </a>
            </div>
          </FadeIn>
        )}
      </div>

      <FinalCTA />
    </div>
  );
}
