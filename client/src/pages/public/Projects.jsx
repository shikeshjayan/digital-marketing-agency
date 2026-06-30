import { useEffect, useState } from "react";
import useProjectStore from "../../store/projectStore.js";
import HeroSplit from "../../components/public/HeroSplit.jsx";
import imageUrl from "../../utils/imageUrl.js";

const categories = ["All", "Static", "Dynamic", "Landing Pages"];

const ProjectCard = ({ project }) => {
  return (
    <a
      href={project.live_url}
      target="_blank"
      rel="noreferrer"
      className="group block bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden hover:shadow-lg hover:scale-[1.02] hover:border-red-200 transition-all duration-300 cursor-pointer">
      <div className="relative overflow-hidden">
        <img
          src={imageUrl(project.image) || '/placeholder.svg'}
          alt={project.project_name}
          loading="lazy"
          decoding="async"
          className="w-full h-48 object-cover bg-gray-200 group-hover:scale-110 transition-transform duration-300"
          onError={(e) => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect fill='%23e5e7eb' width='400' height='200'/%3E%3Ctext x='200' y='105' text-anchor='middle' fill='%239ca3af' font-size='16' font-family='sans-serif'%3ENo Image%3C/text%3E%3C/svg%3E"; }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-lg font-extrabold px-4 text-center">{project.project_name}</span>
        </div>
      </div>
    </a>
  );
};

const Projects = () => {
  const [active, setActive] = useState("All");
  const { projects, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchProjects(active);
  }, [active, fetchProjects]);

  return (
    <div>
      <HeroSplit
        title="Projects"
        titleHighlight="Our"
        subtitle="A selection of recent work across categories."
      />

      <section className="py-10 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition cursor-pointer ${
                  active === c
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-red-200 hover:text-red-700"
                }`}>
                {c}
              </button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <ProjectCard key={p.project_id} project={p} />
            ))}
          </div>

          {projects.length === 0 && (
            <div className="mt-10 text-center text-gray-600">
              No projects found for this category.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;
