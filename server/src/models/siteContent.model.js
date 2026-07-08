import mongoose from "mongoose";

const siteContentSchema = new mongoose.Schema(
  {
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },
  },
  { timestamps: true },
);

const SiteContent = mongoose.model("SiteContent", siteContentSchema);
export default SiteContent;
