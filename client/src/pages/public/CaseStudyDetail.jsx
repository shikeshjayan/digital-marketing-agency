import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye, faLightbulb, faChartLine,
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

// Utility function to check if a string is a raw MongoDB ObjectID hex string
function isObjectId(str) {
  return /^[0-9a-fA-F]{24}$/.test(String(str).trim());
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
        <div className="text-heading text-xl font-bold subheading">Case Study Found</div>
        <p className="text-muted mt-2 body-text">The case study you are looking for does not exist or has been removed.</p>
        {selectedCaseStudy?.project?.slug ? (
          <Link to={`/projects/${selectedCaseStudy.project.slug}`} className="inline-block mt-4 text-primary hover:text-primary-hover font-medium button-text">
            &larr; Back to Project
          </Link>
        ) : (
          <Link to="/projects" className="inline-block mt-4 text-primary hover:text-primary-hover font-medium button-text">
            &larr; Back to Projects
          </Link>
        )}
      </div>
    );
  }

  const cs = selectedCaseStudy;
  const project = cs.project || {};

  // Clean the title: If it's a raw ObjectID or contains one, fall back to project name or standard header safely
  const displayTitle = cs.title && !isObjectId(cs.title) 
    ? cs.title 
    : (project?.project_name || "Case Study Success Story");

  return (
    <div className="bg-background min-h-screen animate-page-fade">
      {/* Hero Section */}
      <section className="relative bg-secondary overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6 justify-center lg:justify-start text-xs">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-white/30">/</span>
            <Link to="/projects" className="hover:text-white transition-colors">Projects</Link>
            <span className="text-white/30">/</span>
            <Link to={project?.slug ? `/projects/${project.slug}` : "/projects"} className="hover:text-white transition-colors truncate max-w-[200px]">{project?.project_name || "Project"}</Link>
            <span className="text-white/30">/</span>
            <span className="text-white truncate">
              {displayTitle}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <FadeIn>
              <div className="text-center lg:text-left">
                {cs.featured && (
                  <div className="w-full flex justify-center lg:justify-start mb-3">
                    <div className="text-sm font-bold tracking-widest uppercase inline-block px-3 py-1 rounded bg-white/10 text-white text-xxs">
                      FEATURED CASE STUDY
                    </div>
                  </div>
                )}
                <h1 className="hero-heading text-white">
                  {displayTitle}
                </h1>
                <p className="mt-4 text-white/70 text-lg leading-relaxed body-text">{cs.overview}</p>

                <div className="flex flex-wrap gap-3 mt-6 justify-center lg:justify-start">
                  {project.project_name && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white/80 text-xs rounded-sb text-xxs">
                      {project.project_name}
                    </span>
                  )}
                  {project.industries?.map((ind, i) => {
                    const targetName = typeof ind === "object" ? ind.name : ind;
                    // FIX: Automatically catch and drop any raw database ID values from rendering as badges
                    if (!targetName || isObjectId(targetName)) return null;
                    return (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white/80 text-xs rounded-sb text-xxs">
                        {targetName}
                      </span>
                    );
                  })}
                  {cs.timeline?.duration && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white/80 text-xs rounded-sb text-xxs">
                      <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                      {cs.timeline.duration}
                    </span>
                  )}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={40}>
              <div className="relative">
                <img
                  src={resolveImagePath(cs.hero_image)}
                  alt={displayTitle}
                  className="w-full aspect-[16/9] object-cover rounded-sm"
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

      {/* Layer 1: Overview */}
      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeIn>
            <div>
              <div className="flex flex-col items-center justify-center gap-2 mb-4">
                <h2 className="section-heading text-heading">Overview</h2>
              </div>
              <p className="text-text leading-relaxed body-text max-w-3xl mx-auto">{cs.overview}</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Layer 2: Challenge */}
      <section className="py-12 md:py-16 bg-background-section border-y border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeIn>
            <div>
              <div className="flex flex-col items-center justify-center gap-2 mb-4">
                <span className="w-10 h-10 rounded-sm bg-warning/10 flex items-center justify-center text-warning">
                  <FontAwesomeIcon icon={faBullseye} />
                </span>
                <h2 className="section-heading text-heading">The Challenge</h2>
              </div>
              <p className="text-text leading-relaxed body-text max-w-3xl mx-auto">{cs.challenge}</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Layer 3: Objectives */}
      {cs.objectives?.length > 0 && (
        <section className="py-12 md:py-16 bg-background">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <FadeIn>
              <div>
                <h2 className="section-heading text-heading mb-6">Objectives</h2>
                <div className="flex flex-wrap justify-center gap-3">
                  {cs.objectives.map((obj, i) => (
                    <FadeIn key={i} delay={i * 20} className="w-full sm:basis-[calc(50%-6px)] max-w-md">
                      <div className="flex flex-col items-center justify-center gap-3 p-5 bg-[#FAFAFA] border border-border rounded-sm text-center shadow-xs h-full">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-primary text-lg" />
                        <span className="text-text body-text font-medium">{obj}</span>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Layer 4: Strategy */}
      {cs.strategy && (
        <section className="py-12 md:py-16 bg-background-section border-y border-border">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <FadeIn>
              <div>
                <h2 className="section-heading text-heading mb-4">Strategy</h2>
                <p className="text-text leading-relaxed body-text max-w-3xl mx-auto">{cs.strategy}</p>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Layer 5: Solution */}
      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeIn>
            <div>
              <div className="flex flex-col items-center justify-center gap-2 mb-4">
                <span className="w-10 h-10 rounded-sm bg-info/10 flex items-center justify-center text-info">
                  <FontAwesomeIcon icon={faLightbulb} />
                </span>
                <h2 className="section-heading text-heading">The Solution</h2>
              </div>
              <p className="text-text leading-relaxed body-text max-w-3xl mx-auto">{cs.solution}</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Layer 6: Deliverables */}
      {cs.deliverables?.length > 0 && (
        <section className="py-14 md:py-16 bg-background-section border-y border-border">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <FadeIn>
              <div>
                <h2 className="section-heading text-heading font-headings text-center mb-8">Deliverables</h2>
                <div className="flex flex-wrap gap-4 justify-center items-center max-w-5xl mx-auto">
                  {cs.deliverables.map((d, i) => (
                    <FadeIn key={i} delay={i * 20}>
                      <span className="inline-block bg-background border border-border/80 text-heading text-sm font-body px-5 py-3 rounded-none  text-center card-shadow">
                        {d}
                      </span>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Layer 7: Timeline */}
      {cs.timeline && (cs.timeline.duration || cs.timeline.started_at) && (
        <section className="py-12 md:py-16 bg-background">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <FadeIn>
              <div>
                <div className="flex flex-col items-center justify-center gap-2 mb-6">
                  <span className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center text-primary">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </span>
                  <h2 className="section-heading text-heading">Timeline</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {cs.timeline.duration && (
                    <FadeIn delay={20}>
                      <div className="p-4 bg-[#FAFAFA] border border-border rounded-sm text-center">
                        <div className="text-muted text-sm mb-1 text-xxs">Duration</div>
                        <div className="font-bold text-heading subheading text-base">{cs.timeline.duration}</div>
                      </div>
                    </FadeIn>
                  )}
                  {cs.timeline.started_at && (
                    <FadeIn delay={40}>
                      <div className="p-4 bg-[#FAFAFA] border border-border rounded-sm text-center">
                        <div className="text-muted text-sm mb-1 text-xxs">Started</div>
                        <div className="font-bold text-heading subheading text-base">{formatDate(cs.timeline.started_at)}</div>
                      </div>
                    </FadeIn>
                  )}
                  {cs.timeline.completed_at && (
                    <FadeIn delay={60}>
                      <div className="p-4 bg-[#FAFAFA] border border-border rounded-sm text-center">
                        <div className="text-muted text-sm mb-1 text-xxs">Completed</div>
                        <div className="font-bold text-heading subheading text-base">{formatDate(cs.timeline.completed_at)}</div>
                      </div>
                    </FadeIn>
                  )}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Layer 8: Development Process */}
      {cs.development_process?.length > 0 && (
        <section className="py-12 md:py-16 bg-background-section border-y border-border">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <FadeIn>
              <div>
                <h2 className="section-heading text-heading mb-6">Development Process</h2>
                <div className="space-y-4 max-w-2xl mx-auto">
                  {cs.development_process.map((step, i) => (
                    <FadeIn key={i} delay={i * 30}>
                      <div className="flex flex-col items-center p-5 bg-[#FAFAFA] border border-border rounded-sm text-center">
                        <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold mb-3 shadow-xs font-bold">
                          {i + 1}
                        </span>
                        <div>
                          <div className="font-bold text-heading text-base subheading">{step.title}</div>
                          <p className="text-text text-sm mt-2 body-text">{step.description}</p>
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Layer 9: Challenges & Solutions */}
      {cs.challenges_and_solutions?.length > 0 && (
        <section className="py-12 md:py-16 bg-background">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <FadeIn>
              <div>
                <h2 className="section-heading text-heading mb-6">Challenges & Solutions</h2>
                <div className="space-y-4 max-w-2xl mx-auto">
                  {cs.challenges_and_solutions.map((item, i) => (
                    <FadeIn key={i} delay={i * 30}>
                      <div className="border border-border rounded-sm overflow-hidden shadow-xs">
                        <div className="p-4 bg-warning/5 border-b border-border text-center">
                          <div className="text-xs font-bold uppercase tracking-wider text-warning mb-1 text-xxs">Challenge</div>
                          <p className="text-text body-text">{item.challenge}</p>
                        </div>
                        <div className="p-4 bg-info/5 text-center">
                          <div className="text-xs font-bold uppercase tracking-wider text-info mb-1 text-xxs">Solution</div>
                          <p className="text-text body-text">{item.solution}</p>
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Layer 10: Results Numbers */}
      {cs.results?.length > 0 && (
        <section className="py-14 md:py-16 bg-[#FEF3E2]">
          <div className="max-w-6xl mx-auto px-4">
            <FadeIn>
              <div className="flex flex-col items-center justify-center gap-2 mb-4">
                <span className="w-10 h-10 rounded-sm bg-success/10 flex items-center justify-center text-success">
                  <FontAwesomeIcon icon={faChartLine} />
                </span>
                <h2 className="section-heading text-heading">Results</h2>
              </div>
            </FadeIn>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {cs.results.map((r, i) => (
                <FadeIn key={i} delay={i * 30} className="w-[calc(50%-8px)] md:w-[calc(25%-12px)] min-w-[140px]">
                  <div className="h-full flex flex-col justify-between bg-[#FAFAFA] border border-border rounded-lg p-5 text-center hover:shadow-sm transition">
                    <div>
                      <div className="text-2xl font-bold text-primary">{r.value}</div>
                    </div>
                    <div className="mt-3 text-sm text-muted font-medium leading-snug small-text font-semibold">
                      {r.title}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Layer 11: Gallery */}
      {cs.gallery?.length > 0 && (
        <section className="py-12 md:py-16 bg-background">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <FadeIn>
              <div>
                <h2 className="section-heading text-heading mb-6">Gallery</h2>
                <div className="flex flex-wrap justify-center gap-3">
                  {cs.gallery.map((img, i) => (
                    <FadeIn key={i} delay={i * 30} className="w-full sm:basis-[calc(50%-6px)] md:basis-[calc(33.33%-8px)] max-w-sm">
                      <img
                        src={resolveImagePath(img)}
                        alt={`Gallery ${i + 1}`}
                        className="w-full aspect-video object-cover border border-border rounded-sm"
                        loading="lazy"
                      />
                    </FadeIn>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Layer 12: Testimonial & Footer Links */}
      <section className="py-12 md:py-16 bg-background-section border-t border-border text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-12">
          {cs.client_testimonial?.quote && (
            <FadeIn>
              <div className="p-6 md:p-8 bg-[#FAFAFA] border border-border rounded-sm max-w-2xl mx-auto shadow-xs">
                <FontAwesomeIcon icon={faQuoteLeft} className="text-primary text-2xl mb-4 mx-auto" />
                <blockquote className="text-text text-lg leading-relaxed italic body-text">
                  &ldquo;{cs.client_testimonial.quote}&rdquo;
                </blockquote>
                <div className="mt-4 flex flex-col items-center gap-1">
                  <div className="font-bold text-heading subheading text-base">{cs.client_testimonial.client_name}</div>
                  <div className="text-muted text-sm small-text">
                    {[cs.client_testimonial.designation, cs.client_testimonial.company].filter(Boolean).join(" at ")}
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

          {project.project_url && (
            <FadeIn>
              <div className="text-center">
                <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-sm hover:bg-primary-hover transition-colors button-text">
                  View Live Project
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="text-sm" />
                </a>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      <FadeIn>
        <FinalCTA />
      </FadeIn>
    </div>
  );
}