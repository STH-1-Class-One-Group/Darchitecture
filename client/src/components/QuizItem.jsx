import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function QuizItem({ item, selected, onSelect }) {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{item.question}</Text>
      {item.options.map((option) => (
        <Pressable
          key={option}
          onPress={() => onSelect(option)}
          style={[styles.option, selected === option && styles.optionSelected]}
        >
          <Text style={styles.optionText}>{option}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  question: {
    fontFamily: 'serif',
    fontSize: 15,
    marginBottom: 10,
    color: '#1F3A2E',
  },
  option: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C6D2C4',
    marginBottom: 8,
  },
  optionSelected: {
    backgroundColor: '#EFD6A6',
    borderColor: '#1F3A2E',
  },
  optionText: {
    color: '#1F3A2E',
  },
});
