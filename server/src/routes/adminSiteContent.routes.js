import express from "express";
import {
  getSiteContent,
  updateSiteContent,
  seedSiteContent,
} from "../controllers/siteContent.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getSiteContent);
router.put("/", protect, updateSiteContent);
router.post("/seed", protect, seedSiteContent);

export default router;
