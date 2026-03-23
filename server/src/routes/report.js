import { Hono } from "hono";
import { authRequired } from "../lib/auth.js";
import { getReport, listReports } from "../core/report.js";

const report = new Hono();

report.use("*", authRequired);

report.get("/list", async (c) => {
  try {
    const user = c.get("user");
    const userId = user?.uid || c.req.query("userId");
    if (!userId) return c.json({ reports: [] });

    const rows = await listReports(c.env, userId);
    return c.json({ reports: rows });
  } catch (error) {
    return c.json({ error: "report_list_failed" }, 500);
  }
});

report.get("/:id", async (c) => {
  try {
    const reportId = c.req.param("id");
    const user = c.get("user");
    const row = await getReport(c.env, reportId);
    if (!row) return c.json({ error: "not_found" }, 404);
    if (user?.uid && row.userId !== user.uid) return c.json({ error: "forbidden" }, 403);
    return c.json({ report: row });
  } catch (error) {
    return c.json({ error: "report_fetch_failed" }, 500);
  }
});

export default report;
