const { uid } = require("../db/firebase");
const {
  COLLECTIONS,
  ensureUserDocument,
  incrementUserAggregates,
  listCollectionByUser,
  quizResultRef,
  serverTimestamp
} = require("./firestoreStore");

const QUESTIONS = [
  {
    id: "q1",
    question: "자전거 이용이 탄소 절감에 도움이 되는 이유는?",
    choices: ["자동차 이용을 줄이기 때문", "연료를 많이 쓰기 때문", "도로가 넓어지기 때문"],
    answer: "자동차 이용을 줄이기 때문"
  },
  {
    id: "q2",
    question: "탄소중립의 의미는 무엇일까요?",
    choices: ["배출을 0으로 만든다", "배출과 흡수를 균형", "배출을 늘린다"],
    answer: "배출과 흡수를 균형"
  },
  {
    id: "q3",
    question: "타슈는 어느 지역 공공자전거인가요?",
    choices: ["대전", "부산", "광주"],
    answer: "대전"
  }
];

function getQuestions() {
  return QUESTIONS.map(({ answer, ...rest }) => rest);
}

async function submitQuiz({ userId, answers }) {
  await ensureUserDocument(userId);

  const score = QUESTIONS.reduce((acc, q) => {
    return acc + (answers && answers[q.id] === q.answer ? 1 : 0);
  }, 0);

  const resultId = uid("quiz");
  const result = {
    id: resultId,
    quizID: resultId,
    userId,
    score,
    takenAt: serverTimestamp(),
    type: "initial",
    createdAt: serverTimestamp()
  };

  await quizResultRef(resultId).set(result);
  await incrementUserAggregates(userId, { quizId: resultId });

  return result;
}

async function listQuizResults(userId) {
  return listCollectionByUser(COLLECTIONS.quizResults, userId, "takenAt");
}

module.exports = {
  getQuestions,
  submitQuiz,
  listQuizResults
};
