import { createId } from "../lib/id.js";
import { COLLECTIONS, ensureUserDocument, incrementUserAggregates, listCollectionByUser, serverTimestamp, setDocument } from "./firestoreStore.js";

const QUESTIONS = [
  {
    id: "q1",
    question: "Why does bike sharing help the environment?",
    choices: ["It increases car use", "It reduces vehicle emissions", "It produces more traffic"],
    answer: "It reduces vehicle emissions"
  },
  {
    id: "q2",
    question: "What matters most for sustainable transport?",
    choices: ["Short routes, low energy, low emissions", "Fastest roads only", "More parking lots"],
    answer: "Short routes, low energy, low emissions"
  },
  {
    id: "q3",
    question: "Which city is this prototype for?",
    choices: ["Daejeon", "Seoul", "Busan"],
    answer: "Daejeon"
  }
];

export function getQuestions() {
  return QUESTIONS.map(({ answer, ...rest }) => rest);
}

export async function submitQuiz(env, { userId, answers }) {
  await ensureUserDocument(env, userId);

  const score = QUESTIONS.reduce((acc, question) => {
    return acc + (answers && answers[question.id] === question.answer ? 1 : 0);
  }, 0);

  const resultId = createId("quiz");
  const result = {
    id: resultId,
    quizID: resultId,
    userId,
    score,
    takenAt: serverTimestamp(),
    type: "initial",
    createdAt: serverTimestamp()
  };

  await setDocument(env, COLLECTIONS.quizResults, resultId, result);
  await incrementUserAggregates(env, userId, { quizId: resultId });

  return result;
}

export async function listQuizResults(env, userId) {
  return listCollectionByUser(env, COLLECTIONS.quizResults, userId, "takenAt");
}
