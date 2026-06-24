// Handles enquiries submitted through the contact form
import Contact from "../models/contacts.model.js";
import asyncHandler from "../middleware/asyncHandler.js";

// Submit a new contact enquiry (public)
export const submitEnquiry = asyncHandler(async (req, res) => {
  const { name, email, service, message } = req.body;

  // Make sure required fields are present
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Bad Request (Missing fields or invalid email schema)" });
  }

  // Check if the email looks valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Bad Request (Missing fields or invalid email schema)" });
  }

  // Save the enquiry to the database
  await Contact.create({ name, email, service, message });

  res.status(201).json({
    success: true,
    message: "Your message has been submitted successfully.",
  });
});

// Get all enquiries with optional filtering and pagination (admin only)
export const getAdminEnquiries = asyncHandler(async (req, res) => {
  const { search, status, date, page = 1, limit = 5 } = req.query;

  // Build a filter based on query parameters
  const filter = {};
  if (status) {
    filter.status = status;
  }
  if (search) {
    // Search across name, email, and message fields
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { message: { $regex: search, $options: "i" } },
    ];
  }
  if (date) {
    // Filter enquiries created on a specific date
    const start = new Date(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    filter.createdAt = { $gte: start, $lt: end };
  }

  const skip = (Number(page) - 1) * Number(limit);

  // Run multiple database queries in parallel for efficiency
  const [data, total, newCount, pendingCount, repliedCount, spamCount] = await Promise.all([
    Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Contact.countDocuments(filter),
    Contact.countDocuments({ status: "New" }),
    Contact.countDocuments({ status: "Pending" }),
    Contact.countDocuments({ status: "Replied" }),
    Contact.countDocuments({ status: "Spam" }),
  ]);

  // Format the data for the frontend
  const enquiries = data.map((e) => ({
    enquiry_id: e._id,
    name: e.name,
    email: e.email,
    service: e.service,
    message: e.message,
    status: e.status,
    date: e.createdAt,
  }));

  res.status(200).json({
    success: true,
    count: enquiries.length,
    counters: {
      total,
      new: newCount,
      pending: pendingCount,
      replied: repliedCount,
      spam: spamCount,
    },
    data: enquiries,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

// Update the status of an enquiry (New, Pending, Replied, Spam)
export const updateEnquiryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["New", "Pending", "Replied", "Spam"];

  // Validate the status value
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Bad Request (Invalid workflow status)" });
  }

  const enquiry = await Contact.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true },
  );

  if (!enquiry) {
    return res.status(404).json({ success: false, message: "Target Record ID Not Found" });
  }

  res.status(200).json({
    success: true,
    message: "Enquiry status transitioned successfully.",
    data: {
      enquiry_id: enquiry._id,
      status: enquiry.status,
    },
  });
});

// Delete an enquiry from the database
export const deleteEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Contact.findByIdAndDelete(req.params.id);

  if (!enquiry) {
    return res.status(404).json({ success: false, message: "Record index not found" });
  }

  res.status(200).json({
    success: true,
    message: "Enquiry record successfully purged from active logs.",
  });
});
