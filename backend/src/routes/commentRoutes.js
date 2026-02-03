const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

// Routes for adding and getting comments for a lead
router.post("/:id/comments", commentController.addComment);
router.get("/:id/comments", commentController.getComments);

module.exports = router;
