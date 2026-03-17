import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import Card from '../components/Card';
import Button from '../components/Button';
import PointLogItem from '../components/PointLogItem';

export default function MyPageScreen({ user, region, pointBalance, pointLogs, onOpenQuiz }) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card style={styles.card}>
        <Text style={styles.title}>{user?.name}님의 탄소중립 기록</Text>
        <Text style={styles.meta}>이메일: {user?.email}</Text>
        <Text style={styles.meta}>지역: {region?.label}</Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.title}>녹색포인트 잔액</Text>
        <Text style={styles.balance}>{pointBalance} P</Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.title}>적립 로그</Text>
        {pointLogs.length === 0 && <Text style={styles.meta}>아직 적립 내역이 없습니다.</Text>}
        {pointLogs.map((log) => (
          <PointLogItem key={log.id} amount={log.amount} earnedAt={log.earnedAt} />
        ))}
      </Card>

      <Button label="탄소 지식 퀴즈 풀기" onPress={onOpenQuiz} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginBottom: 14,
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
  balance: {
    marginTop: 10,
    fontSize: 22,
    fontFamily: 'Georgia',
    color: '#1F3A2E',
  },
});
