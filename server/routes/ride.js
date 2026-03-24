const express = require("express");
const { startRide, endRide } = require("../core/ride");
const { sendError } = require("../core/http");

const router = express.Router();

router.post("/start", (req, res) => {
  const userId = req.user?.uid;
  if (!userId) return sendError(res, 401);

  Promise.resolve(startRide({ userId }))
    .then((ride) => res.json({ rideId: ride.id, startTime: ride.startTime }))
    .catch(() => sendError(res, 500));
});

router.post("/end", (req, res) => {
  const userId = req.user?.uid;
  const { rideId, coordinates } = req.body;

  if (!userId) return sendError(res, 401);
  if (!rideId) return sendError(res, 400, "BAD_REQUEST", "Missing rideId.");

  Promise.resolve(endRide({ rideId, userId, coordinates }))
    .then((result) => {
      if (!result) return sendError(res, 404);
      if (result.error === "forbidden") return sendError(res, 403);
      return res.json({ ride: result.ride, report: result.report });
    })
    .catch(() => sendError(res, 500));
});

module.exports = router;
