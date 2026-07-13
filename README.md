# Digital Marketing Agency Platform

A full-stack monorepo for a digital marketing agency's online presence. Features a dynamic public website with services, portfolio projects, case studies, courses, team profiles, client reviews, and contact management — plus a comprehensive admin panel for content management.

## Features

### Public Website (10 Pages)
- **Home** — Hero carousel, stats counters, marquee logo ticker, featured testimonials
- **About** — Agency mission/vision/values, process timeline, animated stats
- **Services** — Service overview cards with hero images, FAQ accordion per service
- **Service Detail** — Deep-dive page per service (`/services/:slug`) with process, industries, FAQ
- **Projects** — Portfolio gallery with filtering by industry/technology, pagination
- **Project Detail** — Single project page (`/projects/:slug`) with tech stack, gallery, timeline, team
- **Case Studies** — Detailed case study pages (`/case-studies/:slug`) with challenge/strategy/results
- **Team** — Staff directory grouped by department, animated counters
- **Testimonials** — Client reviews with star ratings + public review submission form
- **Contact** — Contact form (name, email, phone, country code, budget, timeline) with info cards
- **Legal** — Terms & Conditions, Privacy Policy, Internal Data Policies

### Admin Panel (15 Pages)
- **Dashboard** — Overview of platform statistics (services, projects, messages, team)
- **Services** — Full CRUD with hero image, features, benefits, FAQ linking, auto-slug, display ordering
- **Projects** — Full CRUD with multi-image gallery, technology/industry/service/team linking, client info
- **Case Studies** — Rich CRUD with challenge/objectives/strategy/solution/results, gallery, timeline, client testimonial
- **Technologies** — Taxonomy management with icon upload (FontAwesome or custom image)
- **Industries** — Taxonomy management with icon upload (FontAwesome or custom image)
- **FAQ** — Service-linked Q&A management with display ordering
- **Team** — Member management with photo, department grouping, display ordering
- **Reviews** — Moderation workflow (approve/reject/pending) with counter stats
- **Messages** — Enquiry inbox with status workflow (New/Pending/Replied/Spam)
- **Brand Settings** — Customizable brand name, logo, tagline, social links, contact info, company links
- **Site Content** — Editable marquee logos, technology list, stats counters with seed/reset
- **Settings** — Admin profile updates (name, photo, password change)
- **Authentication** — Login, Registration (single-admin), Forgot Password (OTP-based reset)

### Admin Features
- Single-admin authentication with JWT in httpOnly cookies
- Rate-limited auth endpoints (5 attempts per 15 minutes)
- Image uploads with automatic WebP conversion and 1200x1200 resizing (optional Vercel Blob in production)
- Mongoose 9 async hooks, auto-slug generation for services, projects, case studies, technologies, industries
- 14 Zustand stores for client-side state management
- Reusable admin UI component library (24 components)

## Tech Stack

### Frontend

| Library | Version |
|---------|---------|
| React | 19 |
| Vite | 8 |
| Tailwind CSS | 4 |
| React Router | 7 |
| Zustand | Latest |
| Axios | Latest |
| FontAwesome (Solid + Brands) | Latest |
| Sonner (Toasts) | Latest |
| country-flag-icons | Latest |
| ESLint | Latest |

### Backend

| Library | Version |
|---------|---------|
| Node.js | 18+ |
| Express | 5 |
| Mongoose | 9 (MongoDB ODM) |
| Sharp | Latest |
| Multer | Latest |
| Nodemailer | Latest |
| JSON Web Token | Latest |
| bcryptjs | Latest |
| express-validator | Latest |
| rate-limiter-flexible | Latest |
| cookie-parser | Latest |
| dotenv | Latest |
| @vercel/blob | Latest |

### Database
- MongoDB Atlas (production)
- Local MongoDB (development)

## Project Structure

```
digital-marketing-agency/
├── api/
│   └── index.js                   # Vercel serverless wrapper
├── client/                        # React 19 + Vite 8 frontend
│   ├── public/
│   ├── src/
│   │   ├── App.jsx                # BrowserRouter + Route definitions
│   │   ├── main.jsx               # Entry point
│   │   ├── index.css              # Tailwind v4 + design tokens
│   │   ├── auth/                  # AdminGuard component
│   │   ├── components/
│   │   │   ├── admin/             # AdminSidebar, CategoryManagement, NotificationDropdown
│   │   │   ├── public/            # HeroSplit, OurProcess, FAQSection, FinalCTA, etc. (13)
│   │   │   ├── ui/                # FormField, Pagination, MultiSelect, etc. (24)
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── layouts/               # PublicLayout, AdminLayout
│   │   ├── pages/
│   │   │   ├── public/            # Home, About, Services, Projects, Team, etc. (10)
│   │   │   └── admin/             # Dashboard, Services, Projects, CaseStudies, etc. (15)
│   │   ├── services/              # Axios instance (baseURL: /api/v1)
│   │   ├── store/                 # Zustand stores (14)
│   │   └── utils/                 # resolveImagePath, slugify, imageUrl
├── server/                        # Express 5 backend
│   └── src/
│       ├── index.js               # Entry: load env, connect DB, start server
│       ├── app.js                 # Middleware, route mounting, error handler
│       ├── seed.js                # Demo data seeder (--force to re-seed)
│       ├── config/
│       │   ├── db.js              # Mongoose connection
│       │   ├── upload.js          # Multer memoryStorage + Sharp processing
│       │   └── blob.js            # Vercel Blob upload (production only)
│       ├── controllers/           # 13 controllers
│       ├── middleware/            # asyncHandler, auth, errorHandler, mongoSanitize, validators
│       ├── models/                # 12 Mongoose models
│       ├── routes/                # 24 route files (public + admin per domain)
│       └── utils/                 # helpers.js (slug, JSON parse, regex), sendEmail.js
├── vercel.json                    # Vercel deployment config
├── package.json                   # Root scripts (dev, build, seed)
└── .gitignore
```

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

## Installation

### 1. Clone and Install All Dependencies

```bash
git clone https://github.com/shikeshjayan/digital-marketing-agency.git
cd digital-marketing-agency
npm install              # Root dependencies (concurrently)
cd server && npm install # Server dependencies
cd ../client && npm install # Client dependencies
```

### 2. Environment Variables

**Server (`server/.env`):**

```env
MONGO_URL=your_mongodb_atlas_connection_string
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Vercel Blob (optional, production only)
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

**Client (`client/.env`):**

```env
VITE_API_URL=/api/v1
```

In development, Vite proxies `/api/*` requests to `localhost:5000`. In production, set `VITE_API_URL` to your deployed backend URL.

## Running the Application

### Development Mode

```bash
# From root — starts both server (:5000) and client (:5173) concurrently
npm run dev

# Or individually:
cd server && npm run dev   # Nodemon on port 5000
cd client && npm run dev   # Vite dev server on port 5173
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

### Production Build

```bash
npm run build
# or
cd client && npm run build  # Output → client/dist/
```

### Seed Demo Data

```bash
npm run seed        # Seed if empty; skip if data exists
npm run seed -- --force  # Clear and re-seed all collections
```

Seeds **18 services**, **12 projects**, **6 case studies**, **24 technologies**, **18 industries**, **24 team members**, **18 reviews**, **9 enquiries**, **36 FAQs**.

## Database Models (12)

| Model | Key Fields |
|-------|------------|
| **Admin** | name, email, password (hashed, select:false), photo, role |
| **Service** | service_name, slug (unique, auto), short_description, description, hero_image, icon, deliverables[], benefits[], featured, display_order, seo, status (Active/Inactive) |
| **Project** | project_name, slug (unique, auto), short_description, description, thumbnail, gallery[], services[ref], technologies[ref], industries[ref], team[ref], client{name,company,website,location}, project_url, github_url, completion_date, featured, seo, status (Draft/Published) |
| **CaseStudy** | title, slug (unique, auto), project[ref], hero_image, overview, challenge, objectives[], strategy, solution, deliverables[], timeline{duration,started_at,completed_at}, development_process[{title,description}], challenges_and_solutions[{challenge,solution}], results[{title,value}], gallery[], client_testimonial{quote,client_name,designation,company}, featured, seo, status (Draft/Published) |
| **Technology** | name (unique), slug (unique, auto), description, icon, iconType (fontawesome/image), display_order, status (Active/Inactive) |
| **Industry** | name (unique), slug (unique, auto), description, icon, iconType (fontawesome/image), display_order, status (Active/Inactive) |
| **Team** | photo, name, designation, description, linkedin, email, display_order, status (Active/Inactive) |
| **Review** | user_avatar, name, location, rating (1-5), review_text, status (Pending/Approved/Rejected) |
| **FAQ** | question, answer, service[ref], display_order, status (Active/Inactive) |
| **Contact** | name, email, phone, service, message, status (New/Pending/Replied/Spam) |
| **SiteContent** | content (Mixed — flexible schema) |
| **BrandSettings** | brand{name,logo,tagline}, socialLinks[{platform,url,icon}], contact{phone,email,address,whatsapp,working_hours,location}, companyLinks[{label,path}] |

Models with slugs use async `pre("save")` + `pre("findOneAndUpdate")` hooks with collision handling. Mongoose 9 — hooks do **not** receive a `next` callback.

## API Endpoints

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Server health (uptime, DB state, env status) |

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/services` | All active services |
| GET | `/api/v1/services/slug/:slug` | Service by slug |
| GET | `/api/v1/services/related/:id` | Related services |
| GET | `/api/v1/projects` | Active projects (filterable) |
| GET | `/api/v1/projects/slug/:slug` | Project by slug |
| GET | `/api/v1/technologies` | All active technologies |
| GET | `/api/v1/industries` | All active industries |
| GET | `/api/v1/case-studies` | All active case studies |
| GET | `/api/v1/case-studies/slug/:slug` | Case study by slug |
| GET | `/api/v1/case-studies/service/:serviceId` | Case studies by service |
| GET | `/api/v1/team` | Active team members (ordered) |
| GET | `/api/v1/reviews` | Approved reviews |
| POST | `/api/v1/reviews/submit` | Submit a review (rate-limited) |
| GET | `/api/v1/faqs` | All active FAQs |
| GET | `/api/v1/faqs/service/:serviceId` | FAQs by service |
| POST | `/api/v1/contact/submit` | Submit contact form (rate-limited) |
| GET | `/api/v1/site-content` | Site content (stats, logos) |
| GET | `/api/v1/brand-settings` | Brand settings |
| GET | `/api/v1/page/home` | Aggregated home page data |
| GET | `/api/v1/page/about` | Aggregated about page data |
| GET | `/api/v1/page/services` | Aggregated services page data |
| GET | `/api/v1/page/projects` | Aggregated projects page data |
| GET | `/api/v1/page/testimonials` | Aggregated testimonials page data |
| GET | `/api/v1/page/contact` | Aggregated contact page data |

### Admin Routes (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/check` | Check if admin exists |
| GET | `/api/v1/admin/check-email` | Check if email is registered |
| POST | `/api/v1/admin/register` | Register admin (single-admin) |
| POST | `/api/v1/admin/login` | Admin login (JWT cookie) |
| GET | `/api/v1/admin/profile` | Get admin profile |
| POST | `/api/v1/admin/logout` | Logout (clear cookie) |
| PUT | `/api/v1/admin/profile` | Update profile + photo |
| POST | `/api/v1/admin/forgot-password` | Request OTP |
| POST | `/api/v1/admin/verify-otp` | Verify OTP + reset password |

**Services:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/services` | All services (incl. inactive) |
| POST | `/api/v1/admin/services/create` | Create service |
| PUT | `/api/v1/admin/services/:id` | Update service |
| DELETE | `/api/v1/admin/services/:id` | Delete service |

**Projects:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/projects` | All projects |
| POST | `/api/v1/admin/projects/create` | Create project |
| PUT | `/api/v1/admin/projects/:id` | Update project |
| DELETE | `/api/v1/admin/projects/:id` | Delete project |

**Case Studies:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/case-studies` | All case studies |
| POST | `/api/v1/admin/case-studies/create` | Create case study |
| PUT | `/api/v1/admin/case-studies/:id` | Update case study |
| DELETE | `/api/v1/admin/case-studies/:id` | Delete case study |

**Technologies:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/technologies` | All technologies |
| POST | `/api/v1/admin/technologies/create` | Create technology |
| PUT | `/api/v1/admin/technologies/:id` | Update technology |
| DELETE | `/api/v1/admin/technologies/:id` | Delete technology |

**Industries:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/industries` | All industries |
| POST | `/api/v1/admin/industries/create` | Create industry |
| PUT | `/api/v1/admin/industries/:id` | Update industry |
| DELETE | `/api/v1/admin/industries/:id` | Delete industry |

**Team:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/team` | All team members |
| POST | `/api/v1/admin/team/create` | Add team member |
| PUT | `/api/v1/admin/team/:id` | Update team member |
| DELETE | `/api/v1/admin/team/:id` | Remove team member |

**Reviews:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/reviews` | All reviews (with counters) |
| PATCH | `/api/v1/admin/reviews/approve/:id` | Approve review |
| PATCH | `/api/v1/admin/reviews/reject/:id` | Reject review |
| DELETE | `/api/v1/admin/reviews/:id` | Delete review |

**Contact/Enquiries:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/contact` | All enquiries (with counters) |
| PATCH | `/api/v1/admin/contact/:id/status` | Update enquiry status |
| DELETE | `/api/v1/admin/contact/:id` | Delete enquiry |

**FAQs:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/faqs` | All FAQs |
| POST | `/api/v1/admin/faqs/create` | Create FAQ |
| PUT | `/api/v1/admin/faqs/:id` | Update FAQ |
| DELETE | `/api/v1/admin/faqs/:id` | Delete FAQ |

**Site Content:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/site-content` | Get site content |
| PUT | `/api/v1/admin/site-content` | Update site content |
| POST | `/api/v1/admin/site-content/seed` | Reset to seed data |

**Brand Settings:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/brand-settings` | Get brand settings |
| PUT | `/api/v1/admin/brand-settings` | Update brand settings |
| POST | `/api/v1/admin/brand-settings/seed` | Reset to seed data |

## Scripts

### Root

```bash
npm run dev       # Run server + client concurrently
npm run build     # Build client for production
npm run seed      # Seed demo data
```

### Server (`server/`)

```bash
npm run dev       # Nodemon dev server
npm start         # Production server
```

### Client (`client/`)

```bash
npm run dev       # Vite dev server
npm run build     # Production build → client/dist/
npm run preview   # Preview production build
npm run lint      # ESLint
```

## Deployment (Vercel)

This project is configured for Vercel deployment via `vercel.json`:

- **Serverless API:** `api/index.js` (wraps Express app in a serverless function)
- **Static Frontend:** `client/dist/` served as static build
- **SPA Fallback:** All non-`/api/` routes serve `/index.html`
- **Build Command:** `npm run build` (installs client deps + builds)

Set the following environment variables in Vercel project settings:

```env
MONGO_URL=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=https://your-domain.vercel.app
NODE_ENV=production
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
# Email config (SMTP)
```

## Image Upload Flow

1. **Multer** — memoryStorage with 4MB limit, image MIME types only
2. **Sharp** — resize to max 1200×1200 (`fit: "inside"`, no enlargement), WebP quality 80
3. **Vercel Blob** — uploaded via `@vercel/blob` in production
4. **Local** — written to `server/uploads/`, served at `/api/v1/uploads/` (dev)

The `processImage` middleware handles both single (`req.file`) and multiple (`req.files`) uploads per field.

## Security Features

- **JWT Authentication** — httpOnly cookies for admin routes
- **Password Hashing** — bcryptjs with salt rounds
- **Rate Limiting** — Auth: 5 req/15min; General API: 100 req/min
- **NoSQL Injection Protection** — Custom middleware strips `$` keys from body/query/params
- **Input Validation** — express-validator on auth endpoints (password strength, email format, OTP format)
- **CORS** — Restricted to configured `CLIENT_URL` with credentials
- **File Upload Restrictions** — Multer MIME type filtering + Sharp re-encoding
- **Mongoose Schema Validation** — All models enforce field constraints

## API Response Format

All endpoints return:

```json
{
  "success": true,
  "data": { ... },
  "pagination": {
    "total": 50,
    "page": 1,
    "pages": 5
  }
}
```

Stores in the client read `response.data.data` to access the payload.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

## Author

**Shikesh Jayan** — [GitHub](https://github.com/shikeshjayan)
