const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  key: {
    type: String,
  },
  fileType: {
    type: String,
  },
  fileName: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
});

const itemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  costCode: {
    type: String,
    required: true,
    trim: true,
  },
  images: [imageSchema],
});

const reportSchema = new mongoose.Schema({
  isDeleted: {
    type: Boolean,
    default: false,
  },
  issueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Issue",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  items: [itemSchema],
  type: {
    type: String,
    trim: true,
  },
  parts: {
    type: String,
    trim: true,
  },
  approvalNeeded: {
    type: Boolean,
    default: false,
  },
  links: [
    {
      type: String,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;