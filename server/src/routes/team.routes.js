// Public route - visitors can view active team members
import express from "express";
import { getPublicTeam } from "../controllers/team.controller.js";

const router = express.Router();

router.get("/", getPublicTeam);

export default router;
