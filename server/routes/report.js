const express = require("express");
const { listReports, getReport } = require("../core/report");

const router = express.Router();

router.get("/list", (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.json({ reports: [] });
  listReports(userId)
    .then((reports) => res.json({ reports }))
    .catch(() => res.status(500).json({ error: "report_list_failed" }));
});

router.get("/:id", (req, res) => {
  getReport(req.params.id)
    .then((report) => {
      if (!report) return res.status(404).json({ error: "not_found" });
      return res.json({ report });
    })
    .catch(() => res.status(500).json({ error: "report_fetch_failed" }));
});

module.exports = router;
