import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function PermissionRow({ label, status }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.status}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E3ECE8"
  },
  label: {
    fontSize: 15,
    color: "#1D2B27"
  },
  status: {
    fontWeight: "600",
    color: "#0D6E4F"
  }
});
