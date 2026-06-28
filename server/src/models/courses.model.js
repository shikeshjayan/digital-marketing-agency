// Defines the Courses collection structure
import mongoose from "mongoose";

function slugify(input) {
  return String(input ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const coursesSchema = new mongoose.Schema(
  {
    course_name: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    image: {
      type: String,
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

coursesSchema.pre("save", function () {
  if (this.isModified("course_name")) {
    this.slug = slugify(this.course_name);
  }
});

coursesSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();
  if (update?.course_name) {
    update.slug = slugify(update.course_name);
  }
});

const Courses = mongoose.model("Courses", coursesSchema);
export default Courses;
