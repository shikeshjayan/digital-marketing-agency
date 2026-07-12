import BrandSettings from "../models/brandSettings.model.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { parseJsonField, parseJsonObject } from "../utils/helpers.js";

const DEFAULT_BRAND = {
  brand: {
    name: "CrawlCrown",
    logo: "/crown-99.png",
    tagline: "Full-service digital marketing agency with design, development, and performance growth.",
  },
  socialLinks: [
    { platform: "Facebook", url: "https://facebook.com/crawlcrown", icon: "faFacebookF" },
    { platform: "Instagram", url: "https://instagram.com/crawlcrown", icon: "faInstagram" },
    { platform: "LinkedIn", url: "https://linkedin.com/company/crawlcrown", icon: "faLinkedinIn" },
    { platform: "YouTube", url: "https://youtube.com/@crawlcrown", icon: "faYoutube" },
  ],
  contact: {
    phone: "+91 8891212323",
    email: "crawlcrown@gmail.com",
    address: "Ernakulam, Kochi, Kerala, India",
    whatsapp: "",
    working_hours: "Mon – Fri: 10:00 AM – 6:00 PM",
    location: "Ernakulam, Kochi, Kerala, India",
  },
  companyLinks: [
    { label: "About", path: "/about" },
    { label: "Projects", path: "/projects" },
    { label: "Terms & Conditions", path: "/terms" },
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Internal Data Policies", path: "/internal-data-policies" },
  ],
};

export const getBrandSettings = asyncHandler(async (req, res) => {
  let doc = await BrandSettings.findOne();
  if (!doc) {
    doc = await BrandSettings.create(DEFAULT_BRAND);
  }
  res.status(200).json({ success: true, data: doc });
});

export const updateBrandSettings = asyncHandler(async (req, res) => {
  const brand = parseJsonObject(req.body.brand);
  const socialLinks = parseJsonField(req.body.socialLinks);
  const contact = parseJsonObject(req.body.contact);
  const companyLinks = parseJsonField(req.body.companyLinks);

  const hasBrandKeys = brand && Object.keys(brand).length > 0;
  const hasContactKeys = contact && Object.keys(contact).length > 0;
  if (!hasBrandKeys && !socialLinks?.length && !hasContactKeys && !companyLinks?.length) {
    return res.status(400).json({ success: false, message: "At least one brand field is required" });
  }

  let logo = req.files?.brand_logo?.[0]?.url ?? req.body.brand_logo;
  if (!logo) logo = "/crown-99.png";

  let doc = await BrandSettings.findOne();
  if (!doc) {
    doc = new BrandSettings(DEFAULT_BRAND);
  }

  if (brand) doc.brand = { ...(doc.brand.toObject?.() ?? doc.brand), ...brand, logo };
  if (socialLinks) doc.socialLinks = socialLinks;
  if (contact) {
    doc.contact = { ...(doc.contact.toObject?.() ?? doc.contact), ...contact };
    doc.markModified("contact");
  }
  if (companyLinks) doc.companyLinks = companyLinks;

  await doc.save();

  res.status(200).json({
    success: true,
    message: "Brand settings updated successfully",
    data: doc,
  });
});

export const seedBrandSettings = asyncHandler(async (req, res) => {
  await BrandSettings.deleteMany({});
  const doc = await BrandSettings.create(DEFAULT_BRAND);
  res.status(201).json({
    success: true,
    message: "Default brand settings seeded successfully",
    data: doc,
  });
});
