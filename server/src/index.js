import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

import serviceRoutes from "./routes/services.routes.js";
import adminServicesRoutes from "./routes/adminServices.routes.js";
import projectRoutes from "./routes/projects.routes.js";
import adminProjectsRoutes from "./routes/adminProjects.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/admin/services", adminServicesRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/admin/projects", adminProjectsRoutes);
app.use("/api/v1/admin", adminRoutes);

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
