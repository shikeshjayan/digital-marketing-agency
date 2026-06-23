// Public routes - visitors can view approved reviews and submit new ones (rate-limited)
import express from "express";
import { getPublicReviews, submitReview } from "../controllers/review.controller.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Limit to 5 reviews per 15 minutes to prevent spam
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too Many Requests (Rate limit tripped to prevent spam)",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/", getPublicReviews);
router.post("/submit", submitLimiter, submitReview);

export default router;
