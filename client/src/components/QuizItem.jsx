import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function QuizItem({ item, selected, onSelect }) {
  return (
    <View style={styles.item}>
      <Text style={styles.question}>{item.question}</Text>
      {item.choices.map((choice) => (
        <Pressable
          key={choice}
          onPress={() => onSelect(choice)}
          style={[styles.choice, selected === choice && styles.choiceSelected]}
        >
          <Text style={[styles.choiceText, selected === choice && styles.choiceTextSelected]}>
            {choice}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    marginBottom: 16
  },
  question: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8
  },
  choice: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D9E4DF",
    marginBottom: 6
  },
  choiceSelected: {
    borderColor: "#0D6E4F",
    backgroundColor: "#E9F4EF"
  },
  choiceText: {
    color: "#1D2B27"
  },
  choiceTextSelected: {
    fontWeight: "600"
  }
});
