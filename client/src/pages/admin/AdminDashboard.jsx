import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThLarge,
  faFolder,
  faEnvelope,
  faUsers,
  faPlus,
  faSyncAlt,
  faInbox,
} from "@fortawesome/free-solid-svg-icons";
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
  return <FontAwesomeIcon icon={faThLarge} className="w-5 h-5" />;
}

function ProjectsIcon() {
  return <FontAwesomeIcon icon={faFolder} className="w-5 h-5" />;
}

function EnquiriesIcon() {
  return <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5" />;
}

function TeamIcon() {
  return <FontAwesomeIcon icon={faUsers} className="w-5 h-5" />;
}

function PlusIcon() {
  return <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />;
}

function RefreshIcon() {
  return <FontAwesomeIcon icon={faSyncAlt} className="w-4 h-4" />;
}

function InboxIcon() {
  return <FontAwesomeIcon icon={faInbox} className="w-10 h-10 text-muted" />;
}

function FolderIcon() {
  return <FontAwesomeIcon icon={faFolder} className="w-10 h-10 text-muted" />;
}

function enquiryStatusChip(status) {
  const map = {
    New: "bg-info/10 text-info border-info/20",
    Pending: "bg-warning/10 text-warning border-warning/20",
    Replied: "bg-success/10 text-success border-success/20",
    Spam: "bg-primary-light text-primary border-primary/20",
  };
  return map[status] ?? "bg-surface text-text border-border";
}

function StatCard({ label, value, icon, color, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left bg-background border border-border rounded p-5 shadow-xs cursor-pointer hover:shadow-sm transition group">
      <div className="flex items-center justify-between">
        <span
          className={`w-10 h-10 rounded flex items-center justify-center ${color}`}>
          {icon}
        </span>
      </div>
      <div className="mt-3 text-3xl font-extrabold text-heading">{value}</div>
      <div className="mt-1 text-sm font-semibold text-muted">{label}</div>
    </button>
  );
}

function Panel({ title, children, rightLink }) {
  return (
    <div className="bg-background border border-border rounded p-5 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <div className="font-extrabold text-heading">{title}</div>
        {rightLink}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function SkeletonBlock({ className }) {
  return <div className={`animate-pulse bg-surface rounded-xl ${className}`} />;
}

function LoadingSkeleton() {
  return (
    <div>
      <div className="h-7 w-56 bg-surface rounded animate-pulse" />
      <div className="mt-2 h-4 w-72 bg-surface rounded animate-pulse" />

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-background border border-border rounded p-5 shadow-xs">
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
            className="bg-background border border-border rounded p-5 shadow-xs">
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

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [servicesResult, projectsResult, enquiriesResult, teamResult] =
        await Promise.all([
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
            new Date(b.updatedAt ?? b.createdAt).getTime() -
            new Date(a.updatedAt ?? a.createdAt).getTime(),
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
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actions = [
    {
      label: "Add New Project",
      to: "/admin/projects",
      icon: <PlusIcon />,
      color: "text-info bg-info/10",
    },
    {
      label: "Add New Service",
      to: "/admin/services",
      icon: <PlusIcon />,
      color: "text-info bg-info/10",
    },
    {
      label: "Add Team Member",
      to: "/admin/team",
      icon: <PlusIcon />,
      color: "text-primary bg-primary-light",
    },
    {
      label: "View Enquiries",
      to: "/admin/messages",
      icon: <EnquiriesIcon />,
      color: "text-success bg-success/10",
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
        <h2 className="text-xl font-extrabold text-heading">
          Dashboard Overview
        </h2>
        <div className="mt-6 bg-primary-light border border-primary/20 rounded p-5 text-center">
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
          <h2 className="flex items-center gap-4 text-xl font-extrabold text-heading">
            {greeting()}, {user?.name ?? "Admin"}
            <img src="/waving-hand.png" alt="waving-hand-icon" className="w-8 h-8 animate-wave" />
          </h2>
          <p className="mt-1 text-sm text-muted">
            {dateStr} — Here's what's happening today.
          </p>
        </div>
        <div className="relative group">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-text bg-background border border-border rounded hover:bg-surface transition disabled:opacity-50 cursor-pointer">
            <RefreshIcon />
          </button>
          <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 text-xs font-medium text-white bg-secondary rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
            Refresh data
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-secondary" />
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Services"
          value={stats.total_services}
          icon={<ServicesIcon />}
          color="bg-info/10 text-info"
          onClick={() => navigate("/admin/services")}
        />
        <StatCard
          label="Total Projects"
          value={stats.total_projects}
          icon={<ProjectsIcon />}
          color="bg-info/10 text-info"
          onClick={() => navigate("/admin/projects")}
        />
        <StatCard
          label="Total Enquiries"
          value={stats.total_enquiries}
          icon={<EnquiriesIcon />}
          color="bg-success/10 text-success"
          onClick={() => navigate("/admin/messages")}
        />
        <StatCard
          label="Team Members"
          value={stats.total_team_members}
          icon={<TeamIcon />}
          color="bg-primary-light text-primary"
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
              {recentEnquiries.slice(0, 3).map((e) => (
                <div
                  key={e.enquiry_id}
                  className="flex items-start gap-3 border border-border rounded p-3 hover:bg-surface transition">
                  <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-sm font-bold text-muted shrink-0">
                    {e.name?.charAt(0)?.toUpperCase() ?? "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-heading truncate">
                        {e.name}
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${enquiryStatusChip(e.status)}`}>
                        {e.status}
                      </span>
                    </div>
                    <div className="text-sm text-text truncate">
                      {e.service}
                    </div>
                    <div className="mt-1 text-xs text-muted">
                      {relativeTime(e.date)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <InboxIcon />
              <div className="mt-3 text-sm font-medium text-muted">
                No enquiries yet
              </div>
              <div className="mt-1 text-xs text-muted">
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
              {recentProjects.slice(0, 3).map((p) => (
                <div
                  key={p._id}
                  className="flex items-start gap-3 border border-border rounded p-3 hover:bg-surface transition">
                  <div className="w-9 h-9 rounded-xl bg-info/10 flex items-center justify-center shrink-0">
                    <FolderIcon />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-heading truncate">
                      {p.project_name}
                    </div>
                    <div className="text-sm text-text">{p.status}</div>
                    <div className="mt-1 text-xs text-muted">
                      {relativeTime(p.updatedAt ?? p.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FolderIcon />
              <div className="mt-3 text-sm font-medium text-muted">
                No projects yet
              </div>
              <div className="mt-1 text-xs text-muted">
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
                className="w-full flex items-center gap-3 bg-surface border border-border rounded p-3 hover:bg-primary-light hover:border-primary transition group cursor-pointer"
                onClick={() => navigate(a.to)}>
                <span
                  className={`w-9 h-9 rounded flex items-center justify-center shrink-0 ${a.color} group-hover:scale-110 transition`}>
                  {a.icon}
                </span>
                <span className="font-semibold text-heading">{a.label}</span>
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
