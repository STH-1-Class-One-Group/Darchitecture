import React, { useEffect, useMemo, useState } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Button from "../components/Button";
import QuizItem from "../components/QuizItem";
import { API_BASE_URL, API_ENDPOINTS } from "../constants/apiConstants";

export default function QuizScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const contentWidth = useMemo(() => Math.min(width, 520), [width]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.quizQuestions}`);
        setQuestions(res.data.questions || []);
      } catch (error) {
        setQuestions([]);
      }
    };
    load();
  }, []);

  const submit = async () => {
    const userId = await AsyncStorage.getItem("user_id");
    try {
      const res = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.quizSubmit}`, {
        userId,
        answers
      });
      Alert.alert("퀴즈 제출", `점수: ${res.data.score}점`);
      navigation.navigate("Map");
    } catch (error) {
      Alert.alert("제출 실패", "서버 연결을 확인해주세요.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.content, { maxWidth: contentWidth }]}> 
        <Text style={styles.title}>탄소중립 퀴즈</Text>
        {questions.length === 0 ? (
          <Text style={styles.empty}>퀴즈를 불러오는 중입니다.</Text>
        ) : (
          questions.map((q) => (
            <QuizItem
              key={q.id}
              item={q}
              selected={answers[q.id]}
              onSelect={(choice) => setAnswers((prev) => ({ ...prev, [q.id]: choice }))}
            />
          ))
        )}
        <Button label="제출하기" onPress={submit} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FBF8"
  },
  content: {
    padding: 24,
    width: "100%",
    alignSelf: "center"
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12
  },
  empty: {
    color: "#60726B"
  }
});