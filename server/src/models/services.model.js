// Defines the Services collection structure
import mongoose from "mongoose";

const servicesSchema = new mongoose.Schema(
  {
    service_name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
    },
    short_description: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    category: {
      type: String,
      trim: true,
      default: "",
    },
    offerings: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    target_audience: {
      type: [String],
      default: [],
    },
    faq: [
      {
        q: { type: String, trim: true },
        a: { type: String, trim: true },
      },
    ],
    case_study: {
      title: { type: String, trim: true, default: "" },
      description: { type: String, trim: true, default: "" },
      stats: [
        {
          value: { type: String, trim: true },
          suffix: { type: String, trim: true },
          label: { type: String, trim: true },
        },
      ],
    },
    clients: [
      {
        name: { type: String, trim: true },
        position: { type: String, trim: true },
        company: { type: String, trim: true },
        quote: { type: String, trim: true },
        avatar: { type: String, trim: true },
      },
    ],
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true },
);

const Services = mongoose.model("Services", servicesSchema);
export default Services;
