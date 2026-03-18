const express = require("express");
const { getQuestions, submitQuiz } = require("../core/quiz");

const router = express.Router();

router.get("/questions", (req, res) => {
  res.json({ questions: getQuestions() });
});

router.post("/submit", (req, res) => {
  const { userId, answers } = req.body;
  if (!userId) return res.status(400).json({ error: "missing_user" });
  const result = submitQuiz({ userId, answers });
  return res.json({ score: result.score });
});

module.exports = router;
