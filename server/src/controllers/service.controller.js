import Services from "../models/services.model.js";

export const createService = async (req, res) => {
  try {
    const { service_name, short_description, description, image, status } = req.body;

    if (!service_name || !short_description || !description || !image) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const existing = await Services.findOne({ service_name });
    if (existing) {
      return res.status(409).json({ success: false, message: "Service already exists" });
    }

    const service = await Services.create({ service_name, short_description, description, image, status });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (search) {
      filter.service_name = { $regex: search, $options: "i" };
    }
    if (status) {
      filter.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Services.countDocuments(filter);
    const services = await Services.find(filter).skip(skip).limit(Number(limit));

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Services.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { service_name, short_description, description, image, status } = req.body;

    if (!service_name && !short_description && !description && !image && !status) {
      return res.status(400).json({ success: false, message: "No fields to update" });
    }

    const service = await Services.findByIdAndUpdate(
      req.params.id,
      { service_name, short_description, description, image, status },
      { new: true, runValidators: true },
    );
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: service,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Services.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.status(200).json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllAdminServices = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (search) {
      filter.service_name = { $regex: search, $options: "i" };
    }
    if (status) {
      filter.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Services.countDocuments(filter);
    const services = await Services.find(filter).skip(skip).limit(Number(limit));

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
