const express = require("express");
const cors = require("cors");
const leadRoutes = require("./routes/leadRoutes");
const salesAgentRoutes = require("./routes/salesAgentRoutes");
const commentRoutes = require("./routes/commentRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// Middleware setup iska kaam hai incoming requests ko handle karna matlab ek example ke taur pe json data ko parse karna
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/leads", leadRoutes); // CRUD routes for leads
app.use("/leads", commentRoutes); // Routes for adding and getting comments for a lead
app.use("/agents", salesAgentRoutes); // CRUD routes for sales agents

app.use("/report", reportRoutes);

// Health check route - API chal raha hai ya nahi ye check karne ke liye
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Anvaya CRM API is running",
    version: "1.0.0",
  });
});

// 404 Handler - Must be AFTER all routes taaki ye sare routes ke baad hi chale
app.use((req, res, next) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// Error Handler - Must be LAST middleware help karne ke liye centralized error handling
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error handling dakhte hain ki validation error hai ya nahi
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: Object.values(err.errors)
        .map((e) => e.message)
        .join(", "),
    });
  }

  // Mongoose cast error (invalid ObjectId) handling dikhate hain ki ObjectId galat hai ya nahi
  if (err.name === "CastError") {
    return res.status(400).json({
      error: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // Duplicate key error (MongoDB unique constraint) handling dikhate hain ki duplicate key error hai ya nahi
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      error: `${field} already exists.`,
    });
  }

  // Default error handler - Agar koi aur error aaye to yeh handle karega
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

module.exports = app;
