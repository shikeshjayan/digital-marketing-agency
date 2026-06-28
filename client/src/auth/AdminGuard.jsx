import { Navigate, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useAuthStore from '../store/authStore.js'

export default function AdminGuard() {
  const { user, fetchUser, loading } = useAuthStore()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function validate() {
      try {
        await fetchUser()
      } catch {
        // Invalid session
      } finally {
        setChecking(false)
      }
    }
    validate()
  }, [fetchUser])

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    )
  }

  if (!user) return <Navigate to="/admin/login" replace />
  return <Outlet />
}
