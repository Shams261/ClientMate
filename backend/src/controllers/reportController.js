const Lead = require("../models/Lead");

// GET Leads Closed Last Week
exports.getLeadsClosedLastWeek = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const closedLeads = await Lead.find({
      status: "Closed",
      closedAt: { $gte: sevenDaysAgo }, // Greater than or equal to 7 days ago
    })
      .populate("salesAgent", "name email")
      .sort({ closedAt: -1 });

    res.status(200).json(closedLeads);
  } catch (error) {
    next(error);
  }
};

// GET Total Leads in Pipeline (grouped by status)
exports.getPipelineReport = async (req, res, next) => {
  try {
    // Aggregate leads by status (exclude Closed)
    const pipeline = await Lead.aggregate([
      {
        $match: { status: { $ne: "Closed" } }, // Not equal to Closed
      },
      {
        $group: {
          _id: "$status", // Group by status
          count: { $sum: 1 }, // Count leads in each status
        },
      },
      {
        $sort: { count: -1 }, // Sort by count descending
      },
    ]);

    // Calculate total leads in pipeline
    const totalLeadsInPipeline = pipeline.reduce(
      (sum, item) => sum + item.count,
      0,
    );

    res.status(200).json({
      totalLeadsInPipeline,
      breakdown: pipeline,
    });
  } catch (error) {
    next(error);
  }
};

// GET Leads Closed by Sales Agent
exports.getClosedBySalesAgent = async (req, res, next) => {
  try {
    const closedByAgent = await Lead.aggregate([
      {
        $match: { status: "Closed" },
      },
      {
        $group: {
          _id: "$salesAgent", // Group by salesAgent
          count: { $sum: 1 }, // Count closed leads
          leads: { $push: { name: "$name", closedAt: "$closedAt" } }, // Collect lead details
        },
      },
      {
        $lookup: {
          // JOIN with SalesAgent collection
          from: "salesagents",
          localField: "_id",
          foreignField: "_id",
          as: "agentDetails",
        },
      },
      {
        $unwind: "$agentDetails", // Flatten array
      },
      {
        $project: {
          // Format output
          _id: 0,
          salesAgent: {
            id: "$agentDetails._id",
            name: "$agentDetails.name",
            email: "$agentDetails.email",
          },
          closedLeadsCount: "$count",
          leads: 1,
        },
      },
      {
        $sort: { closedLeadsCount: -1 }, // Top performers first
      },
    ]);

    res.status(200).json(closedByAgent);
  } catch (error) {
    next(error);
  }
};
