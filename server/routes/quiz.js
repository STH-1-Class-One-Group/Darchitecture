const express = require('express');
const quizCore = require('../core/quiz');

const router = express.Router();

router.get('/questions', (req, res) => {
  const questions = quizCore.getQuestions();
  res.json({ questions });
});

router.post('/submit', (req, res) => {
  const result = quizCore.submitQuiz(req.body || {});
  res.json({ result });
});

module.exports = router;
