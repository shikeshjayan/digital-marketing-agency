// Handles everything related to courses (CRUD + public listing)
import Courses from "../models/courses.model.js";

// Create a new course (admin only)
export const createCourse = async (req, res) => {
  try {
    const { course_name, description, category, status } = req.body;

    // Validate required fields
    if (!course_name || !description) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Prevent duplicate course names
    const existing = await Courses.findOne({ course_name });
    if (existing) {
      return res.status(409).json({ success: false, message: "Course name already exists" });
    }

    const course = await Courses.create({ course_name, description, category, status });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all courses with search, status filter, and pagination (admin only)
export const getAllAdminCourses = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (search) {
      filter.course_name = { $regex: search, $options: "i" };
    }
    if (status) {
      filter.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Courses.countDocuments(filter);
    const courses = await Courses.find(filter).skip(skip).limit(Number(limit));

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
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

// Update an existing course (admin only)
export const updateCourse = async (req, res) => {
  try {
    const { course_name, description, category, status } = req.body;

    // Make sure at least one field is being updated
    if (!course_name && !description && !category && !status) {
      return res.status(400).json({ success: false, message: "Invalid input data" });
    }

    const course = await Courses.findByIdAndUpdate(
      req.params.course_id,
      { course_name, description, category, status },
      { new: true, runValidators: true },
    );
    if (!course) {
      return res.status(404).json({ success: false, message: "Course record not found" });
    }
    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a course by its ID (admin only)
export const deleteCourse = async (req, res) => {
  try {
    const course = await Courses.findByIdAndDelete(req.params.course_id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Target course not found" });
    }
    res.status(200).json({ success: true, message: "Course has been permanently deleted from the database." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get only active courses for public visitors
export const getPublicCourses = async (req, res) => {
  try {
    const courses = await Courses.find({ status: "Active" });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
