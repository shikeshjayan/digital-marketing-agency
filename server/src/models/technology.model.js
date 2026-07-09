// Defines the Technology collection structure
import mongoose from "mongoose";
import { generateSlug } from "../utils/helpers.js";

const technologySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Technology name is required"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    iconType: {
      type: String,
      enum: ["fontawesome", "image"],
      default: "fontawesome",
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

technologySchema.pre("save", async function () {
  if (!this.isModified("name")) return;

  let base = generateSlug(this.name);
  let slug = base;
  let counter = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await mongoose.model("Technology").findOne({ slug, _id: { $ne: this._id } });
    if (!existing) break;
    slug = `${base}-${counter}`;
    counter++;
  }

  this.slug = slug;
});

technologySchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  if (update.name) {
    let base = generateSlug(update.name);
    let slug = base;
    let counter = 1;
    while (true) {
      const docId = this.getFilter()._id;
      const existing = await mongoose.model("Technology").findOne({ slug, _id: { $ne: docId } });
      if (!existing) break;
      slug = `${base}-${counter}`;
      counter++;
    }
    update.slug = slug;
  }
});

technologySchema.index({ display_order: 1, createdAt: -1 });
const Technology = mongoose.model("Technology", technologySchema);
export default Technology;
