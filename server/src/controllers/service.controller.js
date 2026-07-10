// Handles everything related to services (CRUD + public listing)
import Services from "../models/services.model.js";
import Projects from "../models/projects.model.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { parseJsonField, parseJsonObject, escapeRegex } from "../utils/helpers.js";

// Create a new service (admin only)
export const createService = asyncHandler(async (req, res) => {
  const {
    service_name,
    short_description,
    description,
    status,
    featured,
    display_order,
  } = req.body;

  const hero_image = req.files?.hero_image?.[0]?.url ?? req.body.hero_image;
  const icon = req.files?.icon?.[0]?.url ?? req.body.icon ?? "";
  const deliverables = parseJsonField(req.body.deliverables);
  const benefits = parseJsonField(req.body.benefits);
  const seo = parseJsonObject(req.body.seo);

  if (!service_name || !short_description || !description || !hero_image) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const existing = await Services.findOne({ service_name });
  if (existing) {
    return res.status(409).json({ success: false, message: "Service already exists" });
  }

  const service = await Services.create({
    service_name,
    short_description,
    description,
    hero_image,
    icon,
    deliverables,
    benefits,
    featured: featured === "true" || featured === true,
    display_order: display_order ? Number(display_order) : 0,
    seo,
    status,
  });

  res.status(201).json({
    success: true,
    message: "Service created successfully",
    data: service,
  });
});

// Get active services with search, filtering, and pagination (public)
export const getAllServices = asyncHandler(async (req, res) => {
  const { search, featured, page = 1, limit = 10 } = req.query;

  const filter = { status: "Active" };
  if (search) {
    filter.service_name = { $regex: escapeRegex(search), $options: "i" };
  }
  if (featured === "true") {
    filter.featured = true;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Services.countDocuments(filter);
  const services = await Services.find(filter)
    .sort({ display_order: 1, createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: services.length,
    data: services,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

// Get a single service by slug (public)
export const getServiceBySlug = asyncHandler(async (req, res) => {
  const service = await Services.findOne({ slug: req.params.slug, status: "Active" });
  if (!service) {
    return res.status(404).json({ success: false, message: "Service not found" });
  }

  const projects = await Projects.find({ services: service._id, status: "Published" })
    .populate("technologies", "name slug")
    .populate("industries", "name slug")
    .select("project_name slug thumbnail short_description featured");

  res.status(200).json({ success: true, data: { ...service.toObject(), projects } });
});

// Get a single service by ID (public — used for related services)
export const getServiceById = asyncHandler(async (req, res) => {
  const service = await Services.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ success: false, message: "Service not found" });
  }

  const projects = await Projects.find({ services: service._id, status: "Published" })
    .populate("technologies", "name slug")
    .populate("industries", "name slug")
    .select("project_name slug thumbnail short_description featured");

  res.status(200).json({ success: true, data: { ...service.toObject(), projects } });
});

// Update an existing service (admin only)
export const updateService = asyncHandler(async (req, res) => {
  const {
    service_name,
    short_description,
    description,
    status,
    featured,
    display_order,
  } = req.body;

  const deliverables = parseJsonField(req.body.deliverables);
  const benefits = parseJsonField(req.body.benefits);
  const seo = parseJsonObject(req.body.seo);

  const update = {
    service_name,
    short_description,
    description,
    status,
    deliverables,
    benefits,
    seo,
    featured: featured === "true" || featured === true,
    display_order: display_order ? Number(display_order) : 0,
  };

  if (req.files?.hero_image?.[0]?.url) {
    update.hero_image = req.files.hero_image[0].url;
  } else if (req.body.hero_image) {
    update.hero_image = req.body.hero_image;
  }

  if (req.files?.icon?.[0]?.url) {
    update.icon = req.files.icon[0].url;
  } else if (req.body.icon !== undefined) {
    update.icon = req.body.icon;
  }

  const service = await Services.findByIdAndUpdate(
    req.params.id,
    update,
    { new: true, runValidators: true },
  );
  if (!service) {
    return res.status(404).json({ success: false, message: "Service not found" });
  }
  res.status(200).json({
    success: true,
    message: "Service updated successfully",
    data: service,
  });
});

// Delete a service by its ID (admin only)
export const deleteService = asyncHandler(async (req, res) => {
  const service = await Services.findByIdAndDelete(req.params.id);
  if (!service) {
    return res.status(404).json({ success: false, message: "Service not found" });
  }

  // Clean orphaned references from projects
  await Projects.updateMany(
    { services: req.params.id },
    { $pull: { services: req.params.id } },
  );

  res.status(200).json({ success: true, message: "Service deleted successfully" });
});

// Delete all services (admin only)
export const deleteAllServices = asyncHandler(async (req, res) => {
  const result = await Services.deleteMany({});

  // Clean all service references from projects
  await Projects.updateMany({}, { $set: { services: [] } });

  res.status(200).json({
    success: true,
    message: `${result.deletedCount} service(s) deleted successfully.`,
  });
});

// Get related services (public — random active services excluding current)
export const getRelatedServices = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { limit = 3 } = req.query;

  const currentService = await Services.findById(id);
  if (!currentService) {
    return res.status(404).json({ success: false, message: "Service not found" });
  }

  const related = await Services.find({
    status: "Active",
    _id: { $ne: id },
  })
    .sort({ display_order: 1 })
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: related.length,
    data: related,
  });
});

// Get all services (including inactive ones) with filters for admin panel
export const getAllAdminServices = asyncHandler(async (req, res) => {
  const { search, status, featured, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (search) {
    filter.service_name = { $regex: escapeRegex(search), $options: "i" };
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
  const total = await Services.countDocuments(filter);
  const services = await Services.find(filter)
    .sort({ display_order: 1, createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: services.length,
    data: services,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});
