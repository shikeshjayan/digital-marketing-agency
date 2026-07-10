# Digital Marketing Agency Platform

A full-stack web application for managing a digital marketing agency's online presence, including services, portfolio projects, courses, team members, client reviews, and contact inquiries.

## Features

### Public Website
- **Home** - Hero section, featured services, and call-to-action
- **About** - Agency information and mission
- **Services** - Browse all offered services with detailed descriptions
- **Projects** - Portfolio showcase with category filtering (Static, Dynamic, Landing Pages)
- **Courses** - Available courses with slug-based routing
- **Team** - Team member profiles with designations
- **Testimonials** - Client reviews and ratings
- **Contact** - Contact form for inquiries

### Admin Panel
- **Dashboard** - Overview of platform statistics
- **Services Management** - Full CRUD operations for services
- **Projects Management** - Manage portfolio projects with image uploads
- **Courses Management** - Create and manage courses with auto-slug generation
- **Team Management** - Manage team members with display ordering
- **Reviews Management** - Approve, reject, or moderate client reviews
- **Messages** - View and manage contact form submissions
- **Settings** - Admin profile management

## Tech Stack

### Frontend
- React 19
- Vite 8
- Tailwind CSS 4
- React Router 7
- ESLint

### Backend
- Node.js
- Express 5
- Mongoose 9 (MongoDB ODM)
- JSON Web Tokens (JWT)
- bcryptjs (Password Hashing)
- Multer + Sharp (File Uploads & Image Processing)
- Nodemailer (Email Service)
- Rate Limiter Flexible (API Rate Limiting)

### Database
- MongoDB Atlas

## Project Structure

```
digital-marketing-agency/
├── client/                    # React frontend
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── auth/             # Authentication guards
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React context providers
│   │   ├── data/             # Static data files
│   │   ├── layouts/          # Page layouts (Public, Admin)
│   │   ├── pages/
│   │   │   ├── public/       # Public pages (Home, About, etc.)
│   │   │   └── admin/        # Admin dashboard pages
│   │   ├── services/         # API service functions
│   │   ├── store/            # State management
│   │   └── utils/            # Utility functions
│   ├── .env                  # Client environment variables
│   └── package.json
├── server/                    # Node.js backend
│   ├── src/
│   │   ├── config/           # Database & upload configuration
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Auth, error handling, sanitization
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API route definitions
│   │   └── utils/            # Email & recovery utilities
│   ├── uploads/              # Uploaded files (gitignored)
│   ├── .env                  # Server environment variables
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/shikeshjayan/digital-marketing-agency.git
cd digital-marketing-agency
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

## Environment Variables

### Server (.env)

Create a `.env` file in the `server/` directory:

```env
MONGO_URL=your_mongodb_atlas_connection_string
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Client (.env)

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

## Running the Application

### Development Mode

**Terminal 1 - Start the server:**

```bash
cd server
npm run dev
```

**Terminal 2 - Start the client:**

```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Production Build

```bash
cd client
npm run build
```

## API Endpoints

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/services` | Get all active services |
| GET | `/api/v1/services/:slug` | Get service by slug |
| GET | `/api/v1/projects` | Get all active projects |
| GET | `/api/v1/courses` | Get all active courses |
| GET | `/api/v1/courses/:slug` | Get course by slug |
| GET | `/api/v1/team` | Get all active team members |
| GET | `/api/v1/reviews` | Get approved reviews |
| POST | `/api/v1/contact` | Submit contact form |

### Admin Routes (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/admin/register` | Register admin |
| POST | `/api/v1/admin/login` | Admin login |
| POST | `/api/v1/admin/forgot-password` | Request password reset |
| POST | `/api/v1/admin/verify-otp` | Verify OTP code |
| GET | `/api/v1/admin/services` | Get all services |
| POST | `/api/v1/admin/services` | Create service |
| PUT | `/api/v1/admin/services/:id` | Update service |
| DELETE | `/api/v1/admin/services/:id` | Delete service |
| GET | `/api/v1/admin/projects` | Get all projects |
| POST | `/api/v1/admin/projects` | Create project |
| PUT | `/api/v1/admin/projects/:id` | Update project |
| DELETE | `/api/v1/admin/projects/:id` | Delete project |
| GET | `/api/v1/admin/courses` | Get all courses |
| POST | `/api/v1/admin/courses` | Create course |
| PUT | `/api/v1/admin/courses/:id` | Update course |
| DELETE | `/api/v1/admin/courses/:id` | Delete course |
| GET | `/api/v1/admin/team` | Get all team members |
| POST | `/api/v1/admin/team` | Add team member |
| PUT | `/api/v1/admin/team/:id` | Update team member |
| DELETE | `/api/v1/admin/team/:id` | Remove team member |
| GET | `/api/v1/admin/reviews` | Get all reviews |
| PUT | `/api/v1/admin/reviews/:id` | Update review status |
| DELETE | `/api/v1/admin/reviews/:id` | Delete review |
| GET | `/api/v1/admin/contact` | Get all messages |
| PUT | `/api/v1/admin/contact/:id` | Update message status |
| DELETE | `/api/v1/admin/contact/:id` | Delete message |

## Scripts

### Server

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
```

### Client

```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Security Features

- **JWT Authentication** - Secure admin routes with token-based auth
- **Password Hashing** - bcryptjs with salt rounds for secure password storage
- **Rate Limiting** - Prevents brute-force attacks on auth endpoints (5 attempts/15 min) and general API abuse (100 requests/min)
- **NoSQL Injection Protection** - MongoDB sanitization middleware
- **CORS Configuration** - Restricted to client origin with credentials support
- **HTTP-Only Cookies** - Secure token storage in cookies
- **Input Validation** - Mongoose schema validation on all models
- **File Upload Security** - Multer configuration with file type restrictions

## Database Models

| Model | Fields |
|-------|--------|
| **Admin** | name, email, password, photo, role |
| **Services** | service_name, short_description, description, image, status |
| **Projects** | project_name, category, short_description, description, image, live_url, status |
| **Courses** | course_name, slug, description, image, category, status |
| **Team** | photo, name, designation, description, display_order, status |
| **Reviews** | user_avatar, name, location, rating, review_text, status |
| **Contacts** | name, email, phone, service, message, status |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Author

**Shikesh Jayan** - [GitHub](https://github.com/shikeshjayan)
