import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { publicGetServices } from '../../services/mockApi.js'
import HeroSplit from '../../components/public/HeroSplit.jsx'
import { slugify } from '../../utils/slugify.js'

function ServiceCard({ service }) {
  const detailPath = `/services/${slugify(service.service_name)}`
  const gradient = useMemo(() => {
    const c = service.service_id % 5
    const map = [
      'from-red-600/20 to-red-600/5',
      'from-orange-500/20 to-orange-500/5',
      'from-rose-500/20 to-rose-500/5',
      'from-pink-500/20 to-pink-500/5',
      'from-red-600/20 to-gray-200/5',
    ]
    return map[c] ?? map[0]
  }, [service.service_id])

  const icon = service.service_name.includes('Video')
    ? '🎬'
    : service.service_name.includes('E-Commerce')
      ? '🛒'
      : service.service_name.includes('App')
        ? '📱'
        : service.service_name.includes('Graphic')
          ? '🎨'
          : '✨'

  return (
    <Link
      to={detailPath}
      className="group block bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-red-100 transition"
    >
      <div className={`h-28 rounded-2xl border border-gray-100 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <div className="text-3xl">{icon}</div>
      </div>
      <h3 className="mt-4 text-lg font-extrabold text-gray-900 group-hover:text-red-700 transition">{service.service_name}</h3>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3">{service.short_description}</p>
      <div className="mt-4">
        <span className="inline-flex items-center rounded-full bg-red-600 text-white px-5 py-2.5 text-sm font-semibold group-hover:bg-orange-500 transition">
          Read More
        </span>
      </div>
    </Link>
  )
}

export default function Services() {
  const [services, setServices] = useState([])

  useEffect(() => {
    publicGetServices({ page: 1, limit: 50 }).then((res) => setServices(res.data ?? []))
  }, [])

  return (
    <div>
      <HeroSplit title="Services" titleHighlight="Our" subtitle="Design, development, and marketing support—end to end." />

      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <ServiceCard key={s.service_id} service={s} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

