// Handles everything related to projects (CRUD + public listing)
import Projects from "../models/projects.model.js";
import CaseStudy from "../models/caseStudy.model.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { parseJsonField, parseJsonObject, escapeRegex } from "../utils/helpers.js";

// Create a new project (admin only)
export const createProject = asyncHandler(async (req, res) => {
  const {
    project_name, short_description, description, status, featured,
    project_url, github_url, completion_date,
  } = req.body;

  const thumbnail = req.files?.thumbnail?.[0]?.url ?? req.body.thumbnail;
  const galleryFiles = req.files?.gallery || [];
  const galleryUrls = galleryFiles.map((f) => f.url).filter(Boolean);

  const services = parseJsonField(req.body.services);
  const technologies = parseJsonField(req.body.technologies);
  const industries = parseJsonField(req.body.industries);
  const team = parseJsonField(req.body.team);
  const client = parseJsonObject(req.body.client);
  const seo = parseJsonObject(req.body.seo);

  if (!project_name || !short_description || !description || !thumbnail) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  if (!services || services.length === 0) {
    return res.status(400).json({ success: false, message: "At least one service is required" });
  }

  const existing = await Projects.findOne({ project_name });
  if (existing) {
    return res.status(409).json({ success: false, message: "Project already exists" });
  }

  const project = await Projects.create({
    project_name,
    short_description,
    description,
    thumbnail,
    gallery: galleryUrls,
    services,
    technologies,
    industries,
    team,
    client,
    project_url,
    github_url,
    completion_date: completion_date || undefined,
    featured: featured === "true" || featured === true,
    seo,
    status,
  });

  res.status(201).json({
    success: true,
    message: "Project created successfully",
    data: project,
  });
});

// Get all published projects with optional service filter (public)
export const getAllProjects = asyncHandler(async (req, res) => {
  const { service, page = 1, limit = 10 } = req.query;

  const filter = { status: "Published" };
  if (service && service !== "All") {
    filter.services = service;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Projects.countDocuments(filter);
  const projects = await Projects.find(filter)
    .populate("services", "service_name slug")
    .populate("technologies", "name slug")
    .populate("industries", "name slug")
    .populate("team", "name designation photo")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

// Get a single project by ID (public)
export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Projects.findById(req.params.id)
    .populate("services", "service_name slug short_description")
    .populate("technologies", "name slug")
    .populate("industries", "name slug icon description")
    .populate("team", "name designation photo linkedin email");

  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  const caseStudy = await CaseStudy.findOne({ project: project._id, status: "Published" })
    .select("title slug hero_image overview challenge solution featured results");

  res.status(200).json({ success: true, data: { ...project.toObject(), caseStudy: caseStudy || null } });
});

// Get a single project by slug (public)
export const getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Projects.findOne({ slug: req.params.slug, status: "Published" })
    .populate("services", "service_name slug short_description")
    .populate("technologies", "name slug")
    .populate("industries", "name slug icon description")
    .populate("team", "name designation photo linkedin email");

  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  const caseStudy = await CaseStudy.findOne({ project: project._id, status: "Published" })
    .select("title slug hero_image overview challenge solution featured results");

  res.status(200).json({ success: true, data: { ...project.toObject(), caseStudy: caseStudy || null } });
});

// Update an existing project (admin only)
export const updateProject = asyncHandler(async (req, res) => {
  const {
    project_name, short_description, description, status, featured,
    project_url, github_url, completion_date,
  } = req.body;

  const update = {
    project_name,
    short_description,
    description,
    project_url,
    github_url,
    completion_date: completion_date || undefined,
    featured: featured === "true" || featured === true,
    status,
  };

  // Parse array fields from FormData
  if (req.body.services) update.services = parseJsonField(req.body.services);
  if (req.body.technologies) update.technologies = parseJsonField(req.body.technologies);
  if (req.body.industries) update.industries = parseJsonField(req.body.industries);
  if (req.body.team) update.team = parseJsonField(req.body.team);
  if (req.body.client) update.client = parseJsonObject(req.body.client);
  if (req.body.seo) update.seo = parseJsonObject(req.body.seo);

  // Handle thumbnail upload
  if (req.files?.thumbnail?.[0]?.url) {
    update.thumbnail = req.files.thumbnail[0].url;
  } else if (req.body.thumbnail) {
    update.thumbnail = req.body.thumbnail;
  }

  // Handle gallery upload
  if (req.files?.gallery) {
    const newGalleryUrls = req.files.gallery.map((f) => f.url).filter(Boolean);
    if (newGalleryUrls.length > 0) {
      update.gallery = newGalleryUrls;
    }
  }

  const project = await Projects.findByIdAndUpdate(
    req.params.id,
    update,
    { new: true, runValidators: true },
  );
  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }
  res.status(200).json({
    success: true,
    message: "Project updated successfully",
    data: project,
  });
});

// Delete a project by its ID (admin only)
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Projects.findByIdAndDelete(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  // Cascade delete the related case study
  await CaseStudy.deleteOne({ project: req.params.id });

  res.status(200).json({ success: true, message: "Project deleted successfully" });
});

// Delete all projects (admin only)
export const deleteAllProjects = asyncHandler(async (req, res) => {
  const result = await Projects.deleteMany({});

  // Cascade delete all case studies
  await CaseStudy.deleteMany({});

  res.status(200).json({
    success: true,
    message: `${result.deletedCount} project(s) deleted successfully.`,
  });
});

// Get all projects including drafts with filters for admin panel
export const getAllAdminProjects = asyncHandler(async (req, res) => {
  const { search, status, featured, service, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (search) {
    filter.project_name = { $regex: escapeRegex(search), $options: "i" };
  }
  if (status) {
    filter.status = status;
  }
  if (featured === "true") {
    filter.featured = true;
  } else if (featured === "false") {
    filter.featured = false;
  }
  if (service) {
    filter.services = service;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Projects.countDocuments(filter);
  const projects = await Projects.find(filter)
    .populate("services", "service_name")
    .populate("technologies", "name")
    .populate("industries", "name")
    .populate("team", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});
