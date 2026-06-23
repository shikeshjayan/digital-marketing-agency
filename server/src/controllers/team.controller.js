// Handles team member profiles (CRUD + public listing)
import Team from "../models/team.model.js";

// Add a new team member (admin only, supports photo upload)
export const createMember = async (req, res) => {
  try {
    const { name, designation, display_order, status } = req.body;
    // If a file was uploaded, store its path; otherwise use the one from the request body
    const photo = req.file ? `/uploads/${req.file.filename}` : req.body.photo;

    // Validate required fields
    if (!name || !designation) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const member = await Team.create({ photo, name, designation, display_order, status });

    res.status(201).json({
      success: true,
      message: "Team member profile added successfully",
      data: member,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all team members with search, status filter, and pagination (admin only)
export const getAllTeamMembers = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (search) {
      filter.name = { $regex: search, $options: "i" };
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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a team member's info (admin only, supports photo upload)
export const updateMember = async (req, res) => {
  try {
    const { name, designation, display_order, status } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : req.body.photo;

    if (!name && !designation && !display_order && !status && !photo) {
      return res.status(400).json({ success: false, message: "Invalid data type fields" });
    }

    const member = await Team.findByIdAndUpdate(
      req.params.team_id,
      { photo, name, designation, display_order, status },
      { new: true, runValidators: true },
    );
    if (!member) {
      return res.status(404).json({ success: false, message: "Target member profile not found" });
    }
    res.status(200).json({
      success: true,
      message: "Member profile updated successfully",
      data: member,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a team member by ID (admin only)
export const deleteMember = async (req, res) => {
  try {
    const member = await Team.findByIdAndDelete(req.params.team_id);
    if (!member) {
      return res.status(404).json({ success: false, message: "Target member not found" });
    }
    res.status(200).json({
      success: true,
      message: "Team member has been permanently removed from the dashboard system directory.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get only active team members sorted by display_order (public)
export const getPublicTeam = async (req, res) => {
  try {
    const members = await Team.find({ status: "Active" }).sort({ display_order: 1 });

    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
