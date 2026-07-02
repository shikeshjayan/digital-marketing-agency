import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { RateLimiterMemory } from "rate-limiter-flexible";
import mongoSanitize from "./middleware/mongoSanitize.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import serviceRoutes from "./routes/services.routes.js";
import adminServicesRoutes from "./routes/adminServices.routes.js";
import projectRoutes from "./routes/projects.routes.js";
import adminProjectsRoutes from "./routes/adminProjects.routes.js";
import coursesRoutes from "./routes/courses.routes.js";
import adminCoursesRoutes from "./routes/adminCourses.routes.js";
import teamRoutes from "./routes/team.routes.js";
import adminTeamRoutes from "./routes/adminTeam.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import adminReviewsRoutes from "./routes/adminReviews.routes.js";
import publicReviewsRoutes from "./routes/publicReviews.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import adminContactRoutes from "./routes/adminContact.routes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// Rate limiters
const generalLimiter = new RateLimiterMemory({
  points: 100,
  duration: 60,
});

const authLimiter = new RateLimiterMemory({
  points: 5,
  duration: 900,
});

// Middleware wrapper
const rateLimitMiddleware = (limiter, message) => async (req, res, next) => {
  try {
    await limiter.consume(req.ip);
    next();
  } catch {
    res.status(429).json({ success: false, message });
  }
};

// Allow requests from the React frontend
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
// Convert incoming JSON data so we can read it easily
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
// Read cookies from the browser
app.use(cookieParser());
// Sanitize data to prevent NoSQL injection
app.use(mongoSanitize);

// Serve local uploads BEFORE rate limiter so images aren't blocked
if (process.env.NODE_ENV !== "production") {
  const uploadsDir = path.join(__dirname, "..", "uploads");
  app.use("/api/v1/uploads", express.static(uploadsDir));
}

// Apply general rate limit to all API routes
app.use("/api/v1", rateLimitMiddleware(generalLimiter, "Too many requests, try again later"));

// Strict rate limit for auth endpoints (login/register)
app.use("/api/v1/admin/login", rateLimitMiddleware(authLimiter, "Too many attempts, try again later"));
app.use("/api/v1/admin/register", rateLimitMiddleware(authLimiter, "Too many attempts, try again later"));
app.use("/api/v1/admin/forgot-password", rateLimitMiddleware(authLimiter, "Too many attempts, try again later"));
app.use("/api/v1/admin/verify-otp", rateLimitMiddleware(authLimiter, "Too many attempts, try again later"));

// Connect each route group to its URL path
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/admin/services", adminServicesRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/admin/projects", adminProjectsRoutes);
app.use("/api/v1/courses", coursesRoutes);
app.use("/api/v1/admin/courses", adminCoursesRoutes);
app.use("/api/v1/team", teamRoutes);
app.use("/api/v1/admin/team", adminTeamRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/admin/reviews", adminReviewsRoutes);
app.use("/api/v1/reviews", publicReviewsRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/admin/contact", adminContactRoutes);

app.use(errorHandler);

export default app;
