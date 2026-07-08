import express from "express";
import {
  getAllCaseStudies,
  getCaseStudyBySlug,
  getCaseStudiesByService,
} from "../controllers/caseStudy.controller.js";

const router = express.Router();

router.get("/", getAllCaseStudies);
router.get("/slug/:slug", getCaseStudyBySlug);
router.get("/service/:serviceId", getCaseStudiesByService);

export default router;
