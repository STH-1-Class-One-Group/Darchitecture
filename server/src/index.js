import { Hono } from "hono";
import { cors } from "hono/cors";

import authRoutes from "./routes/auth.js";
import rideRoutes from "./routes/ride.js";
import reportRoutes from "./routes/report.js";
import pointRoutes from "./routes/point.js";
import mapRoutes from "./routes/map.js";
import quizRoutes from "./routes/quiz.js";
import usageRoutes from "./routes/usage.js";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Authorization", "Content-Type", "Accept"]
  })
);

app.get("/health", (c) => c.json({ status: "ok" }));

app.route("/auth", authRoutes);
app.route("/ride", rideRoutes);
app.route("/report", reportRoutes);
app.route("/point", pointRoutes);
app.route("/map", mapRoutes);
app.route("/quiz", quizRoutes);
app.route("/usage", usageRoutes);

app.onError((error, c) => {
  console.error(error);
  return c.json({ error: "internal_error" }, 500);
});

app.notFound((c) => c.json({ error: "not_found" }, 404));

export default app;
