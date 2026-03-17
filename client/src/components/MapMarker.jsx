import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MapMarker({ name, docks }) {
  return (
    <View style={styles.marker}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.meta}>거치대 {docks}대</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  marker: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#EFD6A6',
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontFamily: 'serif',
    color: '#1F3A2E',
  },
  meta: {
    marginTop: 4,
    fontSize: 12,
    color: '#3D5A43',
  },
});
