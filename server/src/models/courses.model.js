// Defines the Courses collection structure
import mongoose from "mongoose";

const coursesSchema = new mongoose.Schema(
  {
    course_name: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true },
);

const Courses = mongoose.model("Courses", coursesSchema);
export default Courses;
