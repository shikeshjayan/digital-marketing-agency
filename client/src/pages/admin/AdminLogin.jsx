import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAdminProfile } from '../../auth/adminAuth.js'
import useAuthStore from '../../store/authStore.js'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login, loading, error: authError } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const isValid = useMemo(() => email.trim().length > 0 && password.trim().length > 0, [email, password])

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!isValid) {
      setError('Please enter email and password.')
      return
    }

    try {
      const userData = await login({ email, password })
      setAdminProfile({
        name: userData?.name || email.split('@')[0],
        email: userData?.email || email,
        photo: userData?.photo || "",
        role: userData?.role || 'Administrator',
      })
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed')
    }
  }

  return (
    <div className="py-10 max-w-md mx-auto">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-600 mx-auto text-white flex items-center justify-center font-bold">
          A
        </div>
        <h2 className="mt-4 text-xl font-bold text-gray-900">Admin Login</h2>
        <p className="mt-2 text-sm text-gray-600">Enter your admin credentials to sign in.</p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <label className="block text-sm font-medium text-gray-800">Email</label>
        <input
          type="email"
          className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-red-200"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <label className="block text-sm font-medium text-gray-800 mt-4">Password</label>
        <input
          type="password"
          className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-red-200"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {(error || authError) && <div className="mt-4 text-sm text-red-600">{error || authError}</div>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-red-600 text-white py-2.5 font-semibold hover:bg-orange-500 transition disabled:opacity-50"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}

