// Routes for admin to manage courses
import express from "express";
import {
  createCourse,
  getAllAdminCourses,
  getCourseCategories,
  updateCourse,
  deleteCourse,
  deleteAllCourses,
} from "../controllers/course.controller.js";
import { protect } from "../middleware/auth.js";
import upload, { processImage } from "../config/upload.js";

const router = express.Router();

router.get("/", protect, getAllAdminCourses);
router.get("/categories", protect, getCourseCategories);
router.post("/create", protect, upload.single("image"), processImage, createCourse);
router.put("/:course_id", protect, upload.single("image"), processImage, updateCourse);
router.delete("/:course_id", protect, deleteCourse);
router.delete("/", protect, deleteAllCourses);

export default router;
