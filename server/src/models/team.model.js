// Defines the Team members collection structure
import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    photo: {
      type: String,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    linkedin: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      default: "",
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

teamSchema.index({ display_order: 1, createdAt: -1 });
const Team = mongoose.model("Team", teamSchema);
export default Team;
