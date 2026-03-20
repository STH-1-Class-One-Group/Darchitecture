import React, { useMemo } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";

export default function ReportScreen({ navigation, route }) {
  const { width } = useWindowDimensions();
  const contentWidth = useMemo(() => Math.min(width, 520), [width]);
  const report = route.params?.report;

  if (!report) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.screen, styles.emptyState]}>
          <Text style={styles.emptyTitle}>리포트 데이터가 없습니다.</Text>
          <Pressable onPress={() => navigation.navigate("Map")} style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
            <Text style={styles.actionButtonText}>지도 화면으로</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const distanceText = Number(report.distanceKm || 0).toFixed(2);
  const carbonText = Number(report.carbonReductionKg || 0).toFixed(2);
  const pointsText = Number(report.pointsEarned || 0).toLocaleString();
  const durationText = Number(report.durationMin || 0).toLocaleString();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.screen, { maxWidth: contentWidth }]}>
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>이용 리포트</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>이용 리포트</Text>

          <View style={styles.rowGroup}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>거리</Text>
              <Text style={styles.rowValue}>{distanceText} km</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>탄소 절감</Text>
              <Text style={styles.rowValue}>{carbonText} kg</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>포인트</Text>
              <Text style={[styles.rowValue, styles.pointValue]}>{pointsText} P</Text>
            </View>
          </View>
        </View>

        <View style={styles.durationRow}>
          <Text style={styles.durationLabel}>이용 시간</Text>
          <Text style={styles.durationValue}>{durationText} 분</Text>
        </View>

        <View style={styles.buttonCluster}>
          <Pressable
            onPress={() => navigation.navigate("ReportList")}
            style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
          >
            <Text style={styles.actionButtonText}>리포트 목록</Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate("Map")}
            style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
          >
            <Text style={styles.actionButtonText}>지도 화면으로</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAF9"
  },
  screen: {
    flexGrow: 1,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24
  },
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    gap: 16
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24
  },
  headerSpacer: {
    width: 24
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827"
  },
  mainCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000000",
    shadowOpacity: 0.04,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 24
  },
  rowGroup: {
    gap: 18
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#486555"
  },
  rowValue: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827"
  },
  pointValue: {
    color: "#066544"
  },
  durationRow: {
    marginTop: 20,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  durationLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3F4943"
  },
  durationValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827"
  },
  buttonCluster: {
    marginTop: 32,
    gap: 16
  },
  actionButton: {
    width: "100%",
    backgroundColor: "#066544",
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#066544",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800"
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }]
  }
});
