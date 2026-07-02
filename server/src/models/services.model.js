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
    offerings: {
      type: [String],
      default: [],
    },
    target_audience: {
      type: [String],
      default: [],
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
