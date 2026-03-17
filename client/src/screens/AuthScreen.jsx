import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Button from '../components/Button';

export default function AuthScreen({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleLogin = () => {
    const profile = {
      id: `user_${Date.now()}`,
      name: name || '대전 시민',
      email: email || 'guest@tashu.local',
    };
    onLogin(profile);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>타슈 라이드 시작</Text>
      <Text style={styles.subtitle}>간단한 로그인으로 탄소중립 여정을 시작하세요.</Text>

      <View style={styles.form}>
        <Text style={styles.label}>이름</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="홍길동"
          style={styles.input}
        />
        <Text style={styles.label}>이메일</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@email.com"
          style={styles.input}
          autoCapitalize="none"
        />
      </View>

      <Button label="로그인하고 시작하기" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Georgia',
    color: '#1F3A2E',
    marginBottom: 6,
  },
  subtitle: {
    color: '#4A5E4F',
    marginBottom: 24,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
    fontFamily: 'serif',
    color: '#1F3A2E',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
});
