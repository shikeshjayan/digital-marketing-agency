// Main site navigation — desktop dropdowns + mobile menu
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { serviceNavLinks, serviceDetailPath } from '../data/serviceLinks.js'
import { courseNavLinks } from '../data/coursePrograms.js'
import { publicGetServices } from '../services/mockApi.js'

// Main menu links shown in the header
const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Our Services', dropdown: 'services' },
  { to: '/projects', label: 'Our Projects' },
  { to: '/courses', label: 'Our Courses', dropdown: 'courses' },
  { to: '/team', label: 'Our Team' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/contact', label: 'Contact Us' },
]

export default function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [coursesOpen, setCoursesOpen] = useState(false)
  const [serviceLinks, setServiceLinks] = useState(serviceNavLinks)

  // Refresh service dropdown from API so it stays in sync with admin changes
  useEffect(() => {
    publicGetServices({ page: 1, limit: 50 })
      .then((res) => {
        const links = (res.data ?? []).map((service) => ({
          label: service.service_name,
          to: serviceDetailPath(service.service_id),
        }))
        if (links.length) setServiceLinks(links)
      })
      .catch(() => {})
  }, [])

  // Highlight Services/Courses menu when viewing those sections
  const isActive = useMemo(() => {
    if (location.pathname.startsWith('/services')) return 'services'
    if (location.pathname.startsWith('/courses')) return 'courses'
    return null
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600" aria-hidden="true" />
            <span className="font-bold text-gray-900">Digital Marketing</span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              if (item.dropdown === 'services') {
                const active = isActive === 'services'
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <NavLink
                      to="/services"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                        active ? 'text-red-700' : 'text-gray-700 hover:text-red-700 hover:bg-red-50'
                      }`}
                    >
                      Our Services
                    </NavLink>
                    {servicesOpen && (
                      <div className="absolute left-0 top-full pt-2 w-64">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-2">
                          <NavLink
                            to="/services"
                            className="block px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 hover:text-red-700 border-b border-gray-100 mb-1"
                          >
                            All Services
                          </NavLink>
                          {serviceLinks.map((service) => (
                            <NavLink
                              key={service.to}
                              to={service.to}
                              className="block px-3 py-2 rounded-lg text-sm hover:bg-red-50 hover:text-red-700"
                            >
                              {service.label}
                            </NavLink>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              }

              if (item.dropdown === 'courses') {
                const active = isActive === 'courses'
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setCoursesOpen(true)}
                    onMouseLeave={() => setCoursesOpen(false)}
                  >
                    <NavLink
                      to="/courses"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                        active ? 'text-red-700' : 'text-gray-700 hover:text-red-700 hover:bg-red-50'
                      }`}
                    >
                      Our Courses
                    </NavLink>
                    {coursesOpen && (
                      <div className="absolute left-0 top-full pt-2 w-64">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-2">
                          <NavLink
                            to="/courses"
                            className="block px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 hover:text-red-700 border-b border-gray-100 mb-1"
                          >
                            All Courses
                          </NavLink>
                          {courseNavLinks.map((course) => (
                            <NavLink
                              key={course.to}
                              to={course.to}
                              className="block px-3 py-2 rounded-lg text-sm hover:bg-red-50 hover:text-red-700"
                            >
                              {course.label}
                            </NavLink>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive: active }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition ${
                      active ? 'text-red-700 bg-red-50' : 'text-gray-700 hover:text-red-700 hover:bg-red-50'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <NavLink
              to="/contact"
              className="px-4 py-2 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-orange-500 transition"
            >
              Book an Appointment
            </NavLink>
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className="text-lg">{mobileOpen ? '×' : '≡'}</span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <div key={item.to ?? item.label}>
                <NavLink
                  to={item.to}
                  className={({ isActive: active }) =>
                    `block px-3 py-2 rounded-lg text-sm font-medium ${
                      active ? 'text-red-700 bg-red-50' : 'text-gray-700 hover:text-red-700 hover:bg-red-50'
                    }`
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </NavLink>
                {item.dropdown === 'services' && (
                  <div className="ml-3 border-l border-gray-200 pl-3 pb-2">
                    {serviceLinks.map((service) => (
                      <NavLink
                        key={service.to}
                        to={service.to}
                        className="block px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setMobileOpen(false)}
                      >
                        {service.label}
                      </NavLink>
                    ))}
                  </div>
                )}
                {item.dropdown === 'courses' && (
                  <div className="ml-3 border-l border-gray-200 pl-3 pb-2">
                    {courseNavLinks.map((course) => (
                      <NavLink
                        key={course.to}
                        to={course.to}
                        className="block px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setMobileOpen(false)}
                      >
                        {course.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <NavLink
              to="/contact"
              className="mt-2 px-4 py-2 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-orange-500 transition text-center"
              onClick={() => setMobileOpen(false)}
            >
              Book an Appointment
            </NavLink>
          </div>
        </div>
      )}
    </header>
  )
}
