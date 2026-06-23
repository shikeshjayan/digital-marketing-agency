// Routes for admin to manage services
import express from "express";
import { createService, updateService, deleteService, getAllAdminServices } from "../controllers/service.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getAllAdminServices);
router.post("/create", protect, createService);
router.put("/:id", protect, updateService);
router.delete("/:id", protect, deleteService);

export default router;
