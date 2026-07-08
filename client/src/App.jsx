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
// Import the new legal pages
import TermsConditions from './components/public/TermsConditions.jsx'
import PrivacyPolicy from './components/public/PrivacyPolicy.jsx'

import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminRegister from './pages/admin/AdminRegister.jsx'
import ForgotPassword from './pages/admin/ForgotPassword.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminServices from './pages/admin/AdminServices.jsx'
import AdminProjects from './pages/admin/AdminProjects.jsx'
import AdminCaseStudies from './pages/admin/AdminCaseStudies.jsx'
import AdminTechnologies from './pages/admin/AdminTechnologies.jsx'
import AdminIndustries from './pages/admin/AdminIndustries.jsx'

import AdminTeam from './pages/admin/AdminTeam.jsx'
import AdminReviews from './pages/admin/AdminReviews.jsx'
import AdminMessages from './pages/admin/AdminMessages.jsx'
import AdminSettings from './pages/admin/AdminSettings.jsx'
import AdminSiteContent from './pages/admin/AdminSiteContent.jsx'
import NotFound from './pages/NotFound.jsx'

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
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="admin/register" element={<AdminRegister />} />
        <Route path="admin/forgot-password" element={<ForgotPassword />} />
        <Route path="admin" element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="case-studies" element={<AdminCaseStudies />} />
            <Route path="technologies" element={<AdminTechnologies />} />
            <Route path="industries" element={<AdminIndustries />} />

            <Route path="team" element={<AdminTeam />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="site-content" element={<AdminSiteContent />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}