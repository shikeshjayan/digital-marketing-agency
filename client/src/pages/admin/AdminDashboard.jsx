import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import useServiceStore from "../../store/serviceStore";
import useProjectStore from "../../store/projectStore";
import useContactStore from "../../store/contactStore";
import useTeamStore from "../../store/teamStore";
import { relativeTime } from "../../utils/time";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function ServicesIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function ProjectsIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function EnquiriesIcon() {
  return (
    <svg
      className="w-5 h-5"
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
}

function TeamIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg
      className="w-10 h-10 text-gray-300"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      className="w-10 h-10 text-gray-300"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function enquiryStatusChip(status) {
  const map = {
    New: "bg-blue-50 text-blue-700 border-blue-100",
    Pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
    Replied: "bg-green-50 text-green-700 border-green-100",
    Spam: "bg-red-50 text-red-700 border-red-100",
  };
  return map[status] ?? "bg-gray-50 text-gray-600 border-gray-100";
}

function StatCard({ label, value, icon, color, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left bg-white border border-gray-200 rounded p-5 shadow-xs cursor-pointer hover:shadow-sm transition group">
      <div className="flex items-center justify-between">
        <span
          className={`w-10 h-10 rounded flex items-center justify-center ${color}`}>
          {icon}
        </span>
      </div>
      <div className="mt-3 text-3xl font-extrabold text-gray-900">{value}</div>
      <div className="mt-1 text-sm font-semibold text-gray-500">{label}</div>
    </button>
  );
}

function Panel({ title, children, rightLink }) {
  return (
    <div className="bg-white border border-gray-200 rounded p-5 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <div className="font-extrabold text-gray-900">{title}</div>
        {rightLink}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function SkeletonBlock({ className }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
  );
}

function LoadingSkeleton() {
  return (
    <div>
      <div className="h-7 w-56 bg-gray-200 rounded animate-pulse" />
      <div className="mt-2 h-4 w-72 bg-gray-100 rounded animate-pulse" />

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded p-5 shadow-xs">
            <div className="flex justify-between">
              <SkeletonBlock className="h-10 w-10 rounded" />
              <SkeletonBlock className="h-4 w-12" />
            </div>
            <SkeletonBlock className="h-8 w-16 mt-4" />
            <SkeletonBlock className="h-4 w-24 mt-2" />
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded p-5 shadow-xs">
            <SkeletonBlock className="h-5 w-32" />
            <div className="mt-4 space-y-3">
              {[...Array(3)].map((_, j) => (
                <SkeletonBlock key={j} className="h-16 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = useAuthStore((s) => s.user);
  const fetchAdminServices = useServiceStore((s) => s.fetchAdminServices);
  const fetchAdminProjects = useProjectStore((s) => s.fetchAdminProjects);
  const fetchAdminEnquiries = useContactStore((s) => s.fetchAdminEnquiries);
  const fetchAdminTeam = useTeamStore((s) => s.fetchAdminTeam);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [servicesResult, projectsResult, enquiriesResult, teamResult] = await Promise.all([
        fetchAdminServices(),
        fetchAdminProjects(),
        fetchAdminEnquiries(),
        fetchAdminTeam(),
      ]);

      const services = servicesResult?.items ?? [];
      const projects = projectsResult?.items ?? [];
      const enquiries = enquiriesResult.enquiries ?? [];
      const team = teamResult?.items ?? [];

      setStats({
        total_services: services.length,
        total_projects: projects.length,
        total_enquiries: enquiries.length,
        total_team_members: team.length,
      });

      setRecentEnquiries(
        [...enquiries].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
      );
      setRecentProjects(
        [...projects].sort(
          (a, b) =>
            new Date(b.updated_at ?? b.created_at).getTime() -
            new Date(a.updated_at ?? a.created_at).getTime(),
        ),
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load dashboard",
      );
    } finally {
      setLoading(false);
    }
  }, [
    fetchAdminServices,
    fetchAdminProjects,
    fetchAdminEnquiries,
    fetchAdminTeam,
  ]);

  useEffect(() => {
    load();
  }, [load]);

  const actions = [
    {
      label: "Add New Project",
      to: "/admin/projects",
      icon: <PlusIcon />,
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: "Add New Service",
      to: "/admin/services",
      icon: <PlusIcon />,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Add Team Member",
      to: "/admin/team",
      icon: <PlusIcon />,
      color: "text-primary bg-red-50",
    },
    {
      label: "View Enquiries",
      to: "/admin/messages",
      icon: <EnquiriesIcon />,
      color: "text-green-600 bg-green-50",
    },
  ];

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div>
        <h2 className="text-xl font-extrabold text-gray-900">
          Dashboard Overview
        </h2>
        <div className="mt-6 bg-red-50 border border-red-200 rounded p-5 text-center">
          <div className="text-sm text-primary">{error}</div>
          <button
            type="button"
            className="mt-3 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition cursor-pointer"
            onClick={load}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            {greeting()}, {user?.name ?? "Admin"} 👋
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {dateStr} — Here's what's happening today.
          </p>
        </div>
        <div className="relative group">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50 transition disabled:opacity-50 cursor-pointer">
            <RefreshIcon />
          </button>
          <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 text-xs font-medium text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
            Refresh data
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900" />
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Services"
          value={stats.total_services}
          icon={<ServicesIcon />}
          color="bg-blue-50 text-blue-600"
          onClick={() => navigate("/admin/services")}
        />
        <StatCard
          label="Total Projects"
          value={stats.total_projects}
          icon={<ProjectsIcon />}
          color="bg-purple-50 text-purple-600"
          onClick={() => navigate("/admin/projects")}
        />
        <StatCard
          label="Total Enquiries"
          value={stats.total_enquiries}
          icon={<EnquiriesIcon />}
          color="bg-green-50 text-green-600"
          onClick={() => navigate("/admin/messages")}
        />
        <StatCard
          label="Team Members"
          value={stats.total_team_members}
          icon={<TeamIcon />}
          color="bg-red-50 text-primary"
          onClick={() => navigate("/admin/team")}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Panel
          title="Recent Enquiries"
          rightLink={
            <button
              type="button"
              className="text-sm font-semibold text-primary hover:text-primary-hover cursor-pointer"
              onClick={() => navigate("/admin/messages")}>
              View All
            </button>
          }>
          {recentEnquiries.length ? (
            <div className="space-y-3">
              {recentEnquiries.slice(0, 5).map((e) => (
                <div
                  key={e.enquiry_id}
                  className="flex items-start gap-3 border border-gray-100 rounded p-3 hover:bg-gray-50 transition">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 shrink-0">
                    {e.name?.charAt(0)?.toUpperCase() ?? "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-gray-900 truncate">
                        {e.name}
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${enquiryStatusChip(e.status)}`}>
                        {e.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {e.service}
                    </div>
                    <div className="mt-1 text-xs text-gray-400">
                      {relativeTime(e.date)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <InboxIcon />
              <div className="mt-3 text-sm font-medium text-gray-500">
                No enquiries yet
              </div>
              <div className="mt-1 text-xs text-gray-400">
                Enquiries will appear here when customers reach out
              </div>
            </div>
          )}
        </Panel>

        <Panel
          title="Recent Projects"
          rightLink={
            <button
              type="button"
              className="text-sm font-semibold text-primary hover:text-primary-hover cursor-pointer"
              onClick={() => navigate("/admin/projects")}>
              View All
            </button>
          }>
          {recentProjects.length ? (
            <div className="space-y-3">
              {recentProjects.slice(0, 5).map((p) => (
                <div
                  key={p._id}
                  className="flex items-start gap-3 border border-gray-100 rounded p-3 hover:bg-gray-50 transition">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                    <FolderIcon />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-gray-900 truncate">
                      {p.project_name}
                    </div>
                    <div className="text-sm text-gray-600">{p.category}</div>
                    <div className="mt-1 text-xs text-gray-400">
                      {relativeTime(p.updated_at ?? p.created_at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FolderIcon />
              <div className="mt-3 text-sm font-medium text-gray-500">
                No projects yet
              </div>
              <div className="mt-1 text-xs text-gray-400">
                Projects will appear here once you create them
              </div>
            </div>
          )}
        </Panel>

        <Panel title="Quick Actions">
          <div className="space-y-3">
            {actions.map((a) => (
              <button
                key={a.to}
                type="button"
                className="w-full flex items-center gap-3 bg-gray-50 border border-gray-200 rounded p-3 hover:bg-primary-light hover:border-primary transition group cursor-pointer"
                onClick={() => navigate(a.to)}>
                <span
                  className={`w-9 h-9 rounded flex items-center justify-center shrink-0 ${a.color} group-hover:scale-110 transition`}>
                  {a.icon}
                </span>
                <span className="font-semibold text-gray-900">{a.label}</span>
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
