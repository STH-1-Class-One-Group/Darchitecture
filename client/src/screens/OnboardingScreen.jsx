import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Button from '../components/Button';
import { REGION_OPTIONS } from '../constants/regionConstants';

export default function OnboardingScreen({ onComplete }) {
  const [selected, setSelected] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>대전 지역 선택</Text>
      <Text style={styles.subtitle}>거주 지역을 선택하면 맞춤 리포트를 제공합니다.</Text>
      <View style={styles.grid}>
        {REGION_OPTIONS.map((region) => (
          <Pressable
            key={region.id}
            onPress={() => setSelected(region)}
            style={[styles.option, selected?.id === region.id && styles.optionSelected]}
          >
            <Text style={styles.optionLabel}>{region.label}</Text>
          </Pressable>
        ))}
      </View>
      <Button
        label="선택 완료"
        onPress={() => selected && onComplete(selected)}
        disabled={!selected}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Georgia',
    color: '#1F3A2E',
  },
  subtitle: {
    color: '#4A5E4F',
    marginTop: 6,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  option: {
    width: '47%',
    marginRight: '6%',
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: '#EFD6A6',
  },
  optionLabel: {
    fontFamily: 'serif',
    color: '#1F3A2E',
  },
});
