// Routes for admin to moderate reviews
import express from "express";
import { getAdminReviews, approveReview, rejectReview } from "../controllers/review.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getAdminReviews);
router.patch("/approve/:review_id", protect, approveReview);
router.patch("/reject/:id", protect, rejectReview);

export default router;
