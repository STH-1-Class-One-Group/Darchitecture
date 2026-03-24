const express = require("express");
const { listReports, getReport } = require("../core/report");
const { sendError } = require("../core/http");

const router = express.Router();

router.get("/list", (req, res) => {
  const userId = req.user?.uid;
  if (!userId) return sendError(res, 401);

  Promise.resolve(listReports(userId))
    .then((reports) => res.json({ reports }))
    .catch(() => sendError(res, 500));
});

router.get("/:id", (req, res) => {
  const userId = req.user?.uid;
  if (!userId) return sendError(res, 401);

  Promise.resolve(getReport(req.params.id))
    .then((report) => {
      if (!report) return sendError(res, 404);
      if (report.userId !== userId) {
        return sendError(res, 403);
      }
      return res.json({ report });
    })
    .catch(() => sendError(res, 500));
});

module.exports = router;
