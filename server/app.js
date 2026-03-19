const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const rideRoutes = require("./routes/ride");
const reportRoutes = require("./routes/report");
const pointRoutes = require("./routes/point");
const mapRoutes = require("./routes/map");
const quizRoutes = require("./routes/quiz");
const usageRoutes = require("./routes/usage");
const { verifyFirebaseToken } = require("./core/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/ride", verifyFirebaseToken, rideRoutes);
app.use("/report", verifyFirebaseToken, reportRoutes);
app.use("/point", verifyFirebaseToken, pointRoutes);
app.use("/map", verifyFirebaseToken, mapRoutes);
app.use("/quiz", verifyFirebaseToken, quizRoutes);
app.use("/usage", verifyFirebaseToken, usageRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
