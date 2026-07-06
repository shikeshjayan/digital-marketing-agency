import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faArrowRight,
  faBuilding,
  faIndustry,
  faClock,
  faCheckCircle,
  faQuoteLeft,
  faRocket,
  faLightbulb,
  faBullseye,
  faCogs,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import resolveImagePath from "../../utils/resolveImagePath.js";

const IMAGE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect fill='%23F8FAFC' width='800' height='400'/%3E%3Ctext x='400' y='210' text-anchor='middle' fill='%236B7280' font-size='18' font-family='sans-serif'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function ProjectDetailModal({ open, onClose, project }) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !project) return null;

  const img = resolveImagePath(project.image);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center p-0 sm:p-4 md:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={project.project_name}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div
        className="relative z-10 bg-background rounded-lg shadow-2xl w-full max-w-3xl my-0 sm:my-6 md:my-10 flex flex-col transform scale-100 transition-all duration-300"
        onClick={(e) => e.stopPropagation()}>

        {/* Title bar */}
        <div className="sticky top-0 z-40 bg-background-section border-b border-border px-5 sm:px-6 py-4 flex items-center justify-between runded-md">
          <div className="flex-1 min-w-0 mr-4">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {project.category && (
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary-light text-primary text-xs font-semibold">
                  {project.category}
                </span>
              )}
              {project.status && (
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    project.status === "Active"
                      ? "bg-success/10 text-success"
                      : "bg-warning/10 text-warning"
                  }`}>
                  {project.status}
                </span>
              )}
              {project.industry && (
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-surface text-muted text-xs font-semibold border border-border">
                  {project.industry}
                </span>
              )}
            </div>
            <h2 className="subheading text-heading truncate">
              {project.project_name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center text-muted hover:text-white hover:bg-primary shadow-sm hover:shadow transition duration-200 cursor-pointer"
            aria-label="Close">
            <FontAwesomeIcon icon={faTimes} className="text-sm" />
          </button>
        </div>

        {/* Hero image — full bleed */}
        <div className="w-full aspect-[2/1] sm:aspect-[16/7] bg-surface">
          <img
            src={img}
            alt={project.project_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = IMAGE_PLACEHOLDER;
            }}
          />
        </div>

        {/* Content sections */}
        <div className="p-5 sm:p-6 md:p-7 flex flex-col gap-6">

          {/* Overview */}
          {project.description && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faRocket} className="text-primary text-sm" />
                <h3 className="subheading text-heading">Overview</h3>
              </div>
              <p className="text-text body-text leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>
          )}

          {/* Challenge */}
          {project.challenge && (
            <div className="bg-warning/5 border border-warning/20 p-5">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faBullseye} className="text-warning text-sm" />
                <h3 className="subheading text-heading">Challenge</h3>
              </div>
              <p className="text-text body-text leading-relaxed whitespace-pre-line">
                {project.challenge}
              </p>
            </div>
          )}

          {/* Solution */}
          {project.solution && (
            <div className="bg-info/5 border border-info/20 p-5">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faLightbulb} className="text-info text-sm" />
                <h3 className="subheading text-heading">Solution</h3>
              </div>
              <p className="text-text body-text leading-relaxed whitespace-pre-line">
                {project.solution}
              </p>
            </div>
          )}

          {/* Results */}
          {project.before_after && project.before_after.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faArrowRight} className="text-primary text-sm" />
                <h3 className="subheading text-heading">Results</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.before_after.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-primary/5 border border-primary/20 p-4 text-center hover:shadow-sm transition">
                    <div className="text-[11px] font-bold text-muted uppercase tracking-wider">
                      {item.metric}
                    </div>
                    <div className="mt-3 flex items-center justify-center gap-3">
                      <div>
                        <div className="text-[10px] text-muted uppercase tracking-wider">Before</div>
                        <div className="mt-0.5 text-base font-bold text-muted">{item.before}</div>
                      </div>
                      <FontAwesomeIcon icon={faArrowRight} className="text-primary text-xs" />
                      <div>
                        <div className="text-[10px] text-primary uppercase tracking-wider font-semibold">After</div>
                        <div className="mt-0.5 text-base font-bold text-primary">{item.after}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faCogs} className="text-primary text-sm" />
                <h3 className="subheading text-heading">Technologies Used</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-3 py-1.5 rounded-full bg-surface border border-border text-sm font-medium text-text hover:border-primary/40 transition">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Client Testimonial */}
          {project.client_testimonial && (
            <div className="bg-background-section p-5 border border-border/60">
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faQuoteLeft} className="text-primary text-sm" />
                <h3 className="subheading text-heading">Client Testimonial</h3>
              </div>
              <blockquote className="relative pl-4 border-l-2 border-primary/40">
                <p className="text-text body-text italic leading-relaxed whitespace-pre-line">
                  &ldquo;{project.client_testimonial}&rdquo;
                </p>
                {project.client_name && (
                  <footer className="mt-3 text-sm font-semibold text-muted">
                    — {project.client_name}
                  </footer>
                )}
              </blockquote>
            </div>
          )}

          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-border/60">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-white px-6 py-3 text-sm font-semibold hover:bg-primary-hover shadow-sm hover:shadow transition duration-200 cursor-pointer">
              <span>Start Your Project</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </a>
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background text-text px-6 py-3 text-sm font-semibold hover:border-primary/50 hover:text-primary transition duration-200 cursor-pointer">
                <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs" />
                <span>View Live Project</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
