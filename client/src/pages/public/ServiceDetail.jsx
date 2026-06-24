// Single service detail page — loaded by URL id (e.g. /services/1)
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { publicGetServiceById } from '../../services/mockApi.js'
import HeroSplit from '../../components/public/HeroSplit.jsx'
import ImagePlaceholder from '../../components/ui/ImagePlaceholder.jsx'

export default function ServiceDetail() {
  const { id } = useParams()
  const [state, setState] = useState({ status: 'loading', service: null, id: '' })

  useEffect(() => {
    let active = true
    publicGetServiceById(id)
      .then((res) => {
        if (!active) return
        setState({
          status: 'ready',
          service: res.success ? res.data : null,
          id,
        })
      })
      .catch(() => {
        if (!active) return
        setState({ status: 'ready', service: null, id })
      })
    return () => {
      active = false
    }
  }, [id])

  const loading = state.id !== id
  const service = loading ? null : state.service

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
            {loading ? 'Loading...' : service?.service_name ?? 'Service Not Found'}
          </h2>
          <div className="mt-6 flex justify-center">
            <div className="w-full max-w-xl aspect-[16/9] rounded-3xl bg-gray-100 border border-gray-200 flex items-center justify-center">
              <ImagePlaceholder label="Image" />
            </div>
          </div>
          <div className="mt-8 text-gray-700 leading-relaxed text-left">
            {service?.description ? (
              <p className="text-justify">{service.description}</p>
            ) : (
              <p className="text-center text-gray-500">
                {loading ? 'Loading service details...' : 'No service found for this URL.'}
              </p>
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
