// Handles everything related to services (CRUD + public listing)
import Services from "../models/services.model.js";
import asyncHandler from "../middleware/asyncHandler.js";

const parseJsonField = (value, fallback = []) => {
  if (!value) return fallback;
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const parseJsonObject = (value, fallback = {}) => {
  if (!value) return fallback;
  try {
    return typeof value === "string" ? JSON.parse(value) : value;
  } catch {
    return fallback;
  }
};

// Create a new service (admin only)
export const createService = asyncHandler(async (req, res) => {
  const { service_name, short_description, description, status, category } = req.body;
  const image = req.files?.image?.[0]?.url ?? req.body.image;
  const offerings = parseJsonField(req.body.offerings);
  const benefits = parseJsonField(req.body.benefits);
  const target_audience = parseJsonField(req.body.target_audience);
  const faq = parseJsonField(req.body.faq);
  const case_study = parseJsonObject(req.body.case_study);
  const clients = parseJsonField(req.body.clients).map((c, i) => ({
    ...c,
    avatar: req.clientAvatarUrls?.[String(i)] ?? c.avatar ?? "",
  }));

  // Validate required fields
  if (!service_name || !short_description || !description || !image) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  // Prevent duplicate service names
  const existing = await Services.findOne({ service_name });
  if (existing) {
    return res.status(409).json({ success: false, message: "Service already exists" });
  }

  const service = await Services.create({
    service_name,
    short_description,
    description,
    image,
    category,
    offerings,
    benefits,
    target_audience,
    faq,
    case_study,
    clients,
    status,
  });

  res.status(201).json({
    success: true,
    message: "Service created successfully",
    data: service,
  });
});

// Get active services with search and pagination (public)
export const getAllServices = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;

  const filter = { status: "Active" };
  if (search) {
    filter.service_name = { $regex: search, $options: "i" };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Services.countDocuments(filter);
  const services = await Services.find(filter).skip(skip).limit(Number(limit));

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

// Get a single service by its ID (public)
export const getServiceById = asyncHandler(async (req, res) => {
  const service = await Services.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ success: false, message: "Service not found" });
  }
  res.status(200).json({ success: true, data: service });
});

// Update an existing service (admin only)
export const updateService = asyncHandler(async (req, res) => {
  const { service_name, short_description, description, status, category } = req.body;
  const offerings = parseJsonField(req.body.offerings);
  const benefits = parseJsonField(req.body.benefits);
  const target_audience = parseJsonField(req.body.target_audience);
  const faq = parseJsonField(req.body.faq);
  const case_study = parseJsonObject(req.body.case_study);
  const clients = parseJsonField(req.body.clients).map((c, i) => ({
    ...c,
    avatar: req.clientAvatarUrls?.[String(i)] ?? c.avatar ?? "",
  }));

  if (!service_name && !short_description && !description && !status && !category && !offerings.length && !benefits.length && !target_audience.length && !faq.length && !clients.length) {
    return res.status(400).json({ success: false, message: "No fields to update" });
  }

  const update = { service_name, short_description, description, status, category, offerings, benefits, target_audience, faq, case_study, clients };
  if (req.files?.image?.[0]?.url) {
    update.image = req.files.image[0].url;
  } else if (req.body.image) {
    update.image = req.body.image;
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
  res.status(200).json({ success: true, message: "Service deleted successfully" });
});

// Delete all services (admin only)
export const deleteAllServices = asyncHandler(async (req, res) => {
  const result = await Services.deleteMany({});
  res.status(200).json({
    success: true,
    message: `${result.deletedCount} service(s) deleted successfully.`,
  });
});

// Get related services by category (public)
export const getRelatedServices = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { limit = 3 } = req.query;

  const currentService = await Services.findById(id);
  if (!currentService) {
    return res.status(404).json({ success: false, message: "Service not found" });
  }

  const filter = {
    status: "Active",
    _id: { $ne: id },
  };

  if (currentService.category) {
    filter.category = currentService.category;
  }

  let related = await Services.find(filter).limit(Number(limit));

  // If not enough same-category services, fill with random active services
  if (related.length < Number(limit)) {
    const existingIds = [id, ...related.map((s) => s._id.toString())];
    const moreServices = await Services.find({
      status: "Active",
      _id: { $nin: existingIds },
    }).limit(Number(limit) - related.length);
    related = [...related, ...moreServices];
  }

  res.status(200).json({
    success: true,
    count: related.length,
    data: related,
  });
});

// Get all services (including inactive ones) with filters for admin panel
export const getAllAdminServices = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (search) {
    filter.service_name = { $regex: search, $options: "i" };
  }
  if (status) {
    filter.status = status;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Services.countDocuments(filter);
  const services = await Services.find(filter).skip(skip).limit(Number(limit));

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
