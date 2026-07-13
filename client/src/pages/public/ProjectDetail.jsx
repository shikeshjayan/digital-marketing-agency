import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBuilding,
  faMapMarkerAlt,
  faCalendar,
  faExternalLinkAlt,
  faIndustry,
} from "@fortawesome/free-solid-svg-icons";
import useProjectStore from "../../store/projectStore.js";
import resolveImagePath from "../../utils/resolveImagePath.js";
import FinalCTA from "../../components/public/FinalCTA.jsx";
import FadeIn from "../../components/ui/FadeIn.jsx";
import SectionHeading from "../../components/ui/SectionHeading.jsx";
import TeamCard from "../../components/public/TeamCard.jsx";
import { SkeletonBlock } from "../../components/ui/Skeleton.jsx";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const { fetchProjectBySlug, selectedProject, loading, error, fetchRelatedProjects, relatedProjects } = useProjectStore();

  useEffect(() => {
    fetchProjectBySlug(slug);
  }, [slug, fetchProjectBySlug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (selectedProject?.services?.length > 0) {
      const firstServiceId = typeof selectedProject.services[0] === "object"
        ? selectedProject.services[0]._id
        : selectedProject.services[0];
      fetchRelatedProjects(firstServiceId, 3);
    }
  }, [selectedProject, fetchRelatedProjects]);

  if (loading && !selectedProject) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <SkeletonBlock className="h-8 w-64 mb-4" />
        <SkeletonBlock className="h-64 w-full mb-4" />
        <SkeletonBlock className="h-4 w-full mb-2" />
        <SkeletonBlock className="h-4 w-3/4" />
      </div>
    );
  }

  if (error || !selectedProject) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-heading text-xl font-bold subheading">Project Not Found</div>
        <p className="text-muted mt-2 body-text">The project you are looking for does not exist or has been removed.</p>
        <Link to="/projects" className="inline-block mt-4 text-primary hover:text-primary-hover font-medium button-text">
          &larr; Back to Projects
        </Link>
      </div>
    );
  }

  const project = selectedProject;
  const client = project.client || {};
  const caseStudy = project.caseStudy;

  return (
    <div className="bg-background min-h-screen animate-page-fade">
      {/* Hero */}
      <section className="relative bg-secondary overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-lg rotate-12" />
          <div className="absolute bottom-10 right-16 w-20 h-20 bg-white/10 rounded-lg rotate-12" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6 text-xs">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-white/30">/</span>
            <Link to="/projects" className="hover:text-white transition-colors">Projects</Link>
            <span className="text-white/30">/</span>
            <span className="text-white truncate">{project.project_name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <FadeIn>
              <div>
                {project.featured && (
                  <div className="w-full flex justify-start mb-3">
                    <div className="text-sm font-bold tracking-widest uppercase inline-block px-3 py-1 rounded bg-white/10 text-white text-xxs">
                      FEATURED PROJECT
                    </div>
                  </div>
                )}

                <h1 className="hero-heading text-white">{project.project_name}</h1>
                <p className="mt-4 text-white/70 text-lg leading-relaxed body-text">{project.short_description}</p>

                <div className="flex flex-wrap gap-3 mt-6">
                  {project.services?.slice(0, 2).map((s, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white/80 text-xs rounded-sm text-xxs">
                      {typeof s === "object" ? s.service_name : "Service"}
                    </span>
                  ))}
                  {project.industries?.[0] && (
                    <span key="ind-hero" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white/80 text-xs rounded-sm text-xxs">
                      {typeof project.industries[0] === "object" ? project.industries[0].name : project.industries[0]}
                    </span>
                  )}
                  {project.completion_date && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white/80 text-xs rounded-sm text-xxs">
                      <FontAwesomeIcon icon={faCalendar} className="text-[10px]" />
                      {formatDate(project.completion_date)}
                    </span>
                  )}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={40}>
              <div className="relative">
                {project.thumbnail ? (
                  <img
                    src={resolveImagePath(project.thumbnail)}
                    alt={project.project_name}
                    className="w-full aspect-[16/9] object-cover rounded-sm"
                    width="800"
                    height="450"
                    loading="eager"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full aspect-[16/9] bg-surface flex items-center justify-center text-muted text-sm rounded-sm small-text">
                    No image available
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      {(client.name || project.industries?.length > 0 || client.location || project.completion_date) && (
        <section className="py-14 md:py-16 bg-background">
          <div className="max-w-6xl mx-auto px-4">
            <FadeIn>
              <SectionHeading eyebrow="Details" title="Project Overview" />
            </FadeIn>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {client.name && (
                <FadeIn delay={20}>
                  <div className="bg-background-section border border-border rounded-lg p-4 text-center">
                    <FontAwesomeIcon icon={faBuilding} className="text-primary text-lg" />
                    <div className="mt-2 text-xs text-muted uppercase tracking-wider text-xxs">Client</div>
                    <div className="mt-1 text-sm font-semibold text-heading truncate subheading text-sm">{client.name}</div>
                  </div>
                </FadeIn>
              )}
              {project.industries?.length > 0 && (
                <FadeIn delay={40}>
                  <div className="bg-background-section border border-border rounded-lg p-4 text-center">
                    <FontAwesomeIcon icon={faIndustry} className="text-primary text-lg" />
                    <div className="mt-2 text-xs text-muted uppercase tracking-wider text-xxs">Industry</div>
                    <div className="mt-1 text-sm font-semibold text-heading truncate subheading text-sm">
                      {typeof project.industries[0] === "object" ? project.industries[0].name : "Industry"}
                    </div>
                  </div>
                </FadeIn>
              )}
              {client.location && (
                <FadeIn delay={60}>
                  <div className="bg-background-section border border-border rounded-lg p-4 text-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary text-lg" />
                    <div className="mt-2 text-xs text-muted uppercase tracking-wider text-xxs">Location</div>
                    <div className="mt-1 text-sm font-semibold text-heading truncate subheading text-sm">{client.location}</div>
                  </div>
                </FadeIn>
              )}
              {project.completion_date && (
                <FadeIn delay={80}>
                  <div className="bg-background-section border border-border rounded-lg p-4 text-center">
                    <FontAwesomeIcon icon={faCalendar} className="text-primary text-lg" />
                    <div className="mt-2 text-xs text-muted uppercase tracking-wider text-xxs">Completed</div>
                    <div className="mt-1 text-sm font-semibold text-heading truncate subheading text-sm">{formatDate(project.completion_date)}</div>
                  </div>
                </FadeIn>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Overview */}
      {project.description && (
        <section className="py-14 md:py-16 bg-background-section">
          <div className="max-w-4xl mx-auto px-4">
            <FadeIn>
              <SectionHeading eyebrow="About" title="Project Overview" />
            </FadeIn>
            <FadeIn delay={40}>
              <div className="mt-8 text-text leading-relaxed body-text whitespace-pre-line text-justify md:text-left">
                {project.description}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Gallery */}
      {project.gallery?.length > 0 && (
        <section className="py-14 md:py-16 bg-background">
          <div className="max-w-6xl mx-auto px-4">
            <FadeIn>
              <SectionHeading eyebrow="Visuals" title="Project Gallery" />
            </FadeIn>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-3">
              {project.gallery.map((img, i) => (
                <FadeIn key={i} delay={i * 30}>
                  <img
                    src={resolveImagePath(img)}
                    alt=""
                    className="w-full aspect-video object-cover border border-border rounded-sm"
                    loading="lazy"
                  />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {project.services?.length > 0 && (
        <section className="py-14 md:py-16 bg-background-section">
          <div className="max-w-6xl mx-auto px-4">
            <FadeIn>
              <SectionHeading eyebrow="Services" title="Services Used" />
            </FadeIn>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {project.services.map((s, i) => (
                <FadeIn key={i} delay={i * 20}>
                  <span className="px-4 py-2 bg-background border border-border text-text text-sm rounded-sm small-text">
                    {typeof s === "object" ? s.service_name : "Service"}
                  </span>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Technologies Section */}
      {project.technologies?.length > 0 && (
        <section className="py-14 md:py-16 bg-background">
          <div className="max-w-6xl mx-auto px-4">
            <FadeIn>
              <SectionHeading 
                eyebrow="Tech Stack" 
                title="Technologies" 
                subtitle="The tools and technologies we use to build your solutions." 
              />
            </FadeIn>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {project.technologies.map((tech, i) => {
                const name = typeof tech === "object" ? tech.name : tech;
                return (
                  <FadeIn key={i} delay={i * 30}>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-background-section border border-border text-heading text-sm font-semibold hover:border-primary/40 transition small-text font-bold">
                      {name}
                    </span>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Industries */}
      {project.industries?.length > 0 && (
        <section className="py-14 md:py-16 bg-background-section">
          <div className="max-w-6xl mx-auto px-4">
            <FadeIn>
              <SectionHeading eyebrow="Sectors" title="Industries" subtitle="The industries this project was built for." />
            </FadeIn>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {project.industries.map((ind, i) => (
                <FadeIn key={ind._id || i} delay={i * 30} className="w-[calc(50%-8px)] sm:w-[calc(33.33%-11px)] lg:w-[calc(25%-12px)] min-w-[140px]">
                  <div className="bg-background border border-border rounded-lg p-5 flex flex-col items-center text-center hover:shadow-sm transition h-full w-full">
                    {ind.icon ? (
                      <img
                        src={resolveImagePath(ind.icon)}
                        alt=""
                        className="w-12 h-12 mb-3 object-contain rounded-sm"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center mb-3">
                        <FontAwesomeIcon icon={faIndustry} className="text-primary text-lg" />
                      </div>
                    )}
                    <h3 className="font-semibold text-heading text-sm subheading text-sm">{ind.name}</h3>
                    {ind.description && (
                      <p className="mt-2 text-xs text-text leading-relaxed text-xxs">{ind.description}</p>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {project.team?.length > 0 && (
        <section className="py-14 md:py-16 bg-background">
          <div className="max-w-6xl mx-auto px-4">
            <FadeIn>
              <SectionHeading eyebrow="People" title="Team" subtitle="The team members who worked on this project." />
            </FadeIn>
            <div className="mt-10 flex flex-wrap justify-center gap-6">
              {project.team.map((m, i) => (
                <FadeIn key={i} delay={i * 40}>
                  <TeamCard member={m} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Client Info */}
      {(client.name || client.company || client.website || client.location || project.project_url || project.github_url || project.completion_date) && (
        <section className="py-14 md:py-16 bg-background-section">
          <div className="max-w-4xl mx-auto px-4">
            <FadeIn>
              <SectionHeading eyebrow="About" title="Client Information" />
            </FadeIn>
            <FadeIn delay={40}>
              <div className="mt-8 bg-background p-6 border border-border/60 rounded-lg body-text">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {client.name && (
                    <div className="text-sm text-text">
                      <span className="font-bold text-heading">Client Name:</span> {client.name}
                    </div>
                  )}
                  {client.company && (
                    <div className="text-sm text-text">
                      <span className="font-bold text-heading">Company:</span> {client.company}
                    </div>
                  )}
                  {client.website && (
                    <div className="text-sm text-text">
                      <span className="font-bold text-heading">Website:</span>{" "}
                      <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                        {client.website}
                      </a>
                    </div>
                  )}
                  {client.location && (
                    <div className="text-sm text-text">
                      <span className="font-bold text-heading">Location:</span> {client.location}
                    </div>
                  )}
                  {project.project_url && (
                    <div className="text-sm text-text">
                      <span className="font-bold text-heading">Project URL:</span>{" "}
                      <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                        {project.project_url}
                      </a>
                    </div>
                  )}
                  {project.github_url && (
                    <div className="text-sm text-text">
                      <span className="font-bold text-heading">GitHub URL:</span>{" "}
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                        {project.github_url}
                      </a>
                    </div>
                  )}
                  {project.completion_date && (
                    <div className="text-sm text-text">
                      <span className="font-bold text-heading">Completion Date:</span> {formatDate(project.completion_date)}
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Project Results */}
      {caseStudy?.results?.length > 0 && (
        <section className="py-14 md:py-16 bg-background">
          <div className="max-w-6xl mx-auto px-4">
            <FadeIn>
              <SectionHeading eyebrow="Outcomes" title="Project Results" subtitle="The measurable impact of this project." />
            </FadeIn>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {caseStudy.results.map((r, i) => (
                <FadeIn key={i} delay={i * 30} className="w-[calc(50%-8px)] md:w-[calc(25%-12px)] min-w-[140px]">
                  <div className="h-full flex flex-col justify-between bg-background-section border border-border rounded-lg p-5 text-center hover:shadow-sm transition">
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

      {/* Case Study Summary */}
      {caseStudy && (
        <section className="py-14 md:py-16 bg-background-section">
          <div className="max-w-4xl mx-auto px-4">
            <FadeIn>
              <SectionHeading eyebrow="Read More" title="Featured Case Study" />
            </FadeIn>
            <FadeIn delay={40}>
              <div className="mt-8 bg-background p-6 border border-border rounded-lg">
                <p className="text-text leading-relaxed body-text mb-4">{caseStudy.overview || caseStudy.challenge}</p>
                <Link
                  to={`/case-studies/${caseStudy.slug}`}
                  className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-semibold transition-colors button-text">
                  Read Full Case Study
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs" />
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Related Projects Grid */}
      {relatedProjects.length > 0 && (
        <section className="py-14 md:py-16 bg-background">
          <div className="max-w-6xl mx-auto px-4">
            <FadeIn>
              <SectionHeading eyebrow="More Work" title="Related Projects" subtitle="Other projects delivered using similar services." />
            </FadeIn>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.map((rp, i) => (
                <FadeIn key={rp._id} delay={i * 40}>
                  <Link
                    to={`/projects/${rp.slug}`}
                    className="flex flex-col bg-[#FAFAFA] border border-border rounded-sm h-full overflow-hidden hover:-translate-y-1 transition-all duration-300">
                    <div className="h-44 overflow-hidden">
                      <img
                        src={resolveImagePath(rp.thumbnail)}
                        alt={project.project_name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover rounded-sm"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/undraw_mobile-marketing_7x7m.svg";
                        }}
                      />
                    </div>
                    <div className="flex flex-col p-5 flex-1">
                      <h3 className="text-lg font-extrabold text-heading subheading text-sm">{rp.project_name}</h3>
                      <p className="mt-2 text-sm text-text leading-relaxed line-clamp-2 small-text">{rp.short_description}</p>
                      {rp.industries?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {rp.industries.slice(0, 2).map((ind, idx) => (
                            <span key={idx} className="text-xs px-2 py-0.5 bg-primary-light/40 text-primary font-medium rounded-sm text-xxs">
                              {typeof ind === "object" ? ind.name : ind}
                            </span>
                          ))}
                        </div>
                      )}
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary button-text">
                        View Project <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                      </span>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      <FadeIn>
        <FinalCTA />
      </FadeIn>
    </div>
  );
}