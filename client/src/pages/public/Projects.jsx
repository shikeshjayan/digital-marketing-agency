import { useEffect, useMemo, useState } from 'react'
import { publicGetProjects } from '../../services/mockApi.js'
import HeroSplit from '../../components/public/HeroSplit.jsx'

const categories = ['All', 'Static', 'Dynamic', 'Landing Pages']

function ProjectCard({ project }) {
  const gradient = useMemo(() => {
    const c = project.project_id % 4
    return c === 0
      ? 'from-red-600/30 to-orange-500/10'
      : c === 1
        ? 'from-orange-500/30 to-amber-500/10'
        : c === 2
          ? 'from-red-500/30 to-pink-500/10'
          : 'from-gray-700/30 to-red-500/10'
  }, [project.project_id])

  return (
    <a
      href={project.live_url}
      target="_blank"
      rel="noreferrer"
      className="group block bg-white border border-gray-100 rounded-3xl p-4 shadow-sm hover:shadow-md transition"
    >
      <div className={`h-36 rounded-2xl bg-gradient-to-br ${gradient} border border-gray-100 flex items-center justify-center`}>
        <div className="text-4xl">{project.category === 'Landing Pages' ? '🧲' : project.category === 'Static' ? '🧱' : '🧠'}</div>
      </div>
      <div className="mt-4">
        <div className="font-extrabold text-gray-900">{project.project_name}</div>
        <div className="mt-1 text-sm text-gray-600">{project.short_description}</div>
        <div className="mt-3 inline-flex items-center rounded-full bg-red-50 text-red-700 px-3 py-1 text-xs font-semibold border border-red-100 group-hover:bg-red-100 transition">
          {project.category}
        </div>
      </div>
    </a>
  )
}

export default function Projects() {
  const [active, setActive] = useState('All')
  const [projects, setProjects] = useState([])

  useEffect(() => {
    publicGetProjects({ category: active === 'All' ? undefined : active, page: 1, limit: 50 }).then((res) => {
      setProjects(res.data ?? [])
    })
  }, [active])

  return (
    <div>
      <HeroSplit title="Projects" titleHighlight="Our" subtitle="A selection of recent work across categories." />

      <section className="py-10 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                  active === c
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-red-200 hover:text-red-700'
                }`}
              >
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
            <div className="mt-10 text-center text-gray-600">No projects found for this category.</div>
          )}
        </div>
      </section>
    </div>
  )
}

