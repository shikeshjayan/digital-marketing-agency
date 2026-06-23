// Routes for admin to manage courses
import express from "express";
import {
  createCourse,
  getAllAdminCourses,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getAllAdminCourses);
router.post("/create", protect, createCourse);
router.put("/:course_id", protect, updateCourse);
router.delete("/:course_id", protect, deleteCourse);

export default router;
