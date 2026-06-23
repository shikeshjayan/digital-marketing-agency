// Defines the Reviews collection structure
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user_avatar: {
      type: String,
      default: "https://cdn.spixelNest.com/avatars/default.jpg",
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
    },
    review_text: {
      type: String,
      required: [true, "Review text is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
