const { db, generateId } = require('../db/firebase');

const QUESTIONS = [
  {
    id: 'q1',
    question: '대전 공용자전거 이름은 무엇인가요?',
    options: ['타슈', '따릉이', '누비자'],
    answer: '타슈',
  },
  {
    id: 'q2',
    question: '자전거 이용은 어떤 효과가 있나요?',
    options: ['탄소 배출 감소', '탄소 배출 증가', '영향 없음'],
    answer: '탄소 배출 감소',
  },
  {
    id: 'q3',
    question: '탄소중립 실천 중 옳은 것은?',
    options: ['대중교통 이용', '일회용품 사용', '불필요한 전력 소비'],
    answer: '대중교통 이용',
  },
];

function getQuestions() {
  return QUESTIONS.map(({ answer, ...rest }) => rest);
}

function submitQuiz({ userId, answers = [], type = 'initial' }) {
  const score = QUESTIONS.reduce((acc, question, index) => {
    if (answers[index] === question.answer) return acc + 1;
    return acc;
  }, 0);

  const result = {
    id: generateId('quiz'),
    userId,
    score,
    takenAt: new Date().toISOString(),
    type,
  };

  db.quizResults.push(result);
  return result;
}

module.exports = {
  getQuestions,
  submitQuiz,
};
