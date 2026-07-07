// Handles everything related to industries (CRUD + public listing)
import Industry from "../models/industry.model.js";
import asyncHandler from "../middleware/asyncHandler.js";

// Create a new industry (admin only)
export const createIndustry = asyncHandler(async (req, res) => {
  const { name, description, icon, display_order, status } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: "Industry name is required" });
  }

  const existing = await Industry.findOne({ name });
  if (existing) {
    return res.status(409).json({ success: false, message: "Industry already exists" });
  }

  const industry = await Industry.create({
    name,
    description,
    icon,
    display_order: display_order ? Number(display_order) : 0,
    status,
  });

  res.status(201).json({
    success: true,
    message: "Industry created successfully",
    data: industry,
  });
});

// Get active industries (public)
export const getAllIndustries = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 50 } = req.query;

  const filter = { status: "Active" };
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Industry.countDocuments(filter);
  const industries = await Industry.find(filter)
    .sort({ display_order: 1, createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: industries.length,
    data: industries,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

// Get a single industry by ID
export const getIndustryById = asyncHandler(async (req, res) => {
  const industry = await Industry.findById(req.params.id);
  if (!industry) {
    return res.status(404).json({ success: false, message: "Industry not found" });
  }
  res.status(200).json({ success: true, data: industry });
});

// Update an existing industry (admin only)
export const updateIndustry = asyncHandler(async (req, res) => {
  const { name, description, icon, display_order, status } = req.body;

  const update = {
    name,
    description,
    icon,
    display_order: display_order ? Number(display_order) : 0,
    status,
  };

  const industry = await Industry.findByIdAndUpdate(
    req.params.id,
    update,
    { new: true, runValidators: true },
  );
  if (!industry) {
    return res.status(404).json({ success: false, message: "Industry not found" });
  }
  res.status(200).json({
    success: true,
    message: "Industry updated successfully",
    data: industry,
  });
});

// Delete an industry by its ID (admin only)
export const deleteIndustry = asyncHandler(async (req, res) => {
  const industry = await Industry.findByIdAndDelete(req.params.id);
  if (!industry) {
    return res.status(404).json({ success: false, message: "Industry not found" });
  }
  res.status(200).json({ success: true, message: "Industry deleted successfully" });
});

// Delete all industries (admin only)
export const deleteAllIndustries = asyncHandler(async (req, res) => {
  const result = await Industry.deleteMany({});
  res.status(200).json({
    success: true,
    message: `${result.deletedCount} industry(ies) deleted successfully.`,
  });
});

// Get all industries including inactive (admin panel)
export const getAllAdminIndustries = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 50 } = req.query;

  const filter = {};
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }
  if (status) {
    filter.status = status;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Industry.countDocuments(filter);
  const industries = await Industry.find(filter)
    .sort({ display_order: 1, createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: industries.length,
    data: industries,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});
