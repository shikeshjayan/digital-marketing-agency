import mongoose from "mongoose";

const socialLinkSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String, required: true },
}, { _id: false });

const companyLinkSchema = new mongoose.Schema({
  label: { type: String, required: true },
  path: { type: String, required: true },
}, { _id: false });

const brandSchema = new mongoose.Schema({
  name: { type: String, default: "CrawlCrown" },
  logo: { type: String, default: "/crown-99.png" },
  tagline: { type: String, default: "Full-service digital marketing agency with design, development, and performance growth." },
}, { _id: false });

const contactSchema = new mongoose.Schema({
  phone: { type: String, default: "+91 8891212323" },
  email: { type: String, default: "crowlcrown@gmail.com" },
  address: { type: String, default: "Ernakulam, Kochi, Kerala, India" },
}, { _id: false });

const brandSettingsSchema = new mongoose.Schema({
  brand: { type: brandSchema, default: () => ({}) },
  socialLinks: { type: [socialLinkSchema], default: [] },
  contact: { type: contactSchema, default: () => ({}) },
  companyLinks: { type: [companyLinkSchema], default: [] },
}, { timestamps: true });

const BrandSettings = mongoose.model("BrandSettings", brandSettingsSchema);
export default BrandSettings;
