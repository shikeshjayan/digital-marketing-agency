import Services from "../models/services.model.js";
import Projects from "../models/projects.model.js";
import Review from "../models/reviews.model.js";
import CaseStudy from "../models/caseStudy.model.js";
import Industry from "../models/industry.model.js";
import Technology from "../models/technology.model.js";
import FAQ from "../models/faq.model.js";
import SiteContent from "../models/siteContent.model.js";
import BrandSettings from "../models/brandSettings.model.js";
import asyncHandler from "../middleware/asyncHandler.js";

const mapReviews = (reviews) =>
  (reviews || []).map((r) => ({
    user_avatar:
      r.user_avatar && !r.user_avatar.includes("data:image/svg+xml")
        ? r.user_avatar
        : null,
    name: r.name,
    location: r.location,
    rating: r.rating,
    review_text: r.review_text,
  }));

export const getPageServices = asyncHandler(async (req, res) => {
  const [
    services,
    reviews,
    caseStudies,
    industries,
    technologies,
    faqs,
    siteContentDoc,
  ] = await Promise.all([
    Services.find({ status: "Active" })
      .sort({ display_order: 1, createdAt: -1 })
      .lean(),
    Review.find({ status: "Approved" })
      .sort({ createdAt: -1 })
      .lean(),
    CaseStudy.find({ status: "Published", featured: true })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean(),
    Industry.find({ status: "Active" })
      .sort({ display_order: 1, createdAt: -1 })
      .lean(),
    Technology.find({ status: "Active" })
      .sort({ display_order: 1, createdAt: -1 })
      .lean(),
    FAQ.find({ status: "Active" })
      .sort({ display_order: 1, createdAt: -1 })
      .lean(),
    SiteContent.findOne().lean(),
  ]);

  res.status(200).json({
    success: true,
    data: {
      services: services || [],
      reviews: mapReviews(reviews),
      caseStudies: caseStudies || [],
      industries: industries || [],
      technologies: technologies || [],
      faqs: faqs || [],
      siteContent: siteContentDoc?.content || null,
    },
  });
});

export const getPageHome = asyncHandler(async (req, res) => {
  const [services, reviews, siteContentDoc] = await Promise.all([
    Services.find({ status: "Active" })
      .sort({ display_order: 1, createdAt: -1 })
      .lean(),
    Review.find({ status: "Approved" }).sort({ createdAt: -1 }).lean(),
    SiteContent.findOne().lean(),
  ]);

  res.status(200).json({
    success: true,
    data: {
      services: services || [],
      reviews: mapReviews(reviews),
      siteContent: siteContentDoc?.content || null,
    },
  });
});

export const getPageAbout = asyncHandler(async (req, res) => {
  const [reviews, siteContentDoc] = await Promise.all([
    Review.find({ status: "Approved" }).sort({ createdAt: -1 }).lean(),
    SiteContent.findOne().lean(),
  ]);

  res.status(200).json({
    success: true,
    data: {
      reviews: mapReviews(reviews),
      siteContent: siteContentDoc?.content || null,
    },
  });
});

export const getPageTestimonials = asyncHandler(async (req, res) => {
  const [reviews, siteContentDoc, brandDoc] = await Promise.all([
    Review.find({ status: "Approved" }).sort({ createdAt: -1 }).lean(),
    SiteContent.findOne().lean(),
    BrandSettings.findOne().lean(),
  ]);

  res.status(200).json({
    success: true,
    data: {
      reviews: mapReviews(reviews),
      siteContent: siteContentDoc?.content || null,
      brandSettings: brandDoc || null,
    },
  });
});

export const getPageContact = asyncHandler(async (req, res) => {
  const [services, brandDoc] = await Promise.all([
    Services.find({ status: "Active" })
      .sort({ display_order: 1, createdAt: -1 })
      .lean(),
    BrandSettings.findOne().lean(),
  ]);

  res.status(200).json({
    success: true,
    data: {
      services: services || [],
      brandSettings: brandDoc || null,
    },
  });
});

export const getPageProjects = asyncHandler(async (req, res) => {
  const { service, page = 1, limit = 10 } = req.query;

  const projectFilter = { status: "Published" };
  if (service && service !== "All") {
    projectFilter.services = service;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [projects, total, reviews, siteContentDoc, services, caseStudies] =
    await Promise.all([
      Projects.find(projectFilter)
        .populate("services", "service_name slug")
        .populate("technologies", "name slug")
        .populate("industries", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Projects.countDocuments(projectFilter),
      Review.find({ status: "Approved" }).sort({ createdAt: -1 }).lean(),
      SiteContent.findOne().lean(),
      Services.find({ status: "Active" })
        .sort({ display_order: 1, createdAt: -1 })
        .lean(),
      CaseStudy.find({ status: "Published", featured: true })
        .sort({ createdAt: -1 })
        .limit(3)
        .lean(),
    ]);

  res.status(200).json({
    success: true,
    data: {
      projects: projects || [],
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
      reviews: mapReviews(reviews),
      siteContent: siteContentDoc?.content || null,
      services: services || [],
      caseStudies: caseStudies || [],
    },
  });
});
