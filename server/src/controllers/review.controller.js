// Handles customer reviews - public submission/display and admin moderation
import Review from "../models/reviews.model.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { escapeRegex } from "../utils/helpers.js";

// Get all reviews with filters for admin panel (admin only)
export const getAdminReviews = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (status) {
    filter.status = status;
  }
  if (search) {
    filter.name = { $regex: escapeRegex(search), $options: "i" };
  }

  const skip = (Number(page) - 1) * Number(limit);

  // Run multiple queries in parallel
  const [reviews, total, pendingCount, approvedCount, rejectedCount] = await Promise.all([
    Review.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Review.countDocuments(filter),
    Review.countDocuments({ status: "Pending" }),
    Review.countDocuments({ status: "Approved" }),
    Review.countDocuments({ status: "Rejected" }),
  ]);

  const data = reviews.map((r) => ({
    review_id: r._id,
    user_avatar: r.user_avatar && !r.user_avatar.includes("data:image/svg+xml") ? r.user_avatar : null,
    name: r.name,
    location: r.location,
    rating: r.rating,
    review_text: r.review_text,
    status: r.status,
    date: r.createdAt,
  }));

  res.status(200).json({
    success: true,
    count: data.length,
    counters: {
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
    },
    data,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

// Approve a review so it shows up on the public site (admin only)
export const approveReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({ success: false, message: "We couldn't find this review. It may have been removed." });
  }

  if (review.status === "Approved") {
    return res.status(400).json({ success: false, message: "This review has already been approved." });
  }

  review.status = "Approved";
  await review.save();

  res.status(200).json({
    success: true,
    message: "Review approved and published live.",
    data: {
      review_id: review._id,
      status: review.status,
    },
  });
});

// Reject a review so it does NOT show on the public site (admin only)
export const rejectReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({ success: false, message: "We couldn't find this review. It may have been removed." });
  }

  if (review.status === "Rejected") {
    return res.status(400).json({ success: false, message: "This review has already been rejected." });
  }

  review.status = "Rejected";
  await review.save();

  res.status(200).json({
    success: true,
    message: "Review moved to the rejected archive repository.",
    data: {
      review_id: review._id,
      status: review.status,
    },
  });
});

// Delete all reviews (admin only)
export const deleteAllReviews = asyncHandler(async (req, res) => {
  const result = await Review.deleteMany({});
  res.status(200).json({
    success: true,
    message: `${result.deletedCount} review(s) deleted successfully.`,
  });
});

// Delete a single review permanently (admin only)
export const deleteSingleReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) {
    return res.status(404).json({ success: false, message: "We couldn't find this review. It may have been removed." });
  }
  res.status(200).json({
    success: true,
    message: "Review deleted permanently.",
  });
});

// Get only approved reviews to show on the public website
export const getPublicReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ status: "Approved" }).sort({ createdAt: -1 });

  const data = reviews.map((r) => ({
    user_avatar: r.user_avatar && !r.user_avatar.includes("data:image/svg+xml") ? r.user_avatar : null,
    name: r.name,
    location: r.location,
    rating: r.rating,
    review_text: r.review_text,
  }));

  res.status(200).json({
    success: true,
    count: data.length,
    data,
  });
});

// Public visitors can submit a review (goes to Pending status for moderation)
export const submitReview = asyncHandler(async (req, res) => {
  const { name, location, rating, review_text } = req.body;

  // Validate required fields
  if (!name || !location || !rating || !review_text) {
    return res.status(400).json({ success: false, message: "Please provide a rating between 1 and 5, and fill in your name, location, and review." });
  }

  // Rating must be a number between 1 and 5
  const ratingNum = Number(rating);
  if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return res.status(400).json({ success: false, message: "Please choose a rating between 1 and 5." });
  }

  await Review.create({
    name,
    location,
    rating: ratingNum,
    review_text,
  });

  res.status(201).json({
    success: true,
    message: "Thank you! Your review has been submitted successfully and is awaiting moderation.",
  });
});
