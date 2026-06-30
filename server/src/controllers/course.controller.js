// Handles everything related to courses (CRUD + public listing)
import Courses from "../models/courses.model.js";
import asyncHandler from "../middleware/asyncHandler.js";

// Create a new course (admin only)
export const createCourse = asyncHandler(async (req, res) => {
  const { course_name, description, category, status } = req.body;

  // Validate required fields
  if (!course_name || !description) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  // Prevent duplicate course names
  const existing = await Courses.findOne({ course_name });
  if (existing) {
    return res
      .status(409)
      .json({ success: false, message: "Course name already exists" });
  }

  const image = req.file ? req.file.url : "";

  const course = await Courses.create({
    course_name,
    description,
    image,
    category,
    status,
  });

  res.status(201).json({
    success: true,
    message: "Course created successfully",
    data: course,
  });
});

// Get all courses with search, status filter, and pagination (admin only)
export const getAllAdminCourses = asyncHandler(async (req, res) => {
  const { search, category, status, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (search) {
    filter.course_name = { $regex: search, $options: "i" };
  }
  if (category) {
    filter.category = category;
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
});

// Update an existing course (admin only)
export const updateCourse = asyncHandler(async (req, res) => {
  const { course_name, description, category, status, removeImage } = req.body;

  // Make sure at least one field is being updated
  if (!course_name && !description && !category && !status && !removeImage) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid input data" });
  }

  const course = await Courses.findById(req.params.course_id);
  if (!course) {
    return res
      .status(404)
      .json({ success: false, message: "Course record not found" });
  }

  const update = {};
  if (course_name) update.course_name = course_name;
  if (description) update.description = description;
  if (category) update.category = category;
  if (status) update.status = status;

  if (req.file) {
    update.image = req.file.url;
  } else if (removeImage === "true") {
    update.image = "";
  }

  const updated = await Courses.findByIdAndUpdate(req.params.course_id, update, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Course updated successfully",
    data: updated,
  });
});

// Delete a course by its ID (admin only)
export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Courses.findByIdAndDelete(req.params.course_id);
  if (!course) {
    return res
      .status(404)
      .json({ success: false, message: "Target course not found" });
  }
  res
    .status(200)
    .json({
      success: true,
      message: "Course has been permanently deleted from the database.",
    });
});

// Delete all courses (admin only)
export const deleteAllCourses = asyncHandler(async (req, res) => {
  const result = await Courses.deleteMany({});
  res.status(200).json({
    success: true,
    message: `${result.deletedCount} course(s) deleted successfully.`,
  });
});

// Get unique categories from all courses (admin)
export const getCourseCategories = asyncHandler(async (req, res) => {
  const categories = await Courses.distinct("category");
  res.status(200).json({
    success: true,
    data: categories.filter(Boolean).sort(),
  });
});

// Get only active courses for public visitors
export const getPublicCourses = asyncHandler(async (req, res) => {
  const courses = await Courses.find({ status: "Active" });

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

// Get a single course by its ID (public route)
export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Courses.findById(req.params.course_id);
  if (!course) {
    return res
      .status(404)
      .json({ success: false, message: "Course not found" });
  }
  res.status(200).json({
    success: true,
    data: course,
  });
});

// Get a single course by its slug (public route)
export const getCourseBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // Try exact slug match first
  let course = await Courses.findOne({ slug });

  // Fallback: match by slugified course_name for courses missing slug field
  if (!course) {
    const allCourses = await Courses.find({});
    course = allCourses.find(
      (c) =>
        c.course_name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") === slug
    );
  }

  if (!course) {
    return res
      .status(404)
      .json({ success: false, message: "Course not found" });
  }
  res.status(200).json({
    success: true,
    data: course,
  });
});
