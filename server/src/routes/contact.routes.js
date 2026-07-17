// Public route - visitors can submit a contact enquiry (rate-limited)
import express from "express";
import { submitEnquiry } from "../controllers/contact.controller.js";
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
    res.status(429).json({ success: false, message: "You've sent too many messages in a short time. Please wait a few minutes and try again." });
  }
};

router.post("/submit", submitLimiterMiddleware, submitEnquiry);

export default router;
