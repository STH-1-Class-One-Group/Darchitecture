import React, { useMemo, useState } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';
import QuizItem from '../components/QuizItem';

const QUESTIONS = [
  {
    id: 'q1',
    question: '대전시의 공용자전거 이름은?',
    options: ['타슈', '따릉이', '누비자'],
    answer: '타슈',
  },
  {
    id: 'q2',
    question: '자전거 이용이 줄여주는 것은?',
    options: ['탄소 배출', '미세먼지', '전기 사용'],
    answer: '탄소 배출',
  },
  {
    id: 'q3',
    question: '탄소중립을 위해 가장 먼저 할 수 있는 일은?',
    options: ['이동 수단 바꾸기', '플라스틱 늘리기', '전력 소비 증가'],
    answer: '이동 수단 바꾸기',
  },
];

export default function QuizScreen({ onDone }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    return QUESTIONS.reduce((acc, item) => {
      if (answers[item.id] === item.answer) return acc + 1;
      return acc;
    }, 0);
  }, [answers]);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card style={styles.card}>
        <Text style={styles.title}>탄소중립 지식 퀴즈</Text>
        <Text style={styles.meta}>점수는 추후 KPI 측정에 사용됩니다.</Text>
      </Card>

      {QUESTIONS.map((item) => (
        <QuizItem
          key={item.id}
          item={item}
          selected={answers[item.id]}
          onSelect={(choice) => setAnswers((prev) => ({ ...prev, [item.id]: choice }))}
        />
      ))}

      {!submitted ? (
        <Button label="제출하기" onPress={handleSubmit} />
      ) : (
        <Card style={styles.card}>
          <Text style={styles.result}>현재 점수: {score} / {QUESTIONS.length}</Text>
          <Button label="마이페이지로 돌아가기" onPress={onDone} variant="ghost" />
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 16,
    color: '#1F3A2E',
  },
  meta: {
    marginTop: 6,
    color: '#4A5E4F',
  },
  result: {
    fontFamily: 'serif',
    fontSize: 16,
    color: '#1F3A2E',
    marginBottom: 12,
  },
});
