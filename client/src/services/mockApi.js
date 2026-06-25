import { seed } from '../data/seedData.js'
import { getAdminToken } from '../auth/adminAuth.js'

const LS_KEYS = {
  services: 'mock_services',
  projects: 'mock_projects',
  courses: 'mock_courses',
  team: 'mock_team',
  reviews: 'mock_reviews',
  enquiries: 'mock_enquiries',
  adminSettings: 'mock_admin_settings',
  servicesSeedVersion: 'mock_services_seed_version',
}

const SERVICES_SEED_VERSION = '2'

function safeParse(json, fallback) {
  try {
    return JSON.parse(json) ?? fallback
  } catch {
    return fallback
  }
}

function readList(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = safeParse(raw, fallback)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

function writeList(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list))
  } catch {
    // ignore
  }
}

function ensureSeeded() {
  // Seed only once per browser storage space.
  // If any list is missing, we re-seed that list from seedData.
  const storedServicesVersion = localStorage.getItem(LS_KEYS.servicesSeedVersion)
  if (!localStorage.getItem(LS_KEYS.services) || storedServicesVersion !== SERVICES_SEED_VERSION) {
    writeList(LS_KEYS.services, seed.services)
    localStorage.setItem(LS_KEYS.servicesSeedVersion, SERVICES_SEED_VERSION)
  }
  if (!localStorage.getItem(LS_KEYS.projects)) writeList(LS_KEYS.projects, seed.projects)
  if (!localStorage.getItem(LS_KEYS.courses)) writeList(LS_KEYS.courses, seed.courses)
  if (!localStorage.getItem(LS_KEYS.team)) writeList(LS_KEYS.team, seed.team)
  if (!localStorage.getItem(LS_KEYS.reviews)) writeList(LS_KEYS.reviews, seed.reviews)
  if (!localStorage.getItem(LS_KEYS.enquiries)) writeList(LS_KEYS.enquiries, seed.enquiries)
  if (!localStorage.getItem(LS_KEYS.adminSettings)) {
    try {
      localStorage.setItem(LS_KEYS.adminSettings, JSON.stringify(seed.adminSettings))
    } catch {
      // ignore
    }
  }
}

function getAdminOrThrow() {
  const token = getAdminToken()
  if (!token) throw new Error('Unauthorized')
  ensureSeeded()
  return token
}

function filterSearch(list, query, key) {
  if (!query) return list
  const q = String(query).toLowerCase()
  return list.filter((x) => String(x[key] ?? '').toLowerCase().includes(q))
}

function paginate(list, page = 1, limit = 10) {
  const p = Math.max(1, Number(page) || 1)
  const l = Math.max(1, Number(limit) || 10)
  const start = (p - 1) * l
  const end = start + l
  return { items: list.slice(start, end), count: list.length }
}

function toSuccess(data, extra = {}) {
  return { success: true, ...extra, data }
}

function toListResponse(items, count, extra = {}) {
  return { success: true, count, ...extra, data: items }
}

function normalizeImage(image) {
  // Keep as-is; placeholder tokens can be swapped for real URLs later.
  return image ?? ''
}

// ---------------------------
// Public endpoints
// ---------------------------

export async function publicGetServices({ search, page = 1, limit = 10 } = {}) {
  ensureSeeded()
  const services = readList(LS_KEYS.services, seed.services).filter((s) => s.status === 'Active')
  const filtered = filterSearch(services, search, 'service_name')
  const { items, count } = paginate(filtered, page, limit)
  return toListResponse(items, count)
}

export async function publicGetServiceById(id) {
  ensureSeeded()
  const services = readList(LS_KEYS.services, seed.services)
  const found = services.find((s) => s.service_id === Number(id))
  if (!found) return { success: false, error: { message: 'Service Not Found' } }
  return toSuccess(found)
}

export async function publicGetProjects({ category, page = 1, limit = 10 } = {}) {
  ensureSeeded()
  const projects = readList(LS_KEYS.projects, seed.projects).filter((p) => p.status === 'Active')
  const filtered = category ? projects.filter((p) => p.category === category) : projects
  const { items, count } = paginate(filtered, page, limit)
  return toListResponse(items, count)
}

export async function publicGetProjectsByCategory(type) {
  ensureSeeded()
  const projects = readList(LS_KEYS.projects, seed.projects)
    .filter((p) => p.status === 'Active' && p.category === type)
  return toListResponse(projects, projects.length)
}

export async function publicGetCourses() {
  ensureSeeded()
  const courses = readList(LS_KEYS.courses, seed.courses).filter((c) => c.status === 'Active')
  return toListResponse(courses, courses.length)
}

export async function publicGetTeam() {
  ensureSeeded()
  const team = readList(LS_KEYS.team, seed.team).filter((m) => m.status === 'Active')
  return toListResponse(team, team.length)
}

export async function publicGetApprovedReviews() {
  ensureSeeded()
  const reviews = readList(LS_KEYS.reviews, seed.reviews).filter((r) => r.status === 'Approved')
  // Sort newest-first for slider
  reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return toListResponse(reviews, reviews.length)
}

export async function publicSubmitContactEnquiry({ name, email, service, message, phone } = {}) {
  ensureSeeded()
  if (!name || !email || !service || !message) {
    return { success: false, error: { message: 'Missing fields or invalid email schema' } }
  }
  const enquiries = readList(LS_KEYS.enquiries, seed.enquiries)
  const nextId = Math.max(0, ...enquiries.map((e) => e.enquiry_id)) + 1
  const entry = {
    enquiry_id: nextId,
    name,
    email,
    service,
    message,
    phone: phone ?? '',
    status: 'New',
    date: new Date().toISOString(),
  }
  const next = [entry, ...enquiries]
  writeList(LS_KEYS.enquiries, next)
  return toSuccess({ enquiry_id: nextId }, { message: 'Your message has been submitted successfully.' })
}

export async function publicSubmitReview({ name, location, rating, review_text } = {}) {
  ensureSeeded()
  const numericRating = Number(rating)
  if (!name || !location || !numericRating || numericRating < 1 || numericRating > 5 || !review_text) {
    return { success: false, error: { message: 'Validation failed: missing fields, invalid rating scale' } }
  }
  const reviews = readList(LS_KEYS.reviews, seed.reviews)
  const nextId = Math.max(0, ...reviews.map((r) => r.review_id)) + 1
  const entry = {
    review_id: nextId,
    user_avatar: '',
    name,
    location,
    rating: numericRating,
    review_text,
    status: 'Pending',
    date: new Date().toISOString(),
  }
  const next = [entry, ...reviews]
  writeList(LS_KEYS.reviews, next)
  return toSuccess({ review_id: nextId }, { message: 'Thank you! Your review has been submitted successfully.' })
}

// ---------------------------
// Admin endpoints
// ---------------------------

export async function adminGetDashboardStats() {
  getAdminOrThrow()
  const services = readList(LS_KEYS.services, seed.services)
  const projects = readList(LS_KEYS.projects, seed.projects)
  const enquiries = readList(LS_KEYS.enquiries, seed.enquiries)
  const team = readList(LS_KEYS.team, seed.team)

  return toSuccess({
    total_services: services.length,
    total_projects: projects.length,
    total_enquiries: enquiries.length,
    total_team_members: team.length,
  })
}

export async function adminGetRecentEnquiries({ limit = 5 } = {}) {
  getAdminOrThrow()
  const enquiries = readList(LS_KEYS.enquiries, seed.enquiries)
  enquiries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return toListResponse(enquiries.slice(0, limit), Math.min(limit, enquiries.length))
}

export async function adminGetRecentProjects({ limit = 5 } = {}) {
  getAdminOrThrow()
  const projects = readList(LS_KEYS.projects, seed.projects)
  projects.sort((a, b) => new Date(b.updated_at ?? b.created_at).getTime() - new Date(a.updated_at ?? a.created_at).getTime())
  return toListResponse(projects.slice(0, limit), Math.min(limit, projects.length))
}

export async function adminGetQuickActions() {
  getAdminOrThrow()
  return toSuccess([{ action: 'Add Project' }, { action: 'Add Service' }, { action: 'Add Team Member' }, { action: 'View Enquiries' }])
}

export async function adminGetServices({ search, status, page = 1, limit = 10 } = {}) {
  getAdminOrThrow()
  const services = readList(LS_KEYS.services, seed.services)
  const filteredStatus = status ? services.filter((s) => s.status === status) : services
  const filtered = filterSearch(filteredStatus, search, 'service_name')
  const { items, count } = paginate(filtered, page, limit)
  return toListResponse(items, count)
}

export async function adminCreateService({ service_name, short_description, description, image, status } = {}) {
  getAdminOrThrow()
  if (!service_name || !short_description || !description) {
    return { success: false, error: { message: 'Missing Required Fields' } }
  }
  const services = readList(LS_KEYS.services, seed.services)
  if (services.some((s) => String(s.service_name).toLowerCase() === String(service_name).toLowerCase())) {
    return { success: false, error: { message: 'Service Already Exists' } }
  }
  const nextId = Math.max(0, ...services.map((s) => s.service_id)) + 1
  const next = [
    {
      service_id: nextId,
      service_name,
      short_description,
      description,
      image: normalizeImage(image),
      status: status || 'Active',
    },
    ...services,
  ]
  writeList(LS_KEYS.services, next)
  return toSuccess({ service_id: nextId, service_name }, { message: 'Service created successfully' })
}

export async function adminUpdateService(id, { service_name, short_description, description, image, status } = {}) {
  getAdminOrThrow()
  const services = readList(LS_KEYS.services, seed.services)
  const idx = services.findIndex((s) => s.service_id === Number(id))
  if (idx === -1) return { success: false, error: { message: 'Service Not Found' } }
  const updated = {
    ...services[idx],
    service_name: service_name ?? services[idx].service_name,
    short_description: short_description ?? services[idx].short_description,
    description: description ?? services[idx].description,
    image: image ?? services[idx].image,
    status: status ?? services[idx].status,
  }
  const next = [...services]
  next[idx] = updated
  writeList(LS_KEYS.services, next)
  return toSuccess({ service_id: updated.service_id }, { message: 'Service updated successfully' })
}

export async function adminDeleteService(id) {
  getAdminOrThrow()
  const services = readList(LS_KEYS.services, seed.services)
  const next = services.filter((s) => s.service_id !== Number(id))
  writeList(LS_KEYS.services, next)
  return toSuccess({ message: 'Service deleted successfully' })
}

export async function adminGetProjects({ search, category, status, page = 1, limit = 10 } = {}) {
  getAdminOrThrow()
  const projects = readList(LS_KEYS.projects, seed.projects)
  let filtered = projects
  if (status) filtered = filtered.filter((p) => p.status === status)
  if (category) filtered = filtered.filter((p) => p.category === category)
  filtered = filterSearch(filtered, search, 'project_name')
  const { items, count } = paginate(filtered, page, limit)
  return toListResponse(items, count)
}

export async function adminCreateProject({ project_name, category, short_description, image, live_url, status } = {}) {
  getAdminOrThrow()
  if (!project_name || !category || !short_description || !live_url) {
    return { success: false, error: { message: 'Missing Required Fields' } }
  }
  const projects = readList(LS_KEYS.projects, seed.projects)
  if (projects.some((p) => String(p.project_name).toLowerCase() === String(project_name).toLowerCase())) {
    return { success: false, error: { message: 'Project Already Exists' } }
  }
  const nextId = Math.max(0, ...projects.map((p) => p.project_id)) + 1
  const entry = {
    project_id: nextId,
    project_name,
    category,
    short_description,
    image: normalizeImage(image),
    live_url,
    status: status || 'Active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  writeList(LS_KEYS.projects, [entry, ...projects])
  return toSuccess({ project_id: nextId, project_name }, { message: 'Project created successfully' })
}

export async function adminUpdateProject(id, { project_name, category, short_description, image, live_url, status } = {}) {
  getAdminOrThrow()
  const projects = readList(LS_KEYS.projects, seed.projects)
  const idx = projects.findIndex((p) => p.project_id === Number(id))
  if (idx === -1) return { success: false, error: { message: 'Project Not Found' } }
  const updated = {
    ...projects[idx],
    project_name: project_name ?? projects[idx].project_name,
    category: category ?? projects[idx].category,
    short_description: short_description ?? projects[idx].short_description,
    image: image ?? projects[idx].image,
    live_url: live_url ?? projects[idx].live_url,
    status: status ?? projects[idx].status,
    updated_at: new Date().toISOString(),
  }
  const next = [...projects]
  next[idx] = updated
  writeList(LS_KEYS.projects, next)
  return toSuccess({ project_id: updated.project_id }, { message: 'Project updated successfully' })
}

export async function adminDeleteProject(id) {
  getAdminOrThrow()
  const projects = readList(LS_KEYS.projects, seed.projects)
  writeList(LS_KEYS.projects, projects.filter((p) => p.project_id !== Number(id)))
  return toSuccess({ message: 'Project deleted successfully' })
}

export async function adminGetCourses({ search, status, page = 1, limit = 10 } = {}) {
  getAdminOrThrow()
  const courses = readList(LS_KEYS.courses, seed.courses)
  let filtered = courses
  if (status) filtered = filtered.filter((c) => c.status === status)
  filtered = filterSearch(filtered, search, 'course_name')
  const { items, count } = paginate(filtered, page, limit)
  return toListResponse(items, count)
}

export async function adminCreateCourse({ course_name, description, status } = {}) {
  getAdminOrThrow()
  if (!course_name || !description) return { success: false, error: { message: 'Missing required fields' } }
  const courses = readList(LS_KEYS.courses, seed.courses)
  if (courses.some((c) => String(c.course_name).toLowerCase() === String(course_name).toLowerCase())) {
    return { success: false, error: { message: 'Course name already exists' } }
  }
  const nextId = Math.max(0, ...courses.map((c) => c.course_id)) + 1
  const entry = {
    course_id: nextId,
    course_name,
    description,
    status: status || 'Active',
    category: 'Marketing',
    created_at: new Date().toISOString(),
  }
  writeList(LS_KEYS.courses, [entry, ...courses])
  return toSuccess({ course_id: nextId, course_name }, { message: 'Course created successfully.' })
}

export async function adminUpdateCourse(course_id, { course_name, status, description } = {}) {
  getAdminOrThrow()
  const courses = readList(LS_KEYS.courses, seed.courses)
  const idx = courses.findIndex((c) => c.course_id === Number(course_id))
  if (idx === -1) return { success: false, error: { message: 'Course record not found' } }
  const updated = {
    ...courses[idx],
    course_name: course_name ?? courses[idx].course_name,
    status: status ?? courses[idx].status,
    description: description ?? courses[idx].description,
  }
  const next = [...courses]
  next[idx] = updated
  writeList(LS_KEYS.courses, next)
  return toSuccess({ course_id: updated.course_id, course_name: updated.course_name }, { message: 'Course updated successfully.' })
}

export async function adminDeleteCourse(course_id) {
  getAdminOrThrow()
  const courses = readList(LS_KEYS.courses, seed.courses)
  writeList(LS_KEYS.courses, courses.filter((c) => c.course_id !== Number(course_id)))
  return toSuccess({ message: 'Course deleted successfully' })
}

export async function adminGetTeam({ search, status, page = 1, limit = 10 } = {}) {
  getAdminOrThrow()
  let team = readList(LS_KEYS.team, seed.team)
  if (status) team = team.filter((m) => m.status === status)
  team = filterSearch(team, search, 'name')
  const { items, count } = paginate(team, page, limit)
  return toListResponse(items, count)
}

export async function adminCreateTeamMember({ photo, name, designation, display_order, status } = {}) {
  getAdminOrThrow()
  if (!name || !designation) return { success: false, error: { message: 'Missing fields or invalid image type' } }
  const team = readList(LS_KEYS.team, seed.team)
  const nextId = Math.max(0, ...team.map((m) => m.member_id)) + 1
  const entry = {
    member_id: nextId,
    photo: normalizeImage(photo),
    name,
    designation,
    display_order: Number(display_order) || nextId,
    status: status || 'Active',
  }
  writeList(LS_KEYS.team, [entry, ...team])
  return toSuccess({ member_id: nextId, name }, { message: 'Team member profile added successfully.' })
}

export async function adminUpdateTeamMember(member_id, { photo, name, designation, display_order, status } = {}) {
  getAdminOrThrow()
  const team = readList(LS_KEYS.team, seed.team)
  const idx = team.findIndex((m) => m.member_id === Number(member_id))
  if (idx === -1) return { success: false, error: { message: 'Target Member Profile Not Found' } }
  const updated = {
    ...team[idx],
    photo: photo ?? team[idx].photo,
    name: name ?? team[idx].name,
    designation: designation ?? team[idx].designation,
    display_order: display_order ?? team[idx].display_order,
    status: status ?? team[idx].status,
  }
  const next = [...team]
  next[idx] = updated
  writeList(LS_KEYS.team, next)
  return toSuccess({ member_id: updated.member_id }, { message: 'Member profile updated successfully.' })
}

export async function adminDeleteTeamMember(member_id) {
  getAdminOrThrow()
  const team = readList(LS_KEYS.team, seed.team)
  writeList(LS_KEYS.team, team.filter((m) => m.member_id !== Number(member_id)))
  return toSuccess({ message: 'Team member has been permanently removed from the dashboard system directory.' })
}

export async function adminGetReviews({ status, search, page = 1, limit = 10 } = {}) {
  getAdminOrThrow()
  let reviews = readList(LS_KEYS.reviews, seed.reviews)
  if (status) reviews = reviews.filter((r) => r.status === status)
  if (search) {
    const q = String(search).toLowerCase()
    reviews = reviews.filter((r) => String(r.name ?? '').toLowerCase().includes(q) || String(r.location ?? '').toLowerCase().includes(q))
  }
  // Keep stable order newest-first
  reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const { items, count } = paginate(reviews, page, limit)
  return toListResponse(items, count)
}

export async function adminApproveReview(review_id) {
  getAdminOrThrow()
  const reviews = readList(LS_KEYS.reviews, seed.reviews)
  const idx = reviews.findIndex((r) => r.review_id === Number(review_id))
  if (idx === -1) return { success: false, error: { message: 'Review ID Not Found' } }
  if (reviews[idx].status === 'Approved') return { success: false, error: { message: 'Review Already Approved' } }
  const next = [...reviews]
  next[idx] = { ...next[idx], status: 'Approved' }
  writeList(LS_KEYS.reviews, next)
  return toSuccess({ review_id: Number(review_id), status: 'Approved' }, { message: 'PixelNest review approved and published live.' })
}

export async function adminRejectReview(review_id) {
  getAdminOrThrow()
  const reviews = readList(LS_KEYS.reviews, seed.reviews)
  const idx = reviews.findIndex((r) => r.review_id === Number(review_id))
  if (idx === -1) return { success: false, error: { message: 'Review ID Not Found' } }
  if (reviews[idx].status === 'Rejected') return { success: false, error: { message: 'Review Already Rejected' } }
  const next = [...reviews]
  next[idx] = { ...next[idx], status: 'Rejected' }
  writeList(LS_KEYS.reviews, next)
  return toSuccess({ review_id: Number(review_id), status: 'Rejected' }, { message: 'Review moved to the rejected archive repository.' })
}

export async function adminGetContactEnquiries({ search, status, date, page = 1, limit = 5 } = {}) {
  getAdminOrThrow()
  let enquiries = readList(LS_KEYS.enquiries, seed.enquiries)
  if (status) enquiries = enquiries.filter((e) => e.status === status)
  if (date) {
    const q = String(date).slice(0, 10)
    enquiries = enquiries.filter((e) => String(e.date).slice(0, 10) === q)
  }
  if (search) enquiries = filterSearch(enquiries, search, 'name')
  enquiries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const { items, count } = paginate(enquiries, page, limit)
  // Shape: include counters like workbook in at least some pages
  const counters = {
    total: readList(LS_KEYS.enquiries, seed.enquiries).length,
    new: enquiries.filter((x) => x.status === 'New').length,
    pending: enquiries.filter((x) => x.status === 'Pending').length,
    replied: enquiries.filter((x) => x.status === 'Replied').length,
    spam: enquiries.filter((x) => x.status === 'Spam').length,
  }
  return { success: true, count, counters, data: items }
}

export async function adminUpdateEnquiryStatus(id, { status } = {}) {
  getAdminOrThrow()
  const enquiries = readList(LS_KEYS.enquiries, seed.enquiries)
  const idx = enquiries.findIndex((e) => e.enquiry_id === Number(id))
  if (idx === -1) return { success: false, error: { message: 'Target Record ID Not Found' } }
  const next = [...enquiries]
  next[idx] = { ...next[idx], status }
  writeList(LS_KEYS.enquiries, next)
  return toSuccess({ enquiry_id: Number(id), status }, { message: 'Enquiry status transitioned successfully.' })
}

export async function adminDeleteEnquiry(id) {
  getAdminOrThrow()
  const enquiries = readList(LS_KEYS.enquiries, seed.enquiries)
  writeList(LS_KEYS.enquiries, enquiries.filter((e) => e.enquiry_id !== Number(id)))
  return toSuccess({ message: 'Enquiry record successfully purged from active logs.' })
}

export async function adminGetSettings() {
  getAdminOrThrow()
  const raw = localStorage.getItem(LS_KEYS.adminSettings)
  const settings = safeParse(raw, seed.adminSettings)
  return toSuccess(settings)
}

export async function adminUpdateSettings({
  username,
  profile_image,
  theme_preference,
} = {}) {
  getAdminOrThrow()
  const raw = localStorage.getItem(LS_KEYS.adminSettings)
  const settings = safeParse(raw, seed.adminSettings)
  const next = {
    ...settings,
    username: username ?? settings.username,
    profile_image: profile_image ?? settings.profile_image,
    theme_preference: theme_preference ?? settings.theme_preference,
    // Ignore password fields in mock.
  }
  try {
    localStorage.setItem(LS_KEYS.adminSettings, JSON.stringify(next))
  } catch {
    // ignore
  }
  return toSuccess({ username: next.username, profile_image: next.profile_image }, { message: 'Profile updated successfully.' })
}

