// Handles everything related to services (CRUD + public listing)
import Services from "../models/services.model.js";
import asyncHandler from "../middleware/asyncHandler.js";

// Create a new service (admin only)
export const createService = asyncHandler(async (req, res) => {
  const { service_name, short_description, description, image, status } = req.body;

  // Validate required fields
  if (!service_name || !short_description || !description || !image) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  // Prevent duplicate service names
  const existing = await Services.findOne({ service_name });
  if (existing) {
    return res.status(409).json({ success: false, message: "Service already exists" });
  }

  const service = await Services.create({ service_name, short_description, description, image, status });

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
  const { service_name, short_description, description, image, status } = req.body;

  if (!service_name && !short_description && !description && !image && !status) {
    return res.status(400).json({ success: false, message: "No fields to update" });
  }

  const service = await Services.findByIdAndUpdate(
    req.params.id,
    { service_name, short_description, description, image, status },
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
