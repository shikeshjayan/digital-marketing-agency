import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
      trim: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Services",
      required: [true, "Service is required"],
    },
    display_order: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true },
);

faqSchema.index({ display_order: 1, createdAt: -1 });
const FAQ = mongoose.model("FAQ", faqSchema);
export default FAQ;
