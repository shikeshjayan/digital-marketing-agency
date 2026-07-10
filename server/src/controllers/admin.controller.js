// Handles admin registration, login, profile, logout, and profile updates
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Admin from "../models/Admin.model.js";
import asyncHandler from "../middleware/asyncHandler.js";
import sendEmail from "../utils/sendEmail.js";

// Check if an admin already exists (public - no auth needed)
export const checkAdminExists = asyncHandler(async (req, res) => {
  const count = await Admin.countDocuments();
  res.status(200).json({ success: true, data: { exists: count > 0 } });
});

// Check if a specific admin email exists (public - no auth needed)
export const checkEmailExists = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }
  const admin = await Admin.findOne({ email });
  res.status(200).json({ success: true, data: { exists: !!admin } });
});

// Create a JWT token for a given admin ID
const generateToken = (id, expiresIn = "7d") => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
};

// Send back the token as an httpOnly cookie
const sendTokenResponse = (admin, statusCode, res, rememberMe = false) => {
  const tokenExpiry = rememberMe ? "30d" : "7d";
  const token = generateToken(admin._id, tokenExpiry);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  if (rememberMe) {
    cookieOptions.maxAge = 30 * 24 * 60 * 60 * 1000; // match JWT expiry
  }

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
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

// Register a new admin account (only if no admin exists)
export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Block registration if an admin already exists
  const adminCount = await Admin.countDocuments();
  if (adminCount > 0) {
    return res
      .status(403)
      .json({ success: false, message: "Registration is closed. Admin already exists." });
  }

  const admin = await Admin.create({ name, email, password });

  // Send back token
  const token = generateToken(admin._id);
  res
    .status(201)
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
});

// Login an existing admin with email and password
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = req.body;

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

  sendTokenResponse(admin, 200, res, rememberMe);
});

// Get the currently logged-in admin's profile info
export const getAdminProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: req.admin });
});

// Logout by clearing the token cookie
export const logoutAdmin = asyncHandler(async (req, res) => {
  res
    .cookie("token", "", { httpOnly: true, expires: new Date(0) })
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
});

// Update admin's name, email, photo, and/or password
export const updateAdminProfile = asyncHandler(async (req, res) => {
  const { name, email, currentPassword, newPassword, removePhoto } = req.body;

  const admin = await Admin.findById(req.admin._id).select("+password");
  if (!admin) {
    return res.status(404).json({ success: false, message: "Admin not found" });
  }

  if (name) admin.name = name;
  if (email) admin.email = email;

  if (req.file) {
    admin.photo = req.file.url;
  } else if (removePhoto === "true") {
    admin.photo = "";
  }

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

// Generate a 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Send OTP to admin's email for password reset (public - no auth required)
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    // Don't reveal whether the email exists
    return res.status(200).json({ success: true, message: "If that email exists, an OTP has been sent." });
  }

  // Generate OTP
  const rawOTP = generateOTP();

  // Create a JWT token containing the OTP data (expires in 10 minutes)
  const otpToken = jwt.sign(
    { email: admin.email, otp: rawOTP },
    process.env.JWT_SECRET,
    { expiresIn: "10m" }
  );

  // Send OTP via email
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto;">
      <h2 style="color: #dc2626;">Password Reset OTP</h2>
      <p>Your one-time password (OTP) for resetting your admin password is:</p>
      <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; text-align: center; margin: 16px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1f2937;">${rawOTP}</span>
      </div>
      <p style="color: #6b7280; font-size: 14px;">This OTP expires in <strong>10 minutes</strong>.</p>
      <p style="color: #6b7280; font-size: 14px;">If you didn't request this, please ignore this email.</p>
    </div>
  `;

  await sendEmail({
    to: admin.email,
    subject: "Your Password Reset OTP - Digital Marketing Agency",
    html,
  });

  res.status(200).json({ success: true, message: "If that email exists, an OTP has been sent.", data: { otpToken } });
});

// Verify OTP and reset password (public - no auth required)
export const verifyOTP = asyncHandler(async (req, res) => {
  const { otpToken, otp, newPassword } = req.body;

  // Verify JWT token and extract OTP data
  let decoded;
  try {
    decoded = jwt.verify(otpToken, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "OTP token is invalid or expired. Please request a new one.",
    });
  }

  // Compare OTP from token with user-submitted OTP
  if (decoded.otp !== otp.trim()) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  // Find admin and reset password
  const admin = await Admin.findOne({ email: decoded.email }).select("+password");
  if (!admin) {
    return res.status(400).json({ success: false, message: "Admin not found" });
  }

  // Reject if new password matches the old one
  const isSamePassword = await admin.matchPassword(newPassword);
  if (isSamePassword) {
    return res.status(400).json({
      success: false,
      message: "New password must be different from your current password. Please choose a different one.",
    });
  }

  admin.password = newPassword;
  await admin.save();

  res.status(200).json({ success: true, message: "Password reset successful. You can now log in." });
});
