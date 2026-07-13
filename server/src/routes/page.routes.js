import { Router } from "express";
import {
  getPageServices,
  getPageProjects,
  getPageHome,
  getPageAbout,
  getPageTestimonials,
  getPageContact,
} from "../controllers/page.controller.js";

const router = Router();

router.get("/home", getPageHome);
router.get("/about", getPageAbout);
router.get("/services", getPageServices);
router.get("/projects", getPageProjects);
router.get("/testimonials", getPageTestimonials);
router.get("/contact", getPageContact);

export default router;
