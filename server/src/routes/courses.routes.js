// Public route - visitors can view active courses
import express from "express";
import { getPublicCourses } from "../controllers/course.controller.js";

const router = express.Router();

router.get("/", getPublicCourses);

export default router;
