// Main router — defines all public and admin page URLs
import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import AdminGuard from './auth/AdminGuard.jsx'

// Public pages load immediately (main website)
import Home from './pages/public/Home.jsx'
import About from './pages/public/About.jsx'
import Services from './pages/public/Services.jsx'
import ServiceDetail from './pages/public/ServiceDetail.jsx'
import Projects from './pages/public/Projects.jsx'
import Courses from './pages/public/Courses.jsx'
import CourseDetail from './pages/public/CourseDetail.jsx'
import Team from './pages/public/Team.jsx'
import Testimonials from './pages/public/Testimonials.jsx'
import Contact from './pages/public/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

// Admin pages load on demand to keep the first visit fast
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.jsx'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'))
const AdminServices = lazy(() => import('./pages/admin/AdminServices.jsx'))
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects.jsx'))
const AdminCourses = lazy(() => import('./pages/admin/AdminCourses.jsx'))
const AdminTeam = lazy(() => import('./pages/admin/AdminTeam.jsx'))
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews.jsx'))
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages.jsx'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings.jsx'))

function AdminFallback() {
  return <div className="p-8 text-gray-500">Loading admin...</div>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public website — navbar + footer wrap every page */}
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:id" element={<ServiceDetail />} />
          <Route path="projects" element={<Projects />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:slug" element={<CourseDetail />} />
          <Route path="team" element={<Team />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin login — no guard needed */}
        <Route
          path="admin/login"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminLogin />
            </Suspense>
          }
        />

        {/* Protected admin area — AdminGuard checks login token first */}
        <Route path="admin" element={<AdminGuard />}>
          <Route
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminLayout />
              </Suspense>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="team" element={<AdminTeam />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
