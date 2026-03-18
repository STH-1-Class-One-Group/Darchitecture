import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function PointLogItem({ item }) {
  return (
    <View style={styles.row}>
      <Text style={styles.amount}>+{item.amount} P</Text>
      <Text style={styles.date}>{new Date(item.earnedAt).toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8
  },
  amount: {
    fontWeight: "600",
    color: "#0D6E4F"
  },
  date: {
    color: "#60726B"
  }
});
