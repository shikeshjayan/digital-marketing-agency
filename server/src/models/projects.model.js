// Defines the Projects collection structure
import mongoose from "mongoose";
import { generateSlug } from "../utils/helpers.js";

const projectsSchema = new mongoose.Schema(
  {
    project_name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    short_description: {
      type: String,
      required: [true, "Short description is required"],
      maxlength: 200,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    thumbnail: {
      type: String,
      required: [true, "Thumbnail is required"],
    },
    gallery: [
      {
        type: String,
      },
    ],
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Services",
        required: true,
      },
    ],
    technologies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Technology",
      },
    ],
    industries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Industry",
      },
    ],
    team: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
    client: {
      name: {
        type: String,
        trim: true,
        default: "",
      },
      company: {
        type: String,
        trim: true,
        default: "",
      },
      website: {
        type: String,
        trim: true,
        default: "",
      },
      location: {
        type: String,
        trim: true,
        default: "",
      },
    },
    project_url: {
      type: String,
      default: "",
    },
    github_url: {
      type: String,
      default: "",
    },
    completion_date: {
      type: Date,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    seo: {
      meta_title: {
        type: String,
        trim: true,
        default: "",
      },
      meta_description: {
        type: String,
        trim: true,
        default: "",
      },
    },
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Published",
    },
  },
  {
    timestamps: true,
  },
);

projectsSchema.index({ status: 1, createdAt: -1 });
projectsSchema.index({ status: 1, services: 1 });

// Auto-generate slug from project_name before saving
projectsSchema.pre("save", async function () {
  if (!this.isModified("project_name")) return;

  let base = generateSlug(this.project_name);
  let slug = base;
  let counter = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await mongoose.model("Projects").findOne({ slug, _id: { $ne: this._id } });
    if (!existing) break;
    slug = `${base}-${counter}`;
    counter++;
  }

  this.slug = slug;
});

// Also regenerate slug when updated via findOneAndUpdate
projectsSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  if (update.project_name) {
    let base = generateSlug(update.project_name);
    let slug = base;
    let counter = 1;
    while (true) {
      const docId = this.getFilter()._id;
      const existing = await mongoose.model("Projects").findOne({ slug, _id: { $ne: docId } });
      if (!existing) break;
      slug = `${base}-${counter}`;
      counter++;
    }
    update.slug = slug;
  }
});

const Projects = mongoose.model("Projects", projectsSchema);
export default Projects;
