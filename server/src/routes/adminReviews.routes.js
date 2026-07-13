// Routes for admin to moderate reviews
import express from "express";
import { getAdminReviews, approveReview, rejectReview, deleteAllReviews, deleteSingleReview } from "../controllers/review.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getAdminReviews);
router.patch("/approve/:id", protect, approveReview);
router.patch("/reject/:id", protect, rejectReview);
router.delete("/", protect, deleteAllReviews);
router.delete("/:id", protect, deleteSingleReview);

export default router;
