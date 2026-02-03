const express = require("express");
const router = express.Router();
const leadController = require("../controllers/leadController");

// CRUD routes for leads
router.post("/", leadController.createLead);
router.get("/", leadController.getLeads);
router.put("/:id", leadController.updateLead);
router.delete("/:id", leadController.deleteLead);

module.exports = router;
