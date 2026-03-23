import { Hono } from "hono";
import { authRequired } from "../lib/auth.js";
import { logUsage } from "../core/usage.js";

const usage = new Hono();

usage.use("*", authRequired);

usage.post("/log", async (c) => {
  try {
    const user = c.get("user");
    const body = await c.req.json().catch(() => ({}));
    const userId = user?.uid || body?.userId;
    const action = body?.action;
    if (!userId || !action) return c.json({ error: "missing_fields" }, 400);

    const log = await logUsage(c.env, { userId, action });
    return c.json({ logged: log.id });
  } catch (error) {
    return c.json({ error: "usage_log_failed" }, 500);
  }
});

export default usage;
