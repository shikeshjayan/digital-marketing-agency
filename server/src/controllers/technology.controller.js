// Handles everything related to technologies (CRUD + public listing)
import Technology from "../models/technology.model.js";
import asyncHandler from "../middleware/asyncHandler.js";

// Create a new technology (admin only)
export const createTechnology = asyncHandler(async (req, res) => {
  const { name, description, icon, display_order, status } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: "Technology name is required" });
  }

  const existing = await Technology.findOne({ name });
  if (existing) {
    return res.status(409).json({ success: false, message: "Technology already exists" });
  }

  const technology = await Technology.create({
    name,
    description,
    icon,
    display_order: display_order ? Number(display_order) : 0,
    status,
  });

  res.status(201).json({
    success: true,
    message: "Technology created successfully",
    data: technology,
  });
});

// Get active technologies (public)
export const getAllTechnologies = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 50 } = req.query;

  const filter = { status: "Active" };
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Technology.countDocuments(filter);
  const technologies = await Technology.find(filter)
    .sort({ display_order: 1, createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: technologies.length,
    data: technologies,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

// Get a single technology by ID
export const getTechnologyById = asyncHandler(async (req, res) => {
  const technology = await Technology.findById(req.params.id);
  if (!technology) {
    return res.status(404).json({ success: false, message: "Technology not found" });
  }
  res.status(200).json({ success: true, data: technology });
});

// Update an existing technology (admin only)
export const updateTechnology = asyncHandler(async (req, res) => {
  const { name, description, icon, display_order, status } = req.body;

  const update = {
    name,
    description,
    icon,
    display_order: display_order ? Number(display_order) : 0,
    status,
  };

  const technology = await Technology.findByIdAndUpdate(
    req.params.id,
    update,
    { new: true, runValidators: true },
  );
  if (!technology) {
    return res.status(404).json({ success: false, message: "Technology not found" });
  }
  res.status(200).json({
    success: true,
    message: "Technology updated successfully",
    data: technology,
  });
});

// Delete a technology by its ID (admin only)
export const deleteTechnology = asyncHandler(async (req, res) => {
  const technology = await Technology.findByIdAndDelete(req.params.id);
  if (!technology) {
    return res.status(404).json({ success: false, message: "Technology not found" });
  }
  res.status(200).json({ success: true, message: "Technology deleted successfully" });
});

// Delete all technologies (admin only)
export const deleteAllTechnologies = asyncHandler(async (req, res) => {
  const result = await Technology.deleteMany({});
  res.status(200).json({
    success: true,
    message: `${result.deletedCount} technology(ies) deleted successfully.`,
  });
});

// Get all technologies including inactive (admin panel)
export const getAllAdminTechnologies = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 50 } = req.query;

  const filter = {};
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }
  if (status) {
    filter.status = status;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Technology.countDocuments(filter);
  const technologies = await Technology.find(filter)
    .sort({ display_order: 1, createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: technologies.length,
    data: technologies,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});
