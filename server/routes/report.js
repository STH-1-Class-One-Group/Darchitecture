const express = require("express");
const { listReports, getReport } = require("../core/report");

const router = express.Router();

router.get("/list", (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.json({ reports: [] });
  return res.json({ reports: listReports(userId) });
});

router.get("/:id", (req, res) => {
  const report = getReport(req.params.id);
  if (!report) return res.status(404).json({ error: "not_found" });
  return res.json({ report });
});

module.exports = router;
