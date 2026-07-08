import express from "express";
import { getSiteContent } from "../controllers/siteContent.controller.js";

const router = express.Router();

router.get("/", getSiteContent);

export default router;
