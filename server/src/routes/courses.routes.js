// Public route - visitors can view active courses
import express from "express";
import { getCourseById, getPublicCourses } from "../controllers/course.controller.js";

const router = express.Router();

router.get("/", getPublicCourses);
router.get("/:course_id", getCourseById);

export default router;
