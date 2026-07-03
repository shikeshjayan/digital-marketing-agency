import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { setAdminProfile } from '../../auth/adminAuth.js'
import useAuthStore from '../../store/authStore.js'
import apiService from '../../services/apiService.js'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login, loading, error: authError } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [adminExists, setAdminExists] = useState(null)

  useEffect(() => {
    apiService.get('/admin/check')
      .then((res) => {
        setAdminExists(res.data?.data?.exists ?? true)
      })
      .catch((err) => {
        console.error('Failed to check admin:', err)
        setAdminExists(true)
      })
  }, [])

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
      toast.success("Login successful!")
      navigate('/admin', { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed'
      setError(msg)
      toast.error(msg)
    }
  }

  return (
    <div className="py-10 max-w-md mx-auto">
      <div className="text-center">
        <div className="w-14 h-14 rounded-lg bg-red-600 mx-auto text-white flex items-center justify-center font-bold">
          A
        </div>
        <h2 className="mt-4 text-xl font-bold text-gray-900">Admin Login</h2>
        <p className="mt-2 text-sm text-gray-600">Enter your admin credentials to sign in.</p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 bg-white border border-gray-200 rounded p-5 shadow-xs">
        <label className="block text-sm font-medium text-gray-800">Email</label>
        <input
          type="email"
          className="mt-2 w-full rounded border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-red-200"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
        />

        <label className="block text-sm font-medium text-gray-800 mt-4">Password</label>
        <input
          type="password"
          className="mt-2 w-full rounded border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-red-200"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
        />

        <div className="mt-2 text-right">
          <Link to="/admin/forgot-password" className="text-sm text-red-600 hover:underline">
            Forgot Password?
          </Link>
        </div>

        {(error || authError) && <div className="mt-4 text-sm text-red-600">{error || authError}</div>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded bg-primary text-white py-2.5 font-semibold hover:bg-primary-hover transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      {!adminExists && (
        <div className="mt-4 text-center">
          <Link to="/admin/register" className="text-sm text-gray-600 hover:text-red-600 hover:underline">
            Don't have an account? Register
          </Link>
        </div>
      )}
    </div>
  )
}
