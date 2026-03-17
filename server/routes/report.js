const express = require('express');
const reportCore = require('../core/report');

const router = express.Router();

router.get('/list', (req, res) => {
  const { userId } = req.query || {};
  const reports = reportCore.listReports(userId);
  res.json({ reports });
});

router.get('/:id', (req, res) => {
  const report = reportCore.getReport(req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'report_not_found' });
  }
  return res.json({ report });
});

module.exports = router;
