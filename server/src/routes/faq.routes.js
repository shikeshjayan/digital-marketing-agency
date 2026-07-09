import express from "express";
import { getAllFAQs, getFAQsByService } from "../controllers/faq.controller.js";

const router = express.Router();

router.get("/", getAllFAQs);
router.get("/service/:serviceId", getFAQsByService);

export default router;
