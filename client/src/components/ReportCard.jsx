import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Card from "./Card";

export default function ReportCard({ report }) {
  return (
    <Card>
      <Text style={styles.title}>이용 리포트</Text>
      <View style={styles.row}>
        <Text style={styles.label}>거리</Text>
        <Text style={styles.value}>{report.distanceKm.toFixed(2)} km</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>탄소 절감</Text>
        <Text style={styles.value}>{report.carbonReductionKg.toFixed(2)} kg</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>포인트</Text>
        <Text style={styles.value}>{report.pointsEarned} P</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4
  },
  label: {
    color: "#60726B"
  },
  value: {
    fontWeight: "600"
  }
});
