// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import connectDB from "./config/db.js";

import serviceRoutes from "./routes/services.routes.js";
import adminServicesRoutes from "./routes/adminServices.routes.js";
import projectRoutes from "./routes/projects.routes.js";
import adminProjectsRoutes from "./routes/adminProjects.routes.js";
import coursesRoutes from "./routes/courses.routes.js";
import adminCoursesRoutes from "./routes/adminCourses.routes.js";
import teamRoutes from "./routes/team.routes.js";
import adminTeamRoutes from "./routes/adminTeam.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import adminReviewsRoutes from "./routes/adminReviews.routes.js";
import publicReviewsRoutes from "./routes/publicReviews.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import adminContactRoutes from "./routes/adminContact.routes.js";

const app = express();

// Allow requests from the React frontend running on port 5173
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// Convert incoming JSON data so we can read it easily
app.use(express.json());
// Read cookies from the browser
app.use(cookieParser());
// Serve uploaded images from the "uploads" folder when someone visits "/uploads/filename"
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Connect each route group to its URL path
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/admin/services", adminServicesRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/admin/projects", adminProjectsRoutes);
app.use("/api/v1/courses", coursesRoutes);
app.use("/api/v1/admin/courses", adminCoursesRoutes);
app.use("/api/v1/team", teamRoutes);
app.use("/api/v1/admin/team", adminTeamRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/admin/reviews", adminReviewsRoutes);
app.use("/api/v1/reviews", publicReviewsRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/admin/contact", adminContactRoutes);

// Start the server after connecting to the database
const startServer = async () => {
  try {
    await connectDB();

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};
startServer();
