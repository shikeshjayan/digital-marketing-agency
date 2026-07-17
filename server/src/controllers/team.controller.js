// Handles team member profiles (CRUD + public listing)
import Team from "../models/team.model.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { escapeRegex } from "../utils/helpers.js";

// Add a new team member (admin only, supports photo upload)
export const createMember = asyncHandler(async (req, res) => {
  const { name, designation, description, linkedin, email, display_order, status } = req.body;
  // If a file was uploaded, store its path; otherwise use the one from the request body
  const photo = req.file ? req.file.url : req.body.photo;

  // Validate required fields
  if (!name || !designation) {
    return res.status(400).json({ success: false, message: "Please fill in at least the name and designation." });
  }

  if (display_order !== undefined) {
    const orderTaken = await Team.findOne({ display_order: Number(display_order) });
    if (orderTaken) {
      return res.status(409).json({ success: false, message: "This display order is already taken by another member. Please choose a different number." });
    }
  }

  const member = await Team.create({ photo, name, designation, description, linkedin, email, display_order, status });

  res.status(201).json({
    success: true,
    message: "Team member profile added successfully",
    data: member,
  });
});

// Get all team members with search, status filter, and pagination (admin only)
export const getAllTeamMembers = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (search) {
    filter.name = { $regex: escapeRegex(search), $options: "i" };
  }
  if (status) {
    filter.status = status;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Team.countDocuments(filter);
  // Sort by display_order so they appear in the right order
  const members = await Team.find(filter).sort({ display_order: 1 }).skip(skip).limit(Number(limit));

  res.status(200).json({
    success: true,
    count: members.length,
    data: members,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

// Update a team member's info (admin only, supports photo upload)
export const updateMember = asyncHandler(async (req, res) => {
  const { name, designation, description, linkedin, email, display_order, status, removePhoto } = req.body;

  if (!name && !designation && !description && !linkedin && !email && !display_order && !status) {
    return res.status(400).json({ success: false, message: "Please provide at least one field to update." });
  }

  if (display_order !== undefined) {
    const orderTaken = await Team.findOne({ display_order: Number(display_order), _id: { $ne: req.params.id } });
    if (orderTaken) {
      return res.status(409).json({ success: false, message: "This display order is already taken by another member. Please choose a different number." });
    }
  }

  const update = { name, designation, description, linkedin, email, display_order, status };
  if (req.file) {
    update.photo = req.file.url;
  } else if (removePhoto === "true") {
    update.photo = "";
  }

  const member = await Team.findByIdAndUpdate(
    req.params.id,
    update,
    { new: true, runValidators: true },
  );
  if (!member) {
    return res.status(404).json({ success: false, message: "We couldn't find this team member. They may have been removed." });
  }
  res.status(200).json({
    success: true,
    message: "Member profile updated successfully",
    data: member,
  });
});

// Delete a team member by ID (admin only)
export const deleteMember = asyncHandler(async (req, res) => {
  const member = await Team.findByIdAndDelete(req.params.id);
  if (!member) {
    return res.status(404).json({ success: false, message: "We couldn't find this team member. They may have been removed." });
  }
  res.status(200).json({
    success: true,
    message: "Team member deleted successfully.",
  });
});

// Delete all team members (admin only)
export const deleteAllMembers = asyncHandler(async (req, res) => {
  const result = await Team.deleteMany({});
  res.status(200).json({
    success: true,
    message: `${result.deletedCount} team member(s) deleted successfully.`,
  });
});

// Get only active team members sorted by display_order (public)
export const getPublicTeam = asyncHandler(async (req, res) => {
  const members = await Team.find({ status: "Active" }).sort({ display_order: 1 });

  res.status(200).json({
    success: true,
    count: members.length,
    data: members,
  });
});
