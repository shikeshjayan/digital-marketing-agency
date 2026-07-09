import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, memo } from "react";
import useAuthStore from "../../store/authStore.js";
import apiService from "../../services/apiService.js";

function Icon({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-5 h-5 flex-shrink-0 ${className}`}>
      {children}
    </span>
  );
}

const HomeIcon = memo(function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
});

const ServicesIcon = memo(function ServicesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
});

const ProjectsIcon = memo(function ProjectsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    </svg>
  );
});

const CaseStudyIcon = memo(function CaseStudyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
});

const TeamIcon = memo(function TeamIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
});

const ReviewsIcon = memo(function ReviewsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
});

const MessagesIcon = memo(function MessagesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
});

const FooterIcon = memo(function FooterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="15" width="18" height="4" rx="1" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="7" y1="5" x2="7" y2="9" />
      <line x1="12" y1="5" x2="12" y2="9" />
      <line x1="17" y1="5" x2="17" y2="9" />
    </svg>
  );
});

const ContentIcon = memo(function ContentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
});

const SettingsIcon = memo(function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
});

const LogoutIcon = memo(function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
});

const CollapseIcon = memo(function CollapseIcon({ collapsed }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}>
      <polyline points="11 17 6 12 11 7" />
      <polyline points="18 17 13 12 18 7" />
    </svg>
  );
});

const navSections = [
  {
    label: "Main",
    items: [{ to: "/admin", label: "Dashboard", icon: HomeIcon, end: true }],
  },
  {
    label: "Content",
    items: [
      { to: "/admin/services", label: "Services", icon: ServicesIcon },
      { to: "/admin/projects", label: "Projects", icon: ProjectsIcon },
      { to: "/admin/case-studies", label: "Case Studies", icon: CaseStudyIcon },
      { to: "/admin/technologies", label: "Technologies", icon: ServicesIcon },
      { to: "/admin/industries", label: "Industries", icon: ProjectsIcon },
      { to: "/admin/team", label: "Team", icon: TeamIcon },
      { to: "/admin/site-content", label: "Site Content", icon: ContentIcon },
    ],
  },
  {
    label: "Engagement",
    items: [
      {
        to: "/admin/reviews",
        label: "Reviews",
        icon: ReviewsIcon,
        badge: "reviews",
      },
      {
        to: "/admin/messages",
        label: "Messages",
        icon: MessagesIcon,
        badge: "messages",
      },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
      { to: "/admin/brand-settings", label: "Brand Settings", icon: FooterIcon },
    ],
  },
];

const NavItem = memo(function NavItem({ item, collapsed, onClick, badges }) {
  const IconComponent = item.icon;
  const count = item.badge ? badges[item.badge] || 0 : 0;

  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        `group relative flex items-center ${collapsed ? "justify-center px-2" : "gap-3 px-3"} py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
          isActive
            ? "bg-primary-light text-primary"
            : "text-text hover:bg-surface hover:text-heading"
        }`
      }
      onClick={onClick}>
      {({ isActive }) => (
        <>
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
          )}
          <Icon
            className={
              isActive ? "text-primary" : "text-muted group-hover:text-text"
            }>
            <IconComponent />
          </Icon>
          {!collapsed && (
            <>
              <span className="flex-1 truncate">{item.label}</span>
              {count > 0 && (
                <span className="min-w-5 h-5 px-1.5 flex items-center justify-center text-xs font-bold bg-primary text-white rounded-full">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </>
          )}
          {collapsed && count > 0 && (
            <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          )}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-secondary text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
              {item.label}
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-secondary rotate-45" />
            </div>
          )}
        </>
      )}
    </NavLink>
  );
});

export default function AdminSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [badges, setBadges] = useState({ messages: 0, reviews: 0 });

  const sidebarWidth = collapsed ? "w-[72px]" : "w-64";

  const fetchBadges = useCallback(async () => {
    try {
      const [messagesRes, reviewsRes] = await Promise.all([
        apiService.get("/admin/contact/enquiries", {
          params: { limit: 1, status: "New" },
        }),
        apiService.get("/admin/reviews", {
          params: { limit: 1, status: "Pending" },
        }),
      ]);
      setBadges({
        messages: messagesRes.data.counters?.new || 0,
        reviews: reviewsRes.data.counters?.pending || 0,
      });
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchBadges();
    const interval = setInterval(fetchBadges, 30000);

    function onFocus() {
      fetchBadges();
    }
    function onRefresh() {
      fetchBadges();
    }

    window.addEventListener("focus", onFocus);
    window.addEventListener("visibilitychange", onFocus);
    window.addEventListener("refresh-badges", onRefresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("visibilitychange", onFocus);
      window.removeEventListener("refresh-badges", onRefresh);
    };
  }, [fetchBadges]);

  const closeMobileMenu = useCallback(() => setMobileOpen(false), []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        if (logoutOpen) setLogoutOpen(false);
        else if (mobileOpen) setMobileOpen(false);
      }
    },
    [logoutOpen, mobileOpen],
  );

  useEffect(() => {
    if (mobileOpen || logoutOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen, logoutOpen, handleKeyDown]);

  useEffect(() => {
    function handleToggle() {
      setMobileOpen((v) => !v);
    }
    window.addEventListener("toggle-admin-sidebar", handleToggle);
    return () =>
      window.removeEventListener("toggle-admin-sidebar", handleToggle);
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("admin-sidebar-state", { detail: { open: mobileOpen } }),
    );
  }, [mobileOpen]);

  const doLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      localStorage.removeItem("adminProfile");
      setLogoutOpen(false);
      setMobileOpen(false);
      navigate("/admin/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  }, [navigate, logout]);

  const sidebar = (
    <div
      className={`${sidebarWidth} bg-background border-r border-border transition-[width] duration-200 ease-in-out flex flex-col h-full`}>
      {/* Navigation */}
      <nav
        className={`flex-1 ${collapsed ? "overflow-hidden px-2" : "overflow-y-auto px-3"} py-4 space-y-5`}
        aria-label="Admin navigation">
        {navSections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <div className="px-3 mb-2 text-[11px] font-semibold text-muted uppercase tracking-wider">
                {section.label}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavItem
                  key={item.to}
                  item={item}
                  collapsed={collapsed}
                  onClick={closeMobileMenu}
                  badges={badges}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className={`border-t border-border ${collapsed ? "p-2" : "p-3"}`}>
        {/* Collapse Toggle */}
        <button
          type="button"
          className="hidden md:flex w-full items-center justify-center gap-2 px-3 py-2 rounded-lg text-muted hover:text-heading hover:bg-surface transition-colors duration-150 cursor-pointer"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          <Icon>
            <CollapseIcon collapsed={collapsed} />
          </Icon>
          {!collapsed && <span className="text-xs font-medium">Collapse</span>}
        </button>

        {/* Logout */}
        <button
          type="button"
          className={`w-full flex items-center ${collapsed ? "justify-center px-2" : "gap-3 px-3"} py-2.5 rounded-lg text-sm font-medium text-text hover:bg-primary-light hover:text-primary transition-all duration-150 mt-1 cursor-pointer`}
          onClick={() => setLogoutOpen(true)}
          disabled={isLoggingOut}>
          <Icon>
            <LogoutIcon />
          </Icon>
          {!collapsed && (
            <span className="flex-1 text-left truncate">Logout</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block h-full">{sidebar}</div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 top-16 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200"
            onClick={closeMobileMenu}
          />
          <div className="absolute left-0 top-0 bottom-0 max-w-[85vw] transition-transform duration-200 ease-out">
            {sidebar}
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {logoutOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-dialog-title">
          <div className="bg-background rounded-lg shadow-2xl w-full max-w-sm p-6 transform transition-all duration-200 border border-border">
            <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center mx-auto">
              <Icon className="text-primary">
                <LogoutIcon />
              </Icon>
            </div>
            <div
              id="logout-dialog-title"
              className="mt-4 text-center font-bold text-heading">
              Confirm Logout
            </div>
            <div className="mt-2 text-center text-sm text-muted">
              You will be signed out of your admin session.
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                className="flex-1 px-4 py-2.5 rounded-lg border border-border hover:bg-surface text-sm font-medium transition-colors duration-150 cursor-pointer"
                onClick={() => setLogoutOpen(false)}
                disabled={isLoggingOut}>
                Cancel
              </button>
              <button
                type="button"
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-hover text-sm font-medium transition-colors duration-150 disabled:opacity-50 cursor-pointer"
                onClick={doLogout}
                disabled={isLoggingOut}>
                {isLoggingOut ? "Signing out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
