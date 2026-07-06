// Defines the Projects collection structure
import mongoose from "mongoose";

const projectsSchema = new mongoose.Schema(
  {
    project_name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Static", "Dynamic", "Landing Pages",
        "SEO", "Web Design", "Google Ads", "Meta Ads", "Branding", "E-commerce",
      ],
    },
    client_name: {
      type: String,
      trim: true,
      default: "",
    },
    industry: {
      type: String,
      trim: true,
      default: "",
    },
    technologies: {
      type: [String],
      default: [],
    },
    duration: {
      type: String,
      trim: true,
      default: "",
    },
    before_after: [
      {
        metric: { type: String, trim: true },
        before: { type: String, trim: true },
        after: { type: String, trim: true },
      },
    ],
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
    live_url: {
      type: String,
    },
    challenge: {
      type: String,
      trim: true,
      default: "",
    },
    solution: {
      type: String,
      trim: true,
      default: "",
    },
    client_testimonial: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true },
);

const Projects = mongoose.model("Projects", projectsSchema);
export default Projects;
