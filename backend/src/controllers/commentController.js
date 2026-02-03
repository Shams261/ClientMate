const Comment = require("../models/Comment");
const Lead = require("../models/Lead");
const SalesAgent = require("../models/SalesAgent");

// adding a comment to a lead
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params; // lead id
    const { author, commentText } = req.body;

    // Validate lead existence
    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    // Validate author existence
    const agenntExists = await SalesAgent.findById(author);
    if (!agenntExists) {
      return res.status(404).json({ error: "Authoring Sales Agent not found" });
    }

    // Create the comment
    const comment = await Comment.create({
      lead: id,
      author,
      commentText,
    });

    // populate author details
    await comment.populate("author", "name email");

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};
exports.getComments = async (req, res, next) => {
  try {
    const { id } = req.params; // Lead ID

    // Validate: Does lead exist?
    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({
        error: `Lead with ID '${id}' not found.`,
      });
    }

    const comments = await Comment.find({ lead: id })
      .populate("author", "name email")
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
