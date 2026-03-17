const express = require('express');
const rideCore = require('../core/ride');

const router = express.Router();

router.post('/start', (req, res) => {
  const { userId } = req.body || {};
  const ride = rideCore.startRide(userId || 'guest');
  res.json({ ride });
});

router.post('/end', (req, res) => {
  const { rideId, coordinates } = req.body || {};
  const result = rideCore.endRide(rideId, coordinates);
  if (result.error) {
    return res.status(404).json({ error: result.error });
  }
  return res.json(result);
});

module.exports = router;
