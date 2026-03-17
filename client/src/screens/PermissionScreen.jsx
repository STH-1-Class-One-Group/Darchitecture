import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../components/Card';
import PermissionRow from '../components/PermissionRow';

export default function PermissionScreen() {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>권한 현황</Text>
        <Text style={styles.meta}>필수 권한을 확인하고 언제든지 설정을 변경할 수 있어요.</Text>
      </Card>

      <Card style={styles.card}>
        <PermissionRow label="위치" status="허용" />
        <PermissionRow label="카메라" status="비허용" />
        <PermissionRow label="알림" status="허용" />
      </Card>
    </View>
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
});
