import { useEffect, useMemo, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

// Stores
import useServiceStore from "../store/serviceStore.js";
import { slugify } from "../utils/slugify.js";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Our Services", dropdown: true },
  { to: "/projects", label: "Our Projects" },
  { to: "/team", label: "Our Team" },
  { to: "/testimonials", label: "Testimonials" },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  // Connect directly to backend dynamic state layers
  const { services, fetchServices } = useServiceStore();

  // Trigger automated repository fetches when header initializes
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Compute live services dropdown links—strictly showing database contents
  const dynamicServiceLinks = useMemo(() => {
    const activeServices = (services ?? []).filter((s) => s.status === "Active");
    return activeServices.map((s) => ({
      label: s.service_name,
      to: `/services/${slugify(s.service_name)}`,
    }));
  }, [services]);

  const isActive = useMemo(() => {
    if (location.pathname.startsWith("/services")) return "services";
    return null;
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 cursor-pointer">
            <img
              src="/crown-96.png"
              alt="CrawlCrown Logo"
              className="w-9 h-9 rounded-lg object-contain"
            />
            <span className="font-bold text-heading">CrawlCrown</span>
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
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                        active ? "text-primary" : "text-text hover:text-primary"
                      }`}>
                      Our Services
                    </NavLink>
                    {servicesOpen && (
                      <div className="absolute left-0 top-full pt-2 w-64">
                        <div className="bg-background border border-border rounded-lg p-2 max-h-80 overflow-y-auto">
                          <NavLink
                            to="/services"
                            className="block px-3 py-2 rounded-lg text-sm font-semibold hover:text-primary border-b border-border mb-1 cursor-pointer">
                            All Services
                          </NavLink>
                          {dynamicServiceLinks.length > 0 ? (
                            dynamicServiceLinks.map((service, index) => (
                              <NavLink
                                key={`${service.to}-${index}`}
                                to={service.to}
                                className="block px-3 py-2 rounded-lg text-sm text-text hover:text-primary cursor-pointer">
                                {service.label}
                              </NavLink>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-xs text-muted italic">No active services</div>
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
                    `px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                      active ? "text-primary" : "text-text hover:text-primary"
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
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold transition cursor-pointer hover:bg-primary-hover">
              Book an Appointment
            </NavLink>
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border cursor-pointer text-text"
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
        <div className="md:hidden border-t border-border bg-background">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to ?? item.label}
                to={item.to}
                className={({ isActive: active }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium cursor-pointer ${
                    active ? "text-primary" : "text-text hover:text-primary"
                  }`
                }
                onClick={() => setMobileOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/contact"
              className="mt-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold transition text-center cursor-pointer hover:bg-primary-hover"
              onClick={() => setMobileOpen(false)}>
              Book an Appointment
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}