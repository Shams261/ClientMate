const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");

// GET /tags - Get all tags
router.get("/", tagController.getAllTags);

// POST /tags - Create a new tag
router.post("/", tagController.createTag);

module.exports = router;
