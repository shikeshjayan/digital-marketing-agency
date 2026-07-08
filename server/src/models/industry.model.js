// Defines the Industry collection structure
import mongoose from "mongoose";

function generateSlug(name) {
  return String(name ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const industrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Industry name is required"],
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
    display_order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true },
);

industrySchema.pre("save", async function () {
  if (!this.isModified("name")) return;

  let base = generateSlug(this.name);
  let slug = base;
  let counter = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await mongoose.model("Industry").findOne({ slug, _id: { $ne: this._id } });
    if (!existing) break;
    slug = `${base}-${counter}`;
    counter++;
  }

  this.slug = slug;
});

const Industry = mongoose.model("Industry", industrySchema);
export default Industry;
