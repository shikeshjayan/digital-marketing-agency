import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useServiceStore from '../store/serviceStore.js'
import { slugify } from '../utils/slugify.js'

export default function Footer() {
  const { services, fetchServices } = useServiceStore()

  // Fetch live services automatically when the footer mounts
  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  // Map out available services and filter for active ones (limited to top 4 maximum)
  const activeServices = (services ?? [])
    .filter((s) => s.status === 'Active')
    .slice(0, 4)

  return (
    <footer className="bg-gray-900 text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Company Brand Block */}
          <div>
            <div className="flex items-center gap-3">
              <img src="/crown-96.png" alt="CrawlCrown Logo" className="w-9 h-9 rounded-xl object-contain" />
              <div className="font-bold text-lg">CrawlCrown</div>
            </div>
            <p className="mt-3 text-sm text-gray-300">
              Full-service digital marketing agency with design, development, and performance growth.
            </p>
            <div className="mt-4 flex gap-3 text-sm text-gray-300">
              {['Facebook', 'Instagram', 'LinkedIn', 'YouTube'].map((x) => (
                <a key={x} href="#" className="hover:text-white cursor-pointer" onClick={(e) => e.preventDefault()}>
                  {x}
                </a>
              ))}
            </div>
          </div>

          {/* Directory Links Column Group */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-semibold mb-3">Services</div>
              <ul className="space-y-2 text-sm text-gray-300">
                {activeServices.length > 0 ? (
                  activeServices.map((service) => (
                    <li key={service._id}>
                      <Link 
                        to={`/services/${slugify(service.service_name)}`} 
                        className="cursor-pointer hover:text-red-400 transition"
                      >
                        {service.service_name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <div className="text-xs text-gray-400 italic">No active services</div>
                )}
              </ul>
            </div>
            
            <div>
              <div className="text-sm font-semibold mb-3">Company</div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link to="/about" className="cursor-pointer hover:text-red-400 transition">About</Link>
                </li>
                <li>
                  <Link to="/projects" className="cursor-pointer hover:text-red-400 transition">Projects</Link>
                </li>
                <li>
                  <Link to="/contact" className="cursor-pointer hover:text-red-400 transition">Contact</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Static Contact Grid Block */}
          <div>
            <div className="text-sm font-semibold mb-3">Contact</div>
            <div className="text-sm text-gray-300 space-y-2">
              <div>Phone: +91 8891212323</div>
              <div>Email: info@s.com</div>
              <div className="text-gray-400">Address: Kochi, India</div>
            </div>
          </div>
        </div>

        {/* Legal Copyright Line */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} <span className="text-red-400">CrawlCrown</span>. All rights reserved.
        </div>
      </div>
    </footer>
  )
}