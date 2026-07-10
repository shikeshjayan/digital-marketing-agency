// Middleware that protects admin-only routes by checking the JWT token
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.model.js";

// Check if the request has a valid token before letting it through
export const protect = async (req, res, next) => {
  try {
    let token;

    // Look for the token in the "Authorization" header (starts with "Bearer")
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
      // If not in header, look for it in the cookie
      token = req.cookies.token;
    }

    // If no token found, reject the request
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized, no token" });
    }

    // Decode the token and find the admin in the database
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select("-password");

    // If admin not found, reject
    if (!req.admin) {
      return res.status(401).json({ success: false, message: "Not authorized, admin not found" });
    }

    // All good, move to the next function
    next();
  } catch (error) {
    // Token is invalid or expired
    res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};

// Check if the admin has one of the allowed roles (e.g. "admin" or "superadmin")
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    next();
  };
};
