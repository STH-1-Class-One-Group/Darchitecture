const express = require("express");
const { listReports, getReport } = require("../core/report");

const router = express.Router();

router.get("/list", (req, res) => {
  const userId = req.user?.uid || req.query.userId;
  if (!userId) return res.json({ reports: [] });
  return res.json({ reports: listReports(userId) });
});

router.get("/:id", (req, res) => {
  const report = getReport(req.params.id);
  if (!report) return res.status(404).json({ error: "not_found" });
  if (req.user?.uid && report.userId !== req.user.uid) {
    return res.status(403).json({ error: "forbidden" });
  }
  return res.json({ report });
});

module.exports = router;
