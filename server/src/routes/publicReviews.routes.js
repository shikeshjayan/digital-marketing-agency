// Public routes - visitors can view approved reviews and submit new ones (rate-limited)
import express from "express";
import { getPublicReviews, submitReview } from "../controllers/review.controller.js";
import { RateLimiterMemory } from "rate-limiter-flexible";

const router = express.Router();

const submitLimiter = new RateLimiterMemory({
  points: 5,
  duration: 900,
});

const submitLimiterMiddleware = async (req, res, next) => {
  try {
    await submitLimiter.consume(req.ip);
    next();
  } catch {
    res.status(429).json({ success: false, message: "You've submitted too many reviews recently. Please wait a few minutes and try again." });
  }
};

router.get("/", getPublicReviews);
router.post("/submit", submitLimiterMiddleware, submitReview);

export default router;
