// Site footer — logo, service links, company links, contact info
import { Link } from 'react-router-dom'
import { serviceNavLinks } from '../data/serviceLinks.js'

export default function Footer() {
  // Show first 3 services in the footer
  const featuredServices = serviceNavLinks.slice(0, 3)

  return (
    <footer className="bg-gray-900 text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600" aria-hidden="true" />
              <div className="font-bold text-lg">Digital Marketing</div>
            </div>
            <p className="mt-3 text-sm text-gray-300">
              Full-service digital marketing agency with design, development, and performance growth.
            </p>
            <div className="mt-4 flex gap-3 text-sm text-gray-300">
              {['Facebook', 'Instagram', 'LinkedIn', 'YouTube'].map((x) => (
                <span key={x} className="text-gray-400">
                  {x}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-semibold mb-3">Services</div>
              <ul className="space-y-2 text-sm text-gray-300">
                {featuredServices.map((service) => (
                  <li key={service.to}>
                    <Link to={service.to} className="hover:text-white transition">
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-sm font-semibold mb-3">Company</div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link to="/about" className="hover:text-white transition">About</Link>
                </li>
                <li>
                  <Link to="/projects" className="hover:text-white transition">Projects</Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition">Contact</Link>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold mb-3">Contact</div>
            <div className="text-sm text-gray-300 space-y-2">
              <div>
                Phone:{' '}
                <a href="tel:+918891212323" className="hover:text-white transition">
                  +91 8891212323
                </a>
              </div>
              <div>
                Email:{' '}
                <a href="mailto:info@s.com" className="hover:text-white transition">
                  info@s.com
                </a>
              </div>
              <div className="text-gray-400">Address: Kochi, India</div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} <span className="text-red-400">Digital Marketing</span>. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
