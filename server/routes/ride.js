const express = require("express");
const { startRide, endRide } = require("../core/ride");

const router = express.Router();

router.post("/start", (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "missing_user" });
  const ride = startRide({ userId });
  return res.json({ rideId: ride.id, startTime: ride.startTime });
});

router.post("/end", (req, res) => {
  const { rideId, coordinates } = req.body;
  if (!rideId) return res.status(400).json({ error: "missing_ride" });
  const result = endRide({ rideId, coordinates });
  if (!result) return res.status(404).json({ error: "ride_not_found" });
  return res.json({ report: result.report });
});

module.exports = router;
