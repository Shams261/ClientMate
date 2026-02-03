const Lead = require("../models/Lead");
const SalesAgent = require("../models/SalesAgent");
const mongoose = require("mongoose");

// lead creating
exports.createLead = async (req, res, next) => {
  try {
    const { name, source, salesAgent, status, tags, timeToClose, priority } =
      req.body;

    // Validating ki salesAgent is a valid ObjectId hai ya nahi
    if (!salesAgent || !mongoose.Types.ObjectId.isValid(salesAgent)) {
      return res.status(400).json({
        error: `Invalid Sales Agent ID format. Received '${salesAgent}'.`,
      });
    }

    // Validating ki salesAgent exist karta hai ya nahi
    const agentExists = await SalesAgent.findById(salesAgent);
    if (!agentExists) {
      return res.status(404).json({
        error: `Sales agent with ID '${salesAgent}' not found.`,
      });
    }

    // Creating lead
    const lead = await Lead.create({
      name,
      source,
      salesAgent,
      status,
      tags,
      timeToClose,
      priority,
    });

    // Populate kr rhe hain salesAgent details
    await lead.populate("salesAgent", "name email");

    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
};

// saare leads get karne ka function with filtering
exports.getLeads = async (req, res, next) => {
  try {
    const { salesAgent, status, tags, source } = req.query;

    //  building filter object kiske based on query params
    const filter = {};
    if (salesAgent) filter.salesAgent = salesAgent;
    if (status) filter.status = status;
    if (source) filter.source = source;
    if (tags) filter.tags = { $in: tags.split(",") };

    const leads = await Lead.find(filter)
      .populate("salesAgent", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(leads);
  } catch (error) {
    next(error);
  }
};

// UPDATE Lead
exports.updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, source, salesAgent, status, tags, timeToClose, priority } =
      req.body;

    // validate kr rhe hain ki lead exist karta hai ya nahi
    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({
        error: `Lead with ID '${id}' not found.`,
      });
    }

    // Validate: If changing salesAgent, does new agent exist?
    if (salesAgent && salesAgent !== lead.salesAgent.toString()) {
      const agentExists = await SalesAgent.findById(salesAgent);
      if (!agentExists) {
        return res.status(404).json({
          error: `Sales agent with ID '${salesAgent}' not found.`,
        });
      }
    }

    // Update lead
    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { name, source, salesAgent, status, tags, timeToClose, priority },
      { new: true, runValidators: true },
    ).populate("salesAgent", "name email");

    res.status(200).json(updatedLead);
  } catch (error) {
    next(error);
  }
};

// DELETE Lead
exports.deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) {
      return res.status(404).json({
        error: `Lead with ID '${id}' not found.`,
      });
    }

    res.status(200).json({ message: "Lead deleted successfully." });
  } catch (error) {
    next(error);
  }
};
