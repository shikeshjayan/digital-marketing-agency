// Handles everything related to projects (CRUD + public listing by category)
import Projects from "../models/projects.model.js";

// Allowed project categories
const validCategories = ["Static", "Dynamic", "Landing Pages"];

// Check if the category in the URL is valid
const validateCategory = (req, res, next) => {
  const { type } = req.params;
  if (!validCategories.includes(type)) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }
  next();
};

export { validateCategory };

// Create a new project (admin only)
export const createProject = async (req, res) => {
  try {
    const { project_name, category, short_description, description, image, live_url, status } = req.body;

    // Validate required fields
    if (!project_name || !category || !short_description || !description || !image) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Prevent duplicate project names
    const existing = await Projects.findOne({ project_name });
    if (existing) {
      return res.status(409).json({ success: false, message: "Project already exists" });
    }

    const project = await Projects.create({
      project_name, category, short_description, description, image, live_url, status,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all active projects with optional category filter (public)
export const getAllProjects = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;

    // Only show active projects to the public
    const filter = { status: "Active" };
    if (category && category !== "All") {
      filter.category = category;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Projects.countDocuments(filter);
    const projects = await Projects.find(filter).skip(skip).limit(Number(limit));

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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single project by its ID (public)
export const getProjectById = async (req, res) => {
  try {
    const project = await Projects.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all active projects in a specific category (public)
export const getProjectsByCategory = async (req, res) => {
  try {
    const projects = await Projects.find({ category: req.params.type, status: "Active" });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an existing project (admin only)
export const updateProject = async (req, res) => {
  try {
    const { project_name, category, short_description, description, image, live_url, status } = req.body;

    if (!project_name && !category && !short_description && !description && !image && !live_url && !status) {
      return res.status(400).json({ success: false, message: "No fields to update" });
    }

    const project = await Projects.findByIdAndUpdate(
      req.params.id,
      { project_name, category, short_description, description, image, live_url, status },
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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a project by its ID (admin only)
export const deleteProject = async (req, res) => {
  try {
    const project = await Projects.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all projects (including inactive ones) with filters for admin panel
export const getAllAdminProjects = async (req, res) => {
  try {
    const { search, category, status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (search) {
      filter.project_name = { $regex: search, $options: "i" };
    }
    if (category) {
      filter.category = category;
    }
    if (status) {
      filter.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Projects.countDocuments(filter);
    const projects = await Projects.find(filter).skip(skip).limit(Number(limit));

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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
