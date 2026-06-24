import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  adminGetDashboardStats,
  adminGetRecentEnquiries,
  adminGetRecentProjects,
} from '../../services/mockApi.js'

function StatCard({ label, value, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left bg-white border border-gray-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition"
    >
      <div className="text-sm font-semibold text-gray-500">{label}</div>
      <div className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900">{value}</div>
    </button>
  )
}

function Panel({ title, children, rightLink }) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="font-extrabold text-gray-900">{title}</div>
        {rightLink}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [recentEnquiries, setRecentEnquiries] = useState([])
  const [recentProjects, setRecentProjects] = useState([])

  useEffect(() => {
    Promise.all([
      adminGetDashboardStats(),
      adminGetRecentEnquiries({ limit: 5 }),
      adminGetRecentProjects({ limit: 5 }),
    ]).then(([s, e, p]) => {
      setStats(s.data ?? null)
      setRecentEnquiries(e.data ?? [])
      setRecentProjects(p.data ?? [])
    })
  }, [])

  const actions = [
    { label: 'Add New Project', to: '/admin/projects' },
    { label: 'Add New Service', to: '/admin/services' },
    { label: 'Add Team Member', to: '/admin/team' },
    { label: 'View Enquiries', to: '/admin/messages' },
  ]

  return (
    <div>
      <h2 className="text-xl font-extrabold text-gray-900">Dashboard Overview</h2>
      <p className="mt-2 text-sm text-gray-600">Summary metrics, recent enquiries/projects, and quick actions.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Services" value={stats?.total_services ?? 0} onClick={() => navigate('/admin/services')} />
        <StatCard label="Total Projects" value={stats?.total_projects ?? 0} onClick={() => navigate('/admin/projects')} />
        <StatCard label="Total Enquiries" value={stats?.total_enquiries ?? 0} onClick={() => navigate('/admin/messages')} />
        <StatCard label="Team Members" value={stats?.total_team_members ?? 0} onClick={() => navigate('/admin/team')} />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Panel
          title="Recent Enquiries"
          rightLink={
            <button
              type="button"
              className="text-sm font-semibold text-red-700 hover:text-orange-600"
              onClick={() => navigate('/admin/messages')}
            >
              View All
            </button>
          }
        >
          {recentEnquiries.length ? (
            <div className="space-y-3">
              {recentEnquiries.slice(0, 3).map((e) => (
                <div key={e.enquiry_id} className="border border-gray-100 rounded-2xl p-3">
                  <div className="font-bold text-gray-900">{e.name}</div>
                  <div className="text-sm text-gray-600">{e.service}</div>
                  <div className="mt-1 text-xs text-gray-500">{new Date(e.date).toLocaleString()}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-600">No enquiries yet.</div>
          )}
        </Panel>

        <Panel
          title="Recent Projects"
          rightLink={
            <button
              type="button"
              className="text-sm font-semibold text-red-700 hover:text-orange-600"
              onClick={() => navigate('/admin/projects')}
            >
              View All
            </button>
          }
        >
          {recentProjects.length ? (
            <div className="space-y-3">
              {recentProjects.slice(0, 3).map((p) => (
                <div key={p.project_id} className="border border-gray-100 rounded-2xl p-3">
                  <div className="font-bold text-gray-900">{p.project_name}</div>
                  <div className="text-sm text-gray-600">{p.category}</div>
                  <div className="mt-1 text-xs text-gray-500">
                    {new Date(p.updated_at ?? p.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-600">No projects yet.</div>
          )}
        </Panel>

        <Panel title="Quick Actions">
          <div className="space-y-3">
            {actions.map((a) => (
              <button
                key={a.to}
                type="button"
                className="w-full text-left bg-gray-50 border border-gray-200 rounded-2xl p-3 hover:bg-red-50 transition"
                onClick={() => navigate(a.to)}
              >
                <div className="font-semibold text-gray-900">{a.label}</div>
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}

