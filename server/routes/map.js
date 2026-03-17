const express = require('express');
const { getStations } = require('../proxy/stations');

const router = express.Router();

router.get('/stations', (req, res) => {
  const stations = getStations();
  res.json({ stations });
});

module.exports = router;
