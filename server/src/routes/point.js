import { Hono } from "hono";
import { authRequired } from "../lib/auth.js";
import { getBalance, getLogs } from "../core/point.js";

const point = new Hono();

point.use("*", authRequired);

point.get("/balance", async (c) => {
  try {
    const user = c.get("user");
    const userId = user?.uid || c.req.query("userId");
    if (!userId) return c.json({ balance: 0 });

    const balance = await getBalance(c.env, userId);
    return c.json({ balance });
  } catch (error) {
    return c.json({ error: "point_balance_failed" }, 500);
  }
});

point.get("/log", async (c) => {
  try {
    const user = c.get("user");
    const userId = user?.uid || c.req.query("userId");
    if (!userId) return c.json({ logs: [] });

    const logs = await getLogs(c.env, userId);
    return c.json({ logs });
  } catch (error) {
    return c.json({ error: "point_log_failed" }, 500);
  }
});

export default point;
