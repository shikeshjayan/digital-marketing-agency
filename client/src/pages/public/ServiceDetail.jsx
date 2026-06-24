import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { publicGetServices } from '../../services/mockApi.js'
import HeroSplit from '../../components/public/HeroSplit.jsx'
import { slugify } from '../../utils/slugify.js'

function serviceIcon(name) {
  if (name.includes('Video')) return '🎬'
  if (name.includes('E-Commerce')) return '🛒'
  if (name.includes('App')) return '📱'
  if (name.includes('Graphic')) return '🎨'
  if (name.includes('Branding')) return '📣'
  if (name.includes('Performance')) return '📈'
  if (name.includes('Influencer')) return '🤝'
  if (name.includes('Content')) return '✍️'
  return '✨'
}

export default function ServiceDetail() {
  const { slug } = useParams()
  const [service, setService] = useState(null)

  useEffect(() => {
    publicGetServices({ page: 1, limit: 50 }).then((res) => {
      const found = (res.data ?? []).find((s) => slugify(s.service_name) === slug)
      setService(found ?? null)
    })
  }, [slug])

  const paragraphs = useMemo(() => {
    const text = service?.description ?? ''
    if (!text) return []
    return text.split('.').map((p) => p.trim()).filter(Boolean)
  }, [service])

  return (
    <div>
      <HeroSplit
        title="Services"
        titleHighlight="Our"
        subtitle={service ? service.service_name : 'Service details'}
      />

      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            {service?.service_name ?? 'Service Not Found'}
          </h2>
          <div className="mt-6 flex justify-center">
            <div className="w-full max-w-xl aspect-[16/9] rounded-3xl bg-gray-100 border border-gray-200 flex items-center justify-center text-6xl">
              {service ? serviceIcon(service.service_name) : '🧩'}
            </div>
          </div>
          <div className="mt-8 text-gray-700 leading-relaxed text-left">
            {paragraphs.length ? (
              <div className="space-y-3">
                {paragraphs.map((p, i) => (
                  <p key={i} className="text-justify">
                    {p}.
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No service found for this URL.</p>
            )}
          </div>
          <div className="mt-8">
            <Link
              to="/services"
              className="inline-flex items-center rounded-full bg-red-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-orange-500 transition"
            >
              Back to Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
