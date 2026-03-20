const express = require("express");
const { startRide, endRide } = require("../core/ride");

const router = express.Router();

router.post("/start", (req, res) => {
  const userId = req.user?.uid || req.body.userId;
  if (!userId) return res.status(400).json({ error: "missing_user" });
  Promise.resolve(startRide({ userId }))
    .then((ride) => res.json({ rideId: ride.id, startTime: ride.startTime }))
    .catch((error) => {
      return res.status(500).json({ error: "ride_start_failed" });
    });
});

router.post("/end", (req, res) => {
  const { rideId, coordinates } = req.body;
  if (!rideId) return res.status(400).json({ error: "missing_ride" });
  Promise.resolve(endRide({ rideId, coordinates }))
    .then((result) => {
      if (!result) return res.status(404).json({ error: "ride_not_found" });
      return res.json({ report: result.report });
    })
    .catch(() => res.status(500).json({ error: "ride_end_failed" }));
});

module.exports = router;
