// Handles admin registration, login, profile, logout, and profile updates
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.model.js";
import asyncHandler from "../middleware/asyncHandler.js";

// Create a JWT token for a given admin ID that expires in 7 days
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Send back the token as an httpOnly cookie
const sendTokenResponse = (admin, statusCode, res) => {
  const token = generateToken(admin._id);

  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
};

// Register a new admin account
export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if an admin with this email already exists
  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return res
      .status(400)
      .json({ success: false, message: "Admin already exists" });
  }

  // Create the admin and send back a token (role defaults to "admin" in schema)
  const admin = await Admin.create({ name, email, password });
  sendTokenResponse(admin, 201, res);
});

// Login an existing admin with email and password
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find admin by email and include the password field (it's hidden by default)
  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  // Check if the password matches the stored hash
  const isMatch = await admin.matchPassword(password);
  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  sendTokenResponse(admin, 200, res);
});

// Get the currently logged-in admin's profile info
export const getAdminProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: req.admin });
});

// Logout by clearing the token cookie
export const logoutAdmin = async (req, res) => {
  res
    .cookie("token", "", { httpOnly: true, expires: new Date(0) })
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};

// Update admin's name, email, photo, and/or password
export const updateAdminProfile = asyncHandler(async (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body;
  // If a file was uploaded, use its path; otherwise use the URL from the body
  const photo = req.file ? `/uploads/${req.file.filename}` : req.body.photo;

  // Fetch the admin from DB including the password field
  const admin = await Admin.findById(req.admin._id).select("+password");
  if (!admin) {
    return res.status(404).json({ success: false, message: "Admin not found" });
  }

  // Update fields only if they were provided
  if (name) admin.name = name;
  if (email) admin.email = email;
  if (photo) admin.photo = photo;

  // If user wants to change password, verify current password first
  if (currentPassword && newPassword) {
    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });
    }
    admin.password = newPassword;
  } else if (newPassword && !currentPassword) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Current password is required to set a new password",
      });
  }

  // Save changes (the password will be hashed automatically by the model's pre-save hook)
  const updatedAdmin = await admin.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: {
      id: updatedAdmin._id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      photo: updatedAdmin.photo,
      role: updatedAdmin.role,
    },
  });
});
