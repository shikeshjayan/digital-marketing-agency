// Public route - visitors can submit a contact enquiry (rate-limited)
import express from "express";
import { submitEnquiry } from "../controllers/contact.controller.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Limit to 5 submissions per 15 minutes to prevent spam
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too Many Requests (Rate limit triggered to stop bot spam)",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/submit", submitLimiter, submitEnquiry);

export default router;
