const mongoose = require("mongoose");

// Comment Schema yah banaya ja raha hai jo lead par comments ko represent karega
const commentSchema = new mongoose.Schema({
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead", // Reference to the Lead model jisme comment kiya ja raha hai
    required: [true, "Lead reference is required"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SalesAgent", // Reference to the SalesAgent who authored the comment means the sales agent jo comment kar raha hai
    required: [true, "Author is required"],
  },
  commentText: {
    type: String,
    required: [true, "Comment text is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation time ye field ko automatically set kar dega jab comment create hoga
  },
});

module.exports = mongoose.model("Comment", commentSchema);
