import { Hono } from "hono";
import { authRequired } from "../lib/auth.js";
import { getQuestions, submitQuiz } from "../core/quiz.js";

const quiz = new Hono();

quiz.use("*", authRequired);

quiz.get("/questions", (c) => {
  return c.json({ questions: getQuestions() });
});

quiz.post("/submit", async (c) => {
  try {
    const user = c.get("user");
    const body = await c.req.json().catch(() => ({}));
    const userId = user?.uid || body?.userId;
    if (!userId) return c.json({ error: "missing_user" }, 400);

    const result = await submitQuiz(c.env, {
      userId,
      answers: body.answers || {}
    });
    return c.json({ score: result.score });
  } catch (error) {
    return c.json({ error: "quiz_submit_failed" }, 500);
  }
});

export default quiz;
