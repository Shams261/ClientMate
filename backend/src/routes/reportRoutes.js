const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

// Report routes
router.get("/last-week", reportController.getLeadsClosedLastWeek);
router.get("/pipeline", reportController.getPipelineReport);
router.get("/closed-by-agent", reportController.getClosedBySalesAgent);

module.exports = router;
