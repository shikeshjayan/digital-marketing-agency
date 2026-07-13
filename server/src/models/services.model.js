// Defines the Services collection structure
import mongoose from "mongoose";
import { generateSlug } from "../utils/helpers.js";

const servicesSchema = new mongoose.Schema(
  {
    service_name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
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
    hero_image: {
      type: String,
      required: [true, "Hero image is required"],
    },
    icon: {
      type: String,
      default: "",
    },
    deliverables: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    display_order: {
      type: Number,
      default: 0,
    },
    seo: {
      meta_title: { type: String, trim: true, default: "" },
      meta_description: { type: String, trim: true, default: "" },
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true },
);

servicesSchema.index({ status: 1, display_order: 1, createdAt: -1 });

// Auto-generate slug from service_name before saving
servicesSchema.pre("save", async function () {
  if (!this.isModified("service_name")) return;

  let base = generateSlug(this.service_name);
  let slug = base;
  let counter = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await mongoose.model("Services").findOne({ slug, _id: { $ne: this._id } });
    if (!existing) break;
    slug = `${base}-${counter}`;
    counter++;
  }

  this.slug = slug;
});

// Also regenerate slug when updated via findOneAndUpdate
servicesSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  if (update.service_name) {
    let base = generateSlug(update.service_name);
    let slug = base;
    let counter = 1;
    while (true) {
      const docId = this.getFilter()._id;
      const existing = await mongoose.model("Services").findOne({ slug, _id: { $ne: docId } });
      if (!existing) break;
      slug = `${base}-${counter}`;
      counter++;
    }
    update.slug = slug;
  }
});

const Services = mongoose.model("Services", servicesSchema);
export default Services;
