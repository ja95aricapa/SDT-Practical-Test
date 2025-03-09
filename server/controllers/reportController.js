const Report = require("../model/internal/Report");

/**
 * Create a new report.
 * @param {Object} req - Express request object containing report data.
 * @param {Object} res - Express response object.
 */
exports.createReport = async (req, res) => {
  try {
    const { issueId, user, title, items, type, parts, approvalNeeded, links } = req.body;

    // Validate required fields
    if (!issueId || !user || !title || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Missing required fields or 'items' array is empty." });
    }

    // Create a new report document
    const newReport = new Report({
      issueId,
      user,
      title,
      items,
      type,
      parts,
      approvalNeeded,
      links,
    });

    // Save report to database
    const savedReport = await newReport.save();
    res.status(201).json({
      message: "Report created successfully.",
      report: savedReport,
    });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

/**
 * Retrieve all reports that are not soft-deleted.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getReports = async (req, res) => {
  try {
    // Return only reports with isDeleted set to false
    const reports = await Report.find({ isDeleted: false });
    res.status(200).json({ reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

/**
 * Retrieve a report by its ID (if not soft-deleted).
 * @param {Object} req - Express request object containing the report ID.
 * @param {Object} res - Express response object.
 */
exports.getReportById = async (req, res) => {
  try {
    // Find report by ID and ensure it's not soft-deleted
    const report = await Report.findOne({ _id: req.params.id, isDeleted: false });
    if (!report) {
      return res.status(404).json({ message: "Report not found." });
    }
    res.status(200).json({ report });
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

/**
 * Update a report by its ID.
 * @param {Object} req - Express request object containing update data.
 * @param {Object} res - Express response object.
 */
exports.updateReport = async (req, res) => {
  try {
    const updateData = req.body;
    // Find and update the report ensuring it is not soft-deleted
    const updatedReport = await Report.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      updateData,
      { new: true }
    );
    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found." });
    }
    res.status(200).json({
      message: "Report updated successfully.",
      report: updatedReport,
    });
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

/**
 * Soft delete a report by its ID (set isDeleted to true).
 * @param {Object} req - Express request object containing the report ID.
 * @param {Object} res - Express response object.
 */
exports.deleteReport = async (req, res) => {
  try {
    // Update the report setting isDeleted to true
    const deletedReport = await Report.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!deletedReport) {
      return res.status(404).json({ message: "Report not found." });
    }
    res.status(200).json({
      message: "Report soft deleted successfully.",
      report: deletedReport,
    });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};