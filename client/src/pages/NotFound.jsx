// 404 page — shown when URL does not match any route
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-4xl font-bold text-gray-900">404</div>
        <div className="mt-3 text-gray-600">Page not found.</div>
        <Link to="/" className="mt-6 inline-flex px-4 py-2 rounded-full bg-red-600 text-white hover:bg-orange-500 transition">
          Go to Home
        </Link>
      </div>
    </div>
  )
}

