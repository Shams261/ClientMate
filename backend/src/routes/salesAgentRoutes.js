const express = require("express");
const router = express.Router();
const salesAgentController = require("../controllers/salesAgentController");

// CRUD routes for sales agents
router.post("/", salesAgentController.createAgent);
router.get("/", salesAgentController.getAgents);

module.exports = router;
