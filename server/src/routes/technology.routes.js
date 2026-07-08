// Public routes - visitors can view active technologies
import express from "express";
import { getAllTechnologies } from "../controllers/technology.controller.js";

const router = express.Router();

router.get("/", getAllTechnologies);

export default router;
