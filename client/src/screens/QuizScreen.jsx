import React, { useEffect, useMemo, useState } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions } from "react-native";
import Button from "../components/Button";
import QuizItem from "../components/QuizItem";
import apiClient from "../modules/apiClient";
import { API_ENDPOINTS } from "../constants/apiConstants";

export default function QuizScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const contentWidth = useMemo(() => Math.min(width, 520), [width]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get(API_ENDPOINTS.quizQuestions);
        setQuestions(res.data.questions || []);
      } catch (error) {
        setQuestions([]);
      }
    };
    load();
  }, []);

  const submit = async () => {
    try {
      const res = await apiClient.post(API_ENDPOINTS.quizSubmit, { answers });
      Alert.alert("Quiz submitted", `Score: ${res.data.score}`);
      navigation.navigate("Map");
    } catch (error) {
      Alert.alert("Submit failed", "Please check the server connection.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.content, { maxWidth: contentWidth }]}>
        <Text style={styles.title}>Tacu Quiz</Text>
        {questions.length === 0 ? (
          <Text style={styles.empty}>Loading questions...</Text>
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
        <Button label="Submit" onPress={submit} />
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
