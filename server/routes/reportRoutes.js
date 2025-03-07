const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

/**
 * @swagger
 * components:
 *   schemas:
 *     Image:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *         key:
 *           type: string
 *         fileType:
 *           type: string
 *         fileName:
 *           type: string
 *         isDeleted:
 *           type: boolean
 *       required:
 *         - url
 *
 *     Item:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *         costCode:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Image'
 *       required:
 *         - description
 *         - costCode
 *
 *     Report:
 *       type: object
 *       properties:
 *         issueId:
 *           type: string
 *         user:
 *           type: string
 *         title:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Item'
 *         type:
 *           type: string
 *         parts:
 *           type: string
 *         approvalNeeded:
 *           type: boolean
 *         links:
 *           type: array
 *           items:
 *             type: string
 *       required:
 *         - issueId
 *         - user
 *         - title
 *         - items
 */

/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Creates a new report.
 *     tags:
 *       - Reports
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Report'
 *     responses:
 *       201:
 *         description: Report created successfully.
 *       400:
 *         description: Missing required fields or invalid format.
 *       500:
 *         description: Internal server error.
 */
router.post("/", reportController.createReport);

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Retrieves all reports (excluding soft-deleted).
 *     tags:
 *       - Reports
 *     responses:
 *       200:
 *         description: List of reports.
 *       500:
 *         description: Internal server error.
 */
router.get("/", reportController.getReports);

/**
 * @swagger
 * /api/reports/{id}:
 *   get:
 *     summary: Retrieves a report by its ID.
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the report.
 *     responses:
 *       200:
 *         description: Report found.
 *       404:
 *         description: Report not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", reportController.getReportById);

/**
 * @swagger
 * /api/reports/{id}:
 *   put:
 *     summary: Updates a report by its ID.
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the report.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Report'
 *     responses:
 *       200:
 *         description: Report updated successfully.
 *       404:
 *         description: Report not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/:id", reportController.updateReport);

/**
 * @swagger
 * /api/reports/{id}:
 *   delete:
 *     summary: Soft deletes a report by its ID.
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the report.
 *     responses:
 *       200:
 *         description: Report soft deleted successfully.
 *       404:
 *         description: Report not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", reportController.deleteReport);

module.exports = router;