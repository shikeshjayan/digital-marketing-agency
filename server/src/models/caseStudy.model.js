import mongoose from "mongoose";
import { generateSlug } from "../utils/helpers.js";

const caseStudySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projects",
      required: [true, "Project is required"],
      },
    hero_image: {
      type: String,
      required: [true, "Hero image is required"],
    },
    overview: {
      type: String,
      required: [true, "Overview is required"],
      trim: true,
    },
    challenge: {
      type: String,
      required: [true, "Challenge is required"],
      trim: true,
    },
    objectives: [
      {
        type: String,
        trim: true,
      },
    ],
    strategy: {
      type: String,
      trim: true,
      default: "",
    },
    solution: {
      type: String,
      required: [true, "Solution is required"],
      trim: true,
    },
    deliverables: [
      {
        type: String,
        trim: true,
      },
    ],
    timeline: {
      duration: { type: String, default: "" },
      started_at: { type: Date },
      completed_at: { type: Date },
    },
    development_process: [
      {
        title: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    ],
    challenges_and_solutions: [
      {
        challenge: { type: String, default: "" },
        solution: { type: String, default: "" },
      },
    ],
    results: [
      {
        title: { type: String, default: "" },
        value: { type: String, default: "" },
      },
    ],
    gallery: [
      {
        type: String,
      },
    ],
    client_testimonial: {
      quote: { type: String, default: "" },
      client_name: { type: String, default: "" },
      designation: { type: String, default: "" },
      company: { type: String, default: "" },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    seo: {
      meta_title: { type: String, trim: true, default: "" },
      meta_description: { type: String, trim: true, default: "" },
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

caseStudySchema.pre("save", async function () {
  if (!this.isModified("title")) return;

  let base = generateSlug(this.title);
  let slug = base;
  let counter = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await mongoose.model("CaseStudy").findOne({ slug, _id: { $ne: this._id } });
    if (!existing) break;
    slug = `${base}-${counter}`;
    counter++;
  }

  this.slug = slug;
});

// Also regenerate slug when updated via findOneAndUpdate
caseStudySchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  if (update.title) {
    let base = generateSlug(update.title);
    let slug = base;
    let counter = 1;
    while (true) {
      const docId = this.getFilter()._id;
      const existing = await mongoose.model("CaseStudy").findOne({ slug, _id: { $ne: docId } });
      if (!existing) break;
      slug = `${base}-${counter}`;
      counter++;
    }
    update.slug = slug;
  }
});

const CaseStudy = mongoose.model("CaseStudy", caseStudySchema);
export default CaseStudy;
