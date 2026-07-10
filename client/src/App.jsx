import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ScrollToTop from './components/ui/ScrollToTop.jsx'
import PublicLayout from './layouts/PublicLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import AdminGuard from './auth/AdminGuard.jsx'

import Home from './pages/public/Home.jsx'
import About from './pages/public/About.jsx'
import Services from './pages/public/Services.jsx'
import ServiceDetail from './pages/public/ServiceDetail.jsx'
import Projects from './pages/public/Projects.jsx'
import ProjectDetail from './pages/public/ProjectDetail.jsx'
import CaseStudyDetail from './pages/public/CaseStudyDetail.jsx'

import Team from './pages/public/Team.jsx'
import Testimonials from './pages/public/Testimonials.jsx'
import Contact from './pages/public/Contact.jsx'
import TermsConditions from './components/public/TermsConditions.jsx'
import PrivacyPolicy from './components/public/PrivacyPolicy.jsx'
import NotFound from './pages/NotFound.jsx'

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.jsx'))
const AdminRegister = lazy(() => import('./pages/admin/AdminRegister.jsx'))
const ForgotPassword = lazy(() => import('./pages/admin/ForgotPassword.jsx'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'))
const AdminServices = lazy(() => import('./pages/admin/AdminServices.jsx'))
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects.jsx'))
const AdminCaseStudies = lazy(() => import('./pages/admin/AdminCaseStudies.jsx'))
const AdminTechnologies = lazy(() => import('./pages/admin/AdminTechnologies.jsx'))
const AdminIndustries = lazy(() => import('./pages/admin/AdminIndustries.jsx'))
const AdminTeam = lazy(() => import('./pages/admin/AdminTeam.jsx'))
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews.jsx'))
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages.jsx'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings.jsx'))
const AdminSiteContent = lazy(() => import('./pages/admin/AdminSiteContent.jsx'))
const AdminBrandSettings = lazy(() => import('./pages/admin/AdminBrandSettings.jsx'))

const AuthSuspense = ({ children }) => (
  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>}>
    {children}
  </Suspense>
)

const AdminSuspense = ({ children }) => (
  <Suspense fallback={<div className="flex items-center justify-center min-h-[calc(100vh-4rem)]"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>}>
    {children}
  </Suspense>
)

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<ServiceDetail />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectDetail />} />
          <Route path="case-studies/:slug" element={<CaseStudyDetail />} />

          <Route path="team" element={<Team />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="contact" element={<Contact />} />
          {/* Registered Legal Link Routes */}
          <Route path="terms" element={<TermsConditions />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
        </Route>

        {/* Admin */}
        <Route path="admin/login" element={<AuthSuspense><AdminLogin /></AuthSuspense>} />
        <Route path="admin/register" element={<AuthSuspense><AdminRegister /></AuthSuspense>} />
        <Route path="admin/forgot-password" element={<AuthSuspense><ForgotPassword /></AuthSuspense>} />
        <Route path="admin" element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminSuspense><AdminDashboard /></AdminSuspense>} />
            <Route path="services" element={<AdminSuspense><AdminServices /></AdminSuspense>} />
            <Route path="projects" element={<AdminSuspense><AdminProjects /></AdminSuspense>} />
            <Route path="case-studies" element={<AdminSuspense><AdminCaseStudies /></AdminSuspense>} />
            <Route path="technologies" element={<AdminSuspense><AdminTechnologies /></AdminSuspense>} />
            <Route path="industries" element={<AdminSuspense><AdminIndustries /></AdminSuspense>} />
            <Route path="team" element={<AdminSuspense><AdminTeam /></AdminSuspense>} />
            <Route path="reviews" element={<AdminSuspense><AdminReviews /></AdminSuspense>} />
            <Route path="messages" element={<AdminSuspense><AdminMessages /></AdminSuspense>} />
            <Route path="settings" element={<AdminSuspense><AdminSettings /></AdminSuspense>} />
            <Route path="site-content" element={<AdminSuspense><AdminSiteContent /></AdminSuspense>} />
            <Route path="brand-settings" element={<AdminSuspense><AdminBrandSettings /></AdminSuspense>} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}