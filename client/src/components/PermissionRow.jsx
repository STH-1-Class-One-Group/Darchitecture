import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PermissionRow({ label, status }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.status, status === '허용' ? styles.allow : styles.deny]}>
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E3DED3',
  },
  label: {
    fontFamily: 'serif',
    color: '#1F3A2E',
  },
  status: {
    fontWeight: '700',
  },
  allow: {
    color: '#1F3A2E',
  },
  deny: {
    color: '#8B3F2D',
  },
});
