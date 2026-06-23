// Handles customer reviews - public submission/display and admin moderation
import Review from "../models/reviews.model.js";

// Get all reviews with filters for admin panel (admin only)
export const getAdminReviews = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    }
    if (search) {
      filter.name = { $regex: search, $options: "i" };
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
      user_avatar: r.user_avatar,
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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve a review so it shows up on the public site (admin only)
export const approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.review_id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review ID Not Found" });
    }

    if (review.status === "Approved") {
      return res.status(400).json({ success: false, message: "Review Already Approved" });
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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject a review so it does NOT show on the public site (admin only)
export const rejectReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review ID Not Found" });
    }

    if (review.status === "Rejected") {
      return res.status(400).json({ success: false, message: "Review Already Rejected" });
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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get only approved reviews to show on the public website
export const getPublicReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: "Approved" }).sort({ createdAt: -1 });

    const data = reviews.map((r) => ({
      user_avatar: r.user_avatar,
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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Public visitors can submit a review (goes to Pending status for moderation)
export const submitReview = async (req, res) => {
  try {
    const { name, location, rating, review_text } = req.body;

    // Validate required fields
    if (!name || !location || !rating || !review_text) {
      return res.status(400).json({ success: false, message: "Bad Request (Validation failed: missing fields, invalid rating scale)" });
    }

    // Rating must be a number between 1 and 5
    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ success: false, message: "Bad Request (Validation failed: missing fields, invalid rating scale)" });
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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
