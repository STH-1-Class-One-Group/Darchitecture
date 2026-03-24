const express = require("express");
const { getQuestions, submitQuiz } = require("../core/quiz");
const { sendError } = require("../core/http");

const router = express.Router();

router.get("/questions", (req, res) => {
  res.json({ questions: getQuestions() });
});

router.post("/submit", (req, res) => {
  const userId = req.user?.uid;
  const { answers } = req.body;
  if (!userId) return sendError(res, 401);

  Promise.resolve(submitQuiz({ userId, answers }))
    .then((result) => res.json({ score: result.score }))
    .catch(() => sendError(res, 500));
});

module.exports = router;
