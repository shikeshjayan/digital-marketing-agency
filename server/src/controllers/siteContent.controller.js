import SiteContent from "../models/siteContent.model.js";
import asyncHandler from "../middleware/asyncHandler.js";

const DEFAULT_CONTENT = {
  technologyStackItems: [
    { name: "WordPress", code: "WP" },
    { name: "Angular", code: "AG" },
    { name: "HTML5", code: "H5" },
    { name: "CSS3", code: "C3" },
    { name: "Bootstrap", code: "BS" },
    { name: "jQuery", code: "JQ" },
    { name: "PHP", code: "PH" },
  ],
  trustMarqueeLogos: [
    "HR Consultancy", "Selfy LinguaTrainer", "Rising Moon",
    "StepUp", "Tymos", "BrightPath", "NovaTech",
    "Zenith Solutions", "CloudBridge", "PixelCraft",
    "SwiftWave", "BlueVista", "IronPeak", "GreenLeaf", "SkyPulse",
  ],
  companyStats: [
    { key: "yearsExperience", target: 8, suffix: "+", label: "Years of Experience" },
    { key: "projectsCompleted", target: 500, suffix: "+", label: "Projects Completed" },
    { key: "satisfiedClients", target: 500, suffix: "+", label: "Satisfied Clients" },
    { key: "clientRetention", target: 98, suffix: "%", label: "Client Retention" },
    { key: "teamMembers", target: 25, suffix: "+", label: "Team Members" },
    { key: "averageRating", target: 4.9, suffix: "", label: "Average Rating" },
    { key: "averageRoi", target: 3, suffix: "x", label: "Average ROI" },
    { key: "support247", target: 24, suffix: "/7", label: "Support Available" },
    { key: "onTimeDelivery", target: 95, suffix: "%", label: "On-Time Delivery" },
    { key: "countriesServed", target: 10, suffix: "+", label: "Countries Served" },
    { key: "industryAwards", target: 15, suffix: "+", label: "Industry Awards" },
    { key: "uptimeGuaranteed", target: 99, suffix: "%", label: "Uptime Guaranteed" },
    { key: "responseTime", target: 24, suffix: "h", label: "Response Time" },
    { key: "freeConsultation", target: 0, suffix: "Free", label: "Consultation" },
    { key: "satisfactionGoal", target: 100, suffix: "%", label: "Satisfaction Goal" },
  ],
};

export const getSiteContent = asyncHandler(async (req, res) => {
  let doc = await SiteContent.findOne();
  if (!doc) {
    doc = await SiteContent.create({ content: DEFAULT_CONTENT });
  }
  res.status(200).json({ success: true, data: doc.content });
});

export const updateSiteContent = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content || typeof content !== "object") {
    return res.status(400).json({ success: false, message: "Content object is required" });
  }

  let doc = await SiteContent.findOne();
  if (!doc) {
    doc = await SiteContent.create({ content });
  } else {
    doc.content = content;
    await doc.save();
  }

  res.status(200).json({
    success: true,
    message: "Site content updated successfully",
    data: doc.content,
  });
});

export const seedSiteContent = asyncHandler(async (req, res) => {
  await SiteContent.deleteMany({});
  const doc = await SiteContent.create({ content: DEFAULT_CONTENT });
  res.status(201).json({
    success: true,
    message: "Default site content seeded successfully",
    data: doc.content,
  });
});
