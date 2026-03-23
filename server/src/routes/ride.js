import { Hono } from "hono";
import { authRequired } from "../lib/auth.js";
import { endRide, startRide } from "../core/ride.js";

const ride = new Hono();

ride.use("*", authRequired);

ride.post("/start", async (c) => {
  try {
    const user = c.get("user");
    const body = await c.req.json().catch(() => ({}));
    const userId = user?.uid || body?.userId;
    if (!userId) return c.json({ error: "missing_user" }, 400);

    const result = await startRide(c.env, { userId });
    return c.json({ rideId: result.id, startTime: result.startTime });
  } catch (error) {
    return c.json({ error: "ride_start_failed" }, 500);
  }
});

ride.post("/end", async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    if (!body?.rideId) return c.json({ error: "missing_ride" }, 400);

    const result = await endRide(c.env, {
      rideId: body.rideId,
      coordinates: body.coordinates || []
    });

    if (!result) return c.json({ error: "ride_not_found" }, 404);
    return c.json({ report: result.report });
  } catch (error) {
    return c.json({ error: "ride_end_failed" }, 500);
  }
});

export default ride;
