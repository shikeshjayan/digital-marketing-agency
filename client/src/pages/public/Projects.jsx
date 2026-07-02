import { useEffect, useState } from "react";
import useProjectStore from "../../store/projectStore.js";
import HeroSplit from "../../components/public/HeroSplit.jsx";
import FadeIn from "../../components/ui/FadeIn.jsx";
import { ProjectCardSkeleton } from "../../components/ui/Skeleton.jsx";
import imageUrl from "../../utils/imageUrl.js";

const categories = ["All", "Static", "Dynamic", "Landing Pages"];

// Port Resolver helper ensuring uploaded project images render cleanly during local development
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

const ProjectCard = ({ project }) => {
  return (
    <a
      href={project.live_url}
      target="_blank"
      rel="noreferrer"
      className="group block bg-background border border-border rounded-lg overflow-hidden hover:scale-[1.02] hover:border-primary transition-all duration-300 cursor-pointer">
      <div className="relative overflow-hidden aspect-[4/3] w-full bg-surface">
        <img
          src={resolveImagePath(project.image)}
          alt={project.project_name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => { 
            e.target.onerror = null;
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect fill='%23F8FAFC' width='400' height='200'/%3E%3Ctext x='200' y='105' text-anchor='middle' fill='%236B7280' font-size='16' font-family='sans-serif'%3ENo Image%3C/text%3E%3C/svg%3E"; 
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-lg font-extrabold px-4 text-center break-words w-full">
            {project.project_name}
          </span>
        </div>
      </div>
    </a>
  );
};

const Projects = () => {
  const [active, setActive] = useState("All");
  const { projects, loading, error, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchProjects(active);
  }, [active, fetchProjects]);

  return (
    <div className="bg-background min-h-screen">
      <HeroSplit
        title="Projects"
        titleHighlight="Our"
        subtitle="A selection of recent work across categories."
        leftColor="bg-dark"
      />

      <section className="py-14 bg-surface">
        <div className="max-w-6xl mx-auto px-4">
          
          {/* Category Filter Toggle Layout */}
          <div className="flex flex-wrap gap-3 justify-center">
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
              <svg className="w-16 h-16 mx-auto text-muted opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <div className="mt-4 text-lg font-semibold text-heading">No projects found</div>
              <div className="mt-2 text-sm text-text">No projects available for this category.</div>
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
    </div>
  );
};

export default Projects;