import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

// Stores
import useServiceStore from "../store/serviceStore.js";
import useBrandSettingsStore from "../store/brandSettingsStore.js";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Our Services" },
  { to: "/projects", label: "Our Projects" },
  { to: "/team", label: "Our Team" },
  { to: "/testimonials", label: "Testimonials" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Connect directly to backend dynamic state layers
  const { fetchServices } = useServiceStore();
  const { content, fetchBrandSettings } = useBrandSettingsStore();

  // Trigger automated repository fetches when header initializes
  useEffect(() => {
    fetchServices();
    fetchBrandSettings();
  }, [fetchServices, fetchBrandSettings]);

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <img
              src={content?.brand?.logo || "/crown-99.png"}
              alt={`${content?.brand?.name || "CrawlCrown"} Logo`}
              className="w-9 h-9 rounded-lg object-contain"
            />
            <span className="font-bold text-heading">{content?.brand?.name || "CrawlCrown"}</span>
          </Link>

          <nav className="hidden md:flex items-center justify-center flex-1 gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive: active }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                    active ? "text-primary" : "text-text hover:text-primary-hover"
                  }`
                }>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <NavLink
              to="/contact"
              className="px-5 py-2.5 rounded-lg bg-primary text-white text-base font-semibold leading-none transition cursor-pointer hover:bg-primary-hover">
              Book Now
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
                key={item.to}
                to={item.to}
                className={({ isActive: active }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium cursor-pointer ${
                    active ? "text-primary" : "text-text hover:text-primary-hover"
                  }`
                }
                onClick={() => setMobileOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/contact"
              className="mt-2 px-5 py-2.5 rounded-lg bg-primary text-white text-base font-semibold transition text-center cursor-pointer hover:bg-primary-hover"
              onClick={() => setMobileOpen(false)}>
              Book Now
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}