import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export default function Button({ label, onPress, disabled, variant = 'primary' }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={[styles.label, variant === 'ghost' && styles.labelGhost]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#1F3A2E',
  },
  ghost: {
    backgroundColor: '#F4F1EA',
    borderWidth: 1,
    borderColor: '#1F3A2E',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  label: {
    color: '#F9EED8',
    fontFamily: 'serif',
    fontSize: 14,
  },
  labelGhost: {
    color: '#1F3A2E',
  },
});
