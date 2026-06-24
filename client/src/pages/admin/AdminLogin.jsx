// Admin login page
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAdminToken } from '../../auth/adminAuth.js'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('admin_sensations')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState(null)

  const isValid = useMemo(() => username.trim().length > 0 && password.trim().length > 0, [username, password])

  function onSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!isValid) {
      setError('Please enter username and password.')
      return
    }

    // Frontend-only demo auth: accept any non-empty credentials.
    setAdminToken('demo-admin-token')
    navigate('/admin', { replace: true })
  }

  return (
    <div className="py-10 max-w-md mx-auto">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-600 mx-auto text-white flex items-center justify-center font-bold">
          A
        </div>
        <h2 className="mt-4 text-xl font-bold text-gray-900">Admin Login</h2>
        <p className="mt-2 text-sm text-gray-600">Use demo credentials or any non-empty values.</p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <label className="block text-sm font-medium text-gray-800">Username</label>
        <input
          className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-red-200"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />

        <label className="block text-sm font-medium text-gray-800 mt-4">Password</label>
        <input
          type="password"
          className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-red-200"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-red-600 text-white py-2.5 font-semibold hover:bg-orange-500 transition"
        >
          Sign In
        </button>
      </form>
    </div>
  )
}

