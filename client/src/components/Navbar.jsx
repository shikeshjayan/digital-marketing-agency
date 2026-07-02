import { useEffect, useMemo, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

// Stores
import useServiceStore from "../store/serviceStore.js";
import useCourseStore from "../store/courseStore.js";
import { slugify } from "../utils/slugify.js";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Our Services", dropdown: true },
  { to: "/projects", label: "Our Projects" },
  { to: "/courses", label: "Our Courses", dropdown: true },
  { to: "/team", label: "Our Team" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);

  // Connect directly to backend dynamic state layers
  const { services, fetchServices } = useServiceStore();
  const { courses, fetchCourses } = useCourseStore();

  // Trigger automated repository fetches when header initializes
  useEffect(() => {
    fetchServices();
    fetchCourses();
  }, [fetchServices, fetchCourses]);

  // Compute live services dropdown links—strictly showing database contents
  const dynamicServiceLinks = useMemo(() => {
    const activeServices = (services ?? []).filter((s) => s.status === "Active");
    return activeServices.map((s) => ({
      label: s.service_name,
      to: `/services/${slugify(s.service_name)}`,
    }));
  }, [services]);

  // Compute live courses dropdown links—strictly showing database contents
  const dynamicCourseLinks = useMemo(() => {
    const activeCourses = (courses ?? []).filter((c) => c.status === "Active");
    return activeCourses.map((c) => ({
      label: c.course_name,
      to: `/courses/${c.slug || slugify(c.course_name)}`,
    }));
  }, [courses]);

  const isActive = useMemo(() => {
    if (location.pathname.startsWith("/services")) return "services";
    if (location.pathname.startsWith("/courses")) return "courses";
    return null;
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 cursor-pointer">
            <img
              src="/crown-99.png"
              alt="CrawlCrown Logo"
              className="w-9 h-9 rounded-xl object-contain"
            />
            <span className="font-bold text-gray-900">CrawlCrown</span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              if (item.dropdown && item.label === "Our Services") {
                const active = isActive === "services";
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}>
                    <NavLink
                      to="/services"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
                        active ? "text-red-700" : "text-gray-700 hover:text-red-700"
                      }`}>
                      Our Services
                    </NavLink>
                    {servicesOpen && (
                      <div className="absolute left-0 top-full pt-2 w-64">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-2 max-h-80 overflow-y-auto">
                          <NavLink
                            to="/services"
                            className="block px-3 py-2 rounded-lg text-sm font-semibold hover:text-red-700 border-b border-gray-100 mb-1 cursor-pointer">
                            All Services
                          </NavLink>
                          {dynamicServiceLinks.length > 0 ? (
                            dynamicServiceLinks.map((service, index) => (
                              <NavLink
                                key={`${service.to}-${index}`}
                                to={service.to}
                                className="block px-3 py-2 rounded-lg text-sm hover:text-red-700 cursor-pointer">
                                {service.label}
                              </NavLink>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-xs text-gray-400 italic">No active services</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              if (item.dropdown && item.label === "Our Courses") {
                const active = isActive === "courses";
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setCoursesOpen(true)}
                    onMouseLeave={() => setCoursesOpen(false)}>
                    <NavLink
                      to="/courses"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
                        active ? "text-red-700" : "text-gray-700 hover:text-red-700"
                      }`}>
                      Our Courses
                    </NavLink>
                    {coursesOpen && (
                      <div className="absolute left-0 top-full pt-2 w-64">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-2 max-h-80 overflow-y-auto">
                          <NavLink
                            to="/courses"
                            className="block px-3 py-2 rounded-lg text-sm font-semibold hover:text-red-700 border-b border-gray-100 mb-1 cursor-pointer">
                            All Courses
                          </NavLink>
                          {dynamicCourseLinks.length > 0 ? (
                            dynamicCourseLinks.map((course, index) => (
                              <NavLink
                                key={`${course.to}-${index}`}
                                to={course.to}
                                className="block px-3 py-2 rounded-lg text-sm hover:text-red-700 cursor-pointer">
                                {course.label}
                              </NavLink>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-xs text-gray-400 italic">No active courses</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive: active }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
                      active ? "text-red-700" : "text-gray-700 hover:text-red-700"
                    }`
                  }>
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <NavLink
              to="/contact"
              className="px-4 py-2 rounded-full bg-red-600 text-white text-sm font-semibold transition cursor-pointer hover:bg-red-500">
              Book an Appointment
            </NavLink>
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu">
            <span className="text-lg">
              {mobileOpen ? (
                <FontAwesomeIcon icon={faTimes} />
              ) : (
                <FontAwesomeIcon icon={faBars} />
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Layout */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to ?? item.label}
                to={item.to}
                className={({ isActive: active }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium cursor-pointer ${
                    active ? "text-red-700" : "text-gray-700 hover:text-red-700"
                  }`
                }
                onClick={() => setMobileOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/contact"
              className="mt-2 px-4 py-2 rounded-full bg-red-600 text-white text-sm font-semibold transition text-center cursor-pointer hover:bg-red-500"
              onClick={() => setMobileOpen(false)}>
              Book an Appointment
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}