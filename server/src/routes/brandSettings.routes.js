import express from "express";
import { getBrandSettings } from "../controllers/brandSettings.controller.js";

const router = express.Router();

router.get("/", getBrandSettings);

export default router;
