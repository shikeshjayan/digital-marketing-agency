// Public routes - visitors can view services
import express from "express";
import { getAllServices, getServiceById, getRelatedServices } from "../controllers/service.controller.js";

const router = express.Router();

router.get("/", getAllServices);
router.get("/related/:id", getRelatedServices);
router.get("/:id", getServiceById);

export default router;
