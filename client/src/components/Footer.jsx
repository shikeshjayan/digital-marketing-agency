import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleUp } from '@fortawesome/free-solid-svg-icons'
import FadeIn from '../components/ui/FadeIn.jsx'
import useServiceStore from '../store/serviceStore.js'
import { slugify } from '../utils/slugify.js'

export default function Footer() {
  const { services, fetchServices } = useServiceStore()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    fetchServices()

    // Monitor scroll behavior to show the button once scrolled past the initial screen sections
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [fetchServices])

  const activeServices = (services ?? [])
    .filter((s) => s.status === 'Active')
    .slice(0, 4)

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <footer className="bg-dark text-white mt-14 relative flex flex-col items-center">
      <div className="w-full max-w-7xl">
        <FadeIn>
          <div className="px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              
              {/* Company Brand Block */}
              <div>
                <div className="flex items-center gap-3">
                  <img src="/crown-96.png" alt="CrawlCrown Logo" className="w-9 h-9 rounded-lg object-contain" />
                  <div className="font-bold text-lg">CrawlCrown</div>
                </div>
                <p className="mt-4 text-sm text-white/80 leading-relaxed max-w-sm">
                  Full-service digital marketing agency with design, development, and performance growth.
                </p>
                <div className="mt-5 flex gap-4 text-sm text-white/70">
                  {['Facebook', 'Instagram', 'LinkedIn', 'YouTube'].map((x) => (
                    <a key={x} href="#" className="hover:text-primary transition-colors cursor-pointer" onClick={(e) => e.preventDefault()}>
                      {x}
                    </a>
                  ))}
                </div>
              </div>

              {/* Directory Links Column Group */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-semibold mb-4 text-white">Services</div>
                  <ul className="space-y-2.5 text-sm text-white/70">
                    {activeServices.length > 0 ? (
                      activeServices.map((service) => (
                        <li key={service._id}>
                          <Link 
                            to={`/services/${slugify(service.service_name)}`} 
                            className="cursor-pointer hover:text-primary transition-colors"
                          >
                            {service.service_name}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <div className="text-xs text-white/40 italic">No active services</div>
                    )}
                  </ul>
                </div>
                
                <div>
                  <div className="text-sm font-semibold mb-4 text-white">Company</div>
                  <ul className="space-y-2.5 text-sm text-white/70">
                    <li>
                      <Link to="/about" className="cursor-pointer hover:text-primary transition-colors">About</Link>
                    </li>
                    <li>
                      <Link to="/projects" className="cursor-pointer hover:text-primary transition-colors">Projects</Link>
                    </li>
                    <li>
                      <Link to="/terms" className="cursor-pointer hover:text-primary transition-colors">Terms & Conditions</Link>
                    </li>
                    <li>
                      <Link to="/privacy" className="cursor-pointer hover:text-primary transition-colors">Privacy Policy</Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Static Contact Block */}
              <div>
                <div className="text-sm font-semibold mb-4 text-white">Contact</div>
                <div className="text-sm text-white/70 space-y-2.5">
                  <div>Phone: +91 8891212323</div>
                  <div>Email: info@s.com</div>
                  <div className="text-white/50">Address: Kochi, India</div>
                </div>
              </div>
            </div>

            {/* Legal Copyright Line */}
            <div className="border-t border-white/10 mt-12 pt-6 text-center text-sm text-white/50">
              © {new Date().getFullYear()} <span className="text-primary font-semibold">CrawlCrown</span>. All rights reserved.
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Screen-relative Floating Sticky Back To Top Button */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-none transition-all duration-300">
        <button
          type="button"
          onClick={scrollToTop}
          className={`w-10 h-10 rounded-lg bg-primary hover:bg-primary-hover border border-primary text-white flex items-center justify-center cursor-pointer shadow-md transition-all duration-300 ${
            isVisible ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none translate-y-4'
          }`}
          aria-label="Back to top"
        >
          <FontAwesomeIcon icon={faAngleUp} />
        </button>
      </div>
    </footer>
  )
}