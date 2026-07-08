import { Router } from "express";
import { getAllFAQs, getFAQsByService } from "../controllers/faq.controller.js";

const router = Router();

router.get("/", getAllFAQs);
router.get("/service/:serviceId", getFAQsByService);

export default router;
