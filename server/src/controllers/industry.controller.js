// Handles everything related to industries (CRUD + public listing)
import Industry from "../models/industry.model.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { escapeRegex } from "../utils/helpers.js";

// Create a new industry (admin only)
export const createIndustry = asyncHandler(async (req, res) => {
  const { name, description, iconType, display_order, status } = req.body;
  const icon = req.file ? req.file.url : req.body.icon;

  if (!name) {
    return res.status(400).json({ success: false, message: "Please enter an industry name." });
  }

  const existing = await Industry.findOne({ name });
  if (existing) {
    return res.status(409).json({ success: false, message: "An industry with this name already exists. Please choose a different name." });
  }

  if (display_order !== undefined) {
    const orderTaken = await Industry.findOne({ display_order: Number(display_order) });
    if (orderTaken) {
      return res.status(409).json({ success: false, message: "This display order is already taken by another industry. Please choose a different number." });
    }
  }

  const industry = await Industry.create({
    name,
    description,
    icon,
    iconType: iconType || "fontawesome",
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
    filter.name = { $regex: escapeRegex(search), $options: "i" };
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
    return res.status(404).json({ success: false, message: "We couldn't find this industry. It may have been removed." });
  }
  res.status(200).json({ success: true, data: industry });
});

// Update an existing industry (admin only)
export const updateIndustry = asyncHandler(async (req, res) => {
  const { name, description, icon, iconType, display_order, status, removeIcon } = req.body;

  if (display_order !== undefined) {
    const orderTaken = await Industry.findOne({ display_order: Number(display_order), _id: { $ne: req.params.id } });
    if (orderTaken) {
      return res.status(409).json({ success: false, message: "This display order is already taken by another industry. Please choose a different number." });
    }
  }

  const update = {};
  if (name !== undefined) update.name = name;
  if (description !== undefined) update.description = description;
  if (iconType !== undefined) update.iconType = iconType;
  if (display_order !== undefined) update.display_order = Number(display_order);
  if (status !== undefined) update.status = status;

  if (req.file) {
    update.icon = req.file.url;
    update.iconType = "image";
  } else if (removeIcon === "true") {
    update.icon = "";
  } else if (icon !== undefined) {
    update.icon = icon;
  }

  const industry = await Industry.findByIdAndUpdate(
    req.params.id,
    update,
    { new: true, runValidators: true },
  );
  if (!industry) {
    return res.status(404).json({ success: false, message: "We couldn't find this industry. It may have been removed." });
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
    return res.status(404).json({ success: false, message: "We couldn't find this industry. It may have been removed." });
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
    filter.name = { $regex: escapeRegex(search), $options: "i" };
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
