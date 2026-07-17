import FAQ from "../models/faq.model.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { escapeRegex } from "../utils/helpers.js";

// Get all active FAQs (public)
export const getAllFAQs = asyncHandler(async (req, res) => {
  const faqs = await FAQ.find({ status: "Active" })
    .populate("service", "service_name slug")
    .sort({ display_order: 1, createdAt: -1 });
  res.status(200).json({ success: true, data: faqs });
});

export const getFAQsByService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const faqs = await FAQ.find({ service: serviceId, status: "Active" })
    .sort({ display_order: 1, createdAt: -1 });
  res.status(200).json({ success: true, data: faqs });
});

export const getAllAdminFAQs = asyncHandler(async (req, res) => {
  const { search, status, service, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (search) {
    filter.question = { $regex: escapeRegex(search), $options: "i" };
  }
  if (status) filter.status = status;
  if (service) filter.service = service;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await FAQ.countDocuments(filter);
  const faqs = await FAQ.find(filter)
    .populate("service", "service_name slug")
    .sort({ display_order: 1, createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: faqs.length,
    data: faqs,
    pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
  });
});

export const createFAQ = asyncHandler(async (req, res) => {
  const { question, answer, service, display_order, status } = req.body;
  if (!question || !answer || !service) {
    return res.status(400).json({ success: false, message: "Please fill in the question, answer, and assign a service before saving." });
  }
  const faq = await FAQ.create({ question, answer, service, display_order, status });
  res.status(201).json({ success: true, message: "FAQ created successfully", data: faq });
});

export const updateFAQ = asyncHandler(async (req, res) => {
  const { question, answer, service, display_order, status } = req.body;
  const update = {};
  if (question !== undefined) update.question = question;
  if (answer !== undefined) update.answer = answer;
  if (service !== undefined) update.service = service;
  if (display_order !== undefined) update.display_order = display_order;
  if (status !== undefined) update.status = status;
  const faq = await FAQ.findByIdAndUpdate(
    req.params.id,
    update,
    { new: true, runValidators: true },
  );
  if (!faq) {
    return res.status(404).json({ success: false, message: "We couldn't find this FAQ. It may have been removed." });
  }
  res.status(200).json({ success: true, message: "FAQ updated successfully", data: faq });
});

export const deleteFAQ = asyncHandler(async (req, res) => {
  const faq = await FAQ.findByIdAndDelete(req.params.id);
  if (!faq) {
    return res.status(404).json({ success: false, message: "We couldn't find this FAQ. It may have been removed." });
  }
  res.status(200).json({ success: true, message: "FAQ deleted successfully" });
});

export const deleteAllFAQs = asyncHandler(async (req, res) => {
  const result = await FAQ.deleteMany({});
  res.status(200).json({
    success: true,
    message: `${result.deletedCount} FAQ(s) deleted successfully.`,
  });
});
