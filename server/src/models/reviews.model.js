// Defines the Reviews collection structure
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user_avatar: {
      type: String,
      default: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23e5e7eb' width='100' height='100'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='%239ca3af' font-size='40' font-family='sans-serif'%3E?%3C/text%3E%3C/svg%3E",
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
