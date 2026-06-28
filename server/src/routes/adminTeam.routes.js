// Routes for admin to manage team members (with photo upload)
import express from "express";
import {
  createMember,
  getAllTeamMembers,
  updateMember,
  deleteMember,
  deleteAllMembers,
} from "../controllers/team.controller.js";
import { protect } from "../middleware/auth.js";
import upload from "../config/upload.js";

const router = express.Router();

router.get("/", protect, getAllTeamMembers);
router.post("/create", protect, upload.single("photo"), createMember);
router.put("/:team_id", protect, upload.single("photo"), updateMember);
router.delete("/:team_id", protect, deleteMember);
router.delete("/", protect, deleteAllMembers);

export default router;
