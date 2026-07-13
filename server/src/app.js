import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
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
import technologyRoutes from "./routes/technology.routes.js";
import adminTechnologyRoutes from "./routes/adminTechnology.routes.js";
import industryRoutes from "./routes/industry.routes.js";
import adminIndustryRoutes from "./routes/adminIndustry.routes.js";
import teamRoutes from "./routes/team.routes.js";
import adminTeamRoutes from "./routes/adminTeam.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import adminReviewsRoutes from "./routes/adminReviews.routes.js";
import publicReviewsRoutes from "./routes/publicReviews.routes.js";
import caseStudyRoutes from "./routes/caseStudy.routes.js";
import adminCaseStudyRoutes from "./routes/adminCaseStudy.routes.js";
import faqRoutes from "./routes/faq.routes.js";
import adminFaqRoutes from "./routes/adminFaq.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import adminContactRoutes from "./routes/adminContact.routes.js";
import siteContentRoutes from "./routes/siteContent.routes.js";
import adminSiteContentRoutes from "./routes/adminSiteContent.routes.js";
import brandSettingsRoutes from "./routes/brandSettings.routes.js";
import adminBrandSettingsRoutes from "./routes/adminBrandSettings.routes.js";
import pageRoutes from "./routes/page.routes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// Trust first proxy (required for Vercel/Heroku/etc. so req.ip resolves to client IP)
app.set("trust proxy", 1);

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
app.use(cors({ origin: process.env.CLIENT_URL || true, credentials: true }));
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
app.use("/api/v1/technologies", technologyRoutes);
app.use("/api/v1/admin/technologies", adminTechnologyRoutes);
app.use("/api/v1/industries", industryRoutes);
app.use("/api/v1/admin/industries", adminIndustryRoutes);
app.use("/api/v1/team", teamRoutes);
app.use("/api/v1/admin/team", adminTeamRoutes);
app.use("/api/v1/case-studies", caseStudyRoutes);
app.use("/api/v1/admin/case-studies", adminCaseStudyRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/admin/reviews", adminReviewsRoutes);
app.use("/api/v1/reviews", publicReviewsRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/admin/contact", adminContactRoutes);
app.use("/api/v1/faqs", faqRoutes);
app.use("/api/v1/admin/faqs", adminFaqRoutes);
app.use("/api/v1/site-content", siteContentRoutes);
app.use("/api/v1/admin/site-content", adminSiteContentRoutes);
app.use("/api/v1/brand-settings", brandSettingsRoutes);
app.use("/api/v1/admin/brand-settings", adminBrandSettingsRoutes);
app.use("/api/v1/page", pageRoutes);

// Health check — exposes env status and DB state for debugging
app.get("/api/v1/health", (req, res) => {
  res.json({
    success: true,
    uptime: process.uptime(),
    env: {
      MONGO_URL: !!process.env.MONGO_URL,
      JWT_SECRET: !!process.env.JWT_SECRET,
      CLIENT_URL: process.env.CLIENT_URL || "(not set)",
      NODE_ENV: process.env.NODE_ENV || "(not set)",
      BLOB_READ_WRITE_TOKEN: !!process.env.BLOB_READ_WRITE_TOKEN,
    },
    mongooseState: mongoose.connection.readyState,
  });
});

app.use(errorHandler);

export default app;
