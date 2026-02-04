const Tag = require("../models/Tag");

// GET /tags - Fetch all tags for populating dropdowns
exports.getAllTags = async (req, res) => {
  try {
    // Sort by name for consistent ordering in dropdowns
    const tags = await Tag.find().sort({ name: 1 });
    res.status(200).json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// jab naya tag create karna ho toh ye function use hoga
exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;

    // name field ka validation important hai
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Tag name is required" });
    }

    // Normalize the tag name by trimming whitespace
    const normalizedName = name.trim();

    // Check for duplicate tag names (case-insensitive)
    const existingTag = await Tag.findOne({ name: normalizedName });
    if (existingTag) {
      return res.status(409).json({
        error: `Tag '${normalizedName}' already exists.`,
      });
    }

    // Create the tag
    const tag = await Tag.create({ name: normalizedName });

    // Return 201 Created with the new tag
    res.status(201).json(tag);
  } catch (error) {
    console.error("Error creating tag:", error);

    // Handle MongoDB duplicate key error (in case of race condition)
    if (error.code === 11000) {
      return res.status(409).json({
        error: `Tag '${req.body.name}' already exists.`,
      });
    }

    res.status(500).json({ error: "Server Error" });
  }
};
