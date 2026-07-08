// Public routes - visitors can view active industries
import express from "express";
import { getAllIndustries } from "../controllers/industry.controller.js";

const router = express.Router();

router.get("/", getAllIndustries);

export default router;
