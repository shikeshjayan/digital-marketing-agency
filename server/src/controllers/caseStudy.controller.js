import CaseStudy from "../models/caseStudy.model.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { parseJsonField, parseJsonObject, escapeRegex } from "../utils/helpers.js";

// Create a new case study (admin only)
export const createCaseStudy = asyncHandler(async (req, res) => {
  const {
    title, overview, challenge, strategy, solution,
    status, featured,
    timeline_started_at, timeline_completed_at, timeline_duration,
    client_testimonial_quote, client_testimonial_name,
    client_testimonial_designation, client_testimonial_company,
    seo_meta_title, seo_meta_description,
  } = req.body;

  const hero_image = req.files?.hero_image?.[0]?.url ?? req.body.hero_image;
  const galleryFiles = req.files?.gallery || [];
  const galleryUrls = galleryFiles.map((f) => f.url).filter(Boolean);

  const project = req.body.project || null;
  const objectives = parseJsonField(req.body.objectives);
  const deliverables = parseJsonField(req.body.deliverables);
  const development_process = parseJsonField(req.body.development_process);
  const challenges_and_solutions = parseJsonField(req.body.challenges_and_solutions);
  const results = parseJsonField(req.body.results);
  const seo = parseJsonObject(req.body.seo);

  if (!title || !overview || !challenge || !solution || !hero_image) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  if (!project) {
    return res.status(400).json({ success: false, message: "Project reference is required" });
  }

  const existing = await CaseStudy.findOne({ title });
  if (existing) {
    return res.status(409).json({ success: false, message: "Case study already exists" });
  }

  const caseStudy = await CaseStudy.create({
    title,
    project,
    hero_image,
    overview,
    challenge,
    objectives,
    strategy,
    solution,
    deliverables,
    timeline: {
      duration: timeline_duration || "",
      started_at: timeline_started_at || undefined,
      completed_at: timeline_completed_at || undefined,
    },
    development_process,
    challenges_and_solutions,
    results,
    gallery: galleryUrls,
    client_testimonial: {
      quote: client_testimonial_quote || "",
      client_name: client_testimonial_name || "",
      designation: client_testimonial_designation || "",
      company: client_testimonial_company || "",
    },
    featured: featured === "true" || featured === true,
    seo,
    status,
  });

  res.status(201).json({
    success: true,
    message: "Case study created successfully",
    data: caseStudy,
  });
});

// Get all published case studies (public)
export const getAllCaseStudies = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, featured } = req.query;

  const filter = { status: "Published" };
  if (featured === "true") filter.featured = true;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await CaseStudy.countDocuments(filter);
  const caseStudies = await CaseStudy.find(filter)
    .populate("project", "project_name slug thumbnail short_description")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: caseStudies.length,
    data: caseStudies,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

// Get a single case study by slug (public)
export const getCaseStudyBySlug = asyncHandler(async (req, res) => {
  const caseStudy = await CaseStudy.findOne({ slug: req.params.slug, status: "Published" })
    .populate("project", "project_name slug thumbnail short_description description client technologies industries project_url github_url");

  if (!caseStudy) {
    return res.status(404).json({ success: false, message: "Case study not found" });
  }
  res.status(200).json({ success: true, data: caseStudy });
});

// Get a single case study by ID (admin)
export const getCaseStudyById = asyncHandler(async (req, res) => {
  const caseStudy = await CaseStudy.findById(req.params.id)
    .populate("project", "project_name slug thumbnail");

  if (!caseStudy) {
    return res.status(404).json({ success: false, message: "Case study not found" });
  }
  res.status(200).json({ success: true, data: caseStudy });
});

// Update a case study (admin only)
export const updateCaseStudy = asyncHandler(async (req, res) => {
  const {
    title, overview, challenge, strategy, solution,
    status, featured, project,
    timeline_started_at, timeline_completed_at, timeline_duration,
    client_testimonial_quote, client_testimonial_name,
    client_testimonial_designation, client_testimonial_company,
  } = req.body;

  const update = {
    title,
    overview,
    challenge,
    strategy,
    solution,
    featured: featured === "true" || featured === true,
    status,
  };

  if (project) update.project = project;

  if (req.body.objectives) update.objectives = parseJsonField(req.body.objectives);
  if (req.body.deliverables) update.deliverables = parseJsonField(req.body.deliverables);
  if (req.body.development_process) update.development_process = parseJsonField(req.body.development_process);
  if (req.body.challenges_and_solutions) update.challenges_and_solutions = parseJsonField(req.body.challenges_and_solutions);
  if (req.body.results) update.results = parseJsonField(req.body.results);

  update.timeline = {
    duration: timeline_duration || "",
    started_at: timeline_started_at || undefined,
    completed_at: timeline_completed_at || undefined,
  };

  update.client_testimonial = {
    quote: client_testimonial_quote || "",
    client_name: client_testimonial_name || "",
    designation: client_testimonial_designation || "",
    company: client_testimonial_company || "",
  };

  if (req.body.seo) update.seo = parseJsonObject(req.body.seo);

  // Handle hero image upload
  if (req.files?.hero_image?.[0]?.url) {
    update.hero_image = req.files.hero_image[0].url;
  } else if (req.body.hero_image) {
    update.hero_image = req.body.hero_image;
  }

  // Handle gallery upload
  if (req.files?.gallery) {
    const newGalleryUrls = req.files.gallery.map((f) => f.url).filter(Boolean);
    if (newGalleryUrls.length > 0) {
      update.gallery = newGalleryUrls;
    }
  }

  const caseStudy = await CaseStudy.findByIdAndUpdate(
    req.params.id,
    update,
    { new: true, runValidators: true },
  );
  if (!caseStudy) {
    return res.status(404).json({ success: false, message: "Case study not found" });
  }
  res.status(200).json({
    success: true,
    message: "Case study updated successfully",
    data: caseStudy,
  });
});

// Delete a case study by ID (admin only)
export const deleteCaseStudy = asyncHandler(async (req, res) => {
  const caseStudy = await CaseStudy.findByIdAndDelete(req.params.id);
  if (!caseStudy) {
    return res.status(404).json({ success: false, message: "Case study not found" });
  }
  res.status(200).json({ success: true, message: "Case study deleted successfully" });
});

// Delete all case studies (admin only)
export const deleteAllCaseStudies = asyncHandler(async (req, res) => {
  const result = await CaseStudy.deleteMany({});
  res.status(200).json({
    success: true,
    message: `${result.deletedCount} case study(ies) deleted successfully.`,
  });
});

// Get published case studies for a specific service (public)
export const getCaseStudiesByService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const caseStudies = await CaseStudy.find({ status: "Published" })
    .populate({
      path: "project",
      match: { services: serviceId, status: "Published" },
      select: "project_name slug thumbnail short_description",
    })
    .sort({ createdAt: -1 });

  const filtered = caseStudies.filter((cs) => cs.project !== null);

  res.status(200).json({ success: true, data: filtered });
});

// Get all case studies including drafts for admin panel
export const getAllAdminCaseStudies = asyncHandler(async (req, res) => {
  const { search, status, featured, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (search) {
    filter.title = { $regex: escapeRegex(search), $options: "i" };
  }
  if (status) {
    filter.status = status;
  }
  if (featured === "true") {
    filter.featured = true;
  } else if (featured === "false") {
    filter.featured = false;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await CaseStudy.countDocuments(filter);
  const caseStudies = await CaseStudy.find(filter)
    .populate("project", "project_name slug thumbnail")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: caseStudies.length,
    data: caseStudies,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});
