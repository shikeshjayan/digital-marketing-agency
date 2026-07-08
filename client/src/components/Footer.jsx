import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleUp, faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faInstagram, faLinkedinIn, faYoutube } from '@fortawesome/free-brands-svg-icons'
import FadeIn from '../components/ui/FadeIn.jsx'
import useServiceStore from '../store/serviceStore.js'
import useBrandSettingsStore from '../store/brandSettingsStore.js'

const iconMap = {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faYoutube,
}

export default function Footer() {
  const { services, fetchServices } = useServiceStore()
  const { content, fetchBrandSettings } = useBrandSettingsStore()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    fetchServices()
    fetchBrandSettings()

    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [fetchServices, fetchBrandSettings])

  const activeServices = (services ?? [])
    .filter((s) => s.status === 'Active')
    .slice(0, 4)

  const brand = content?.brand ?? {}
  const socialLinks = content?.socialLinks ?? []
  const contact = content?.contact ?? {}
  const companyLinks = content?.companyLinks ?? []

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <footer className="text-white mt-14 relative flex flex-col items-center bg-footer">
      <div className="w-full max-w-7xl">
        <FadeIn>
          <div className="px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              
              {/* Company Brand Block */}
              <div>
                <div className="flex items-center gap-3">
                  <img src={brand.logo || "/crown-99.png"} alt={`${brand.name || "CrawlCrown"} Logo`} className="w-9 h-9 rounded-lg object-contain" />
                  <div className="font-bold text-lg">{brand.name || "CrawlCrown"}</div>
                </div>
                <p className="mt-4 text-sm text-white/80 leading-relaxed max-w-sm">
                  {brand.tagline || "Full-service digital marketing agency with design, development, and performance growth."}
                </p>
                <div className="mt-5 flex gap-3 text-base text-white/70">
                  {socialLinks.map((social) => (
                    <a 
                      key={social.platform} 
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer" 
                      aria-label={social.platform}
                    >
                      <FontAwesomeIcon icon={iconMap[social.icon]} className="text-sm" />
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
                            to={`/services/${service.slug}`} 
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
                    {companyLinks.length > 0 ? (
                      companyLinks.map((link) => (
                        <li key={link.path}>
                          <Link to={link.path} className="cursor-pointer hover:text-primary transition-colors">{link.label}</Link>
                        </li>
                      ))
                    ) : (
                      <div className="text-xs text-white/40 italic">No links</div>
                    )}
                  </ul>
                </div>
              </div>

              {/* Synchronized Contact Block using explicit icon parameters matching Testimonials sidebars */}
              <div>
                <div className="text-sm font-semibold mb-4 text-white">Contact</div>
                <div className="space-y-3 text-sm text-white/80">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center small-text text-white/70">
                      <FontAwesomeIcon icon={faPhone} />
                    </span>
                    <a href={`tel:${contact.phone || "+91 8891212323"}`} className="text-white/80 hover:text-primary transition-colors">
                      {contact.phone || "+91 8891212323"}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center small-text text-white/70">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </span>
                    <a href={`mailto:${contact.email || "crowlcrown@gmail.com"}`} className="text-white/80 hover:text-primary transition-colors">
                      {contact.email || "crowlcrown@gmail.com"}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center small-text text-white/70">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                    </span>
                     <a href={`https://www.google.com/maps/search/${encodeURIComponent(contact.address || "Ernakulam Kochi Kerala India")}`} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-primary transition-colors">
                      {contact.address || "Ernakulam, Kochi, Kerala, India"}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Copyright Line */}
            <div className="border-t border-white/10 mt-12 pt-6 text-center text-sm text-white/50">
              © {new Date().getFullYear()} <span className="text-primary font-semibold">{brand.name || "CrawlCrown"}</span>. All rights reserved.
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