const express = require("express");
const { getQuestions, submitQuiz } = require("../core/quiz");

const router = express.Router();

router.get("/questions", (req, res) => {
  res.json({ questions: getQuestions() });
});

router.post("/submit", (req, res) => {
  const { userId, answers } = req.body;
  if (!userId) return res.status(400).json({ error: "missing_user" });
  submitQuiz({ userId, answers })
    .then((result) => res.json({ score: result.score }))
    .catch(() => res.status(500).json({ error: "quiz_submit_failed" }));
});

module.exports = router;
