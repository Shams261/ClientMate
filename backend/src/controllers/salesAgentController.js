const SalesAgent = require("../models/SalesAgent");

// creating the sales agent

exports.createAgent = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if sales agent with the same email already exists
    const existingAgent = await SalesAgent.findOne({ email });
    if (existingAgent) {
      return res
        .status(400)
        .json({ error: "Sales Agent with this email already exists" });
    }
    const agent = await SalesAgent.create({ name, email });
    res.status(201).json(agent);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// getting all sales agents

exports.getAgents = async (req, res) => {
  try {
    const agents = await SalesAgent.find();
    res.status(200).json(agents);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};
