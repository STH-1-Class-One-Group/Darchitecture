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

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/ride", rideRoutes);
app.use("/report", reportRoutes);
app.use("/point", pointRoutes);
app.use("/map", mapRoutes);
app.use("/quiz", quizRoutes);
app.use("/usage", usageRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
