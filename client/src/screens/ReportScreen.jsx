import React, { useMemo } from "react";
import { Alert, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import ScreenHeader from "../components/ScreenHeader";
import WebMap from "../components/WebMap";

const DEFAULT_CENTER = {
  latitude: 36.3504,
  longitude: 127.3845
};

export default function ReportScreen({ navigation, route }) {
  const { width } = useWindowDimensions();
  const contentWidth = useMemo(() => Math.min(width, 520), [width]);
  const report = route.params?.report;

  const routePoints = useMemo(() => report?.coordinates || [], [report]);
  const defaultCenter = useMemo(() => {
    if (routePoints.length > 0) {
      return {
        latitude: routePoints[0].lat,
        longitude: routePoints[0].lng
      };
    }
    return DEFAULT_CENTER;
  }, [routePoints]);

  const saveRouteMap = () => {
    if (routePoints.length === 0) {
      Alert.alert("저장할 경로 없음", "경로가 저장된 리포트만 지도 저장이 가능합니다.");
      return;
    }

    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.print();
      return;
    }

    Alert.alert("저장 기능 준비 중", "현재는 웹 브라우저의 인쇄 기능으로 저장할 수 있습니다.");
  };

  if (!report) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.screen}>
          <ScreenHeader
            title="이용 리포트"
            onBack={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Map"))}
          />
          <View style={[styles.emptyState, styles.emptyStateInner]}>
            <Text style={styles.emptyTitle}>리포트 데이터가 없습니다.</Text>
            <Pressable onPress={() => navigation.navigate("Map")} style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
              <Text style={styles.actionButtonText}>지도 화면으로</Text>
            </Pressable>
          </View>
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
      <View style={styles.screen}>
        <ScreenHeader
          title="이용 리포트"
          onBack={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Map"))}
        />

        <ScrollView contentContainerStyle={[styles.content, { maxWidth: contentWidth }]}>
          <View style={styles.mainCard}>
            <Text style={styles.cardTitle}>주행 결과</Text>

            <View style={styles.rowGroup}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>이동 거리</Text>
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

          {routePoints.length > 0 ? (
            <View style={styles.mapCard}>
              <Text style={styles.mapCardTitle}>주행 경로 지도</Text>
              <View style={styles.mapFrame}>
                <WebMap stations={[]} coordinates={routePoints} defaultCenter={defaultCenter} />
              </View>
              <Text style={styles.mapCaption}>지도에서 이동 경로를 확인하고 저장할 수 있습니다.</Text>
            </View>
          ) : null}

          <View style={styles.buttonCluster}>
            <Pressable
              onPress={saveRouteMap}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
            >
              <Text style={styles.secondaryButtonText}>경로 지도 저장</Text>
            </Pressable>

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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAF9"
  },
  screen: {
    flex: 1,
    backgroundColor: "#F8FAF9"
  },
  content: {
    flexGrow: 1,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24
  },
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    gap: 16
  },
  emptyStateInner: {
    flex: 1
  },
  emptyTitle: {
    fontSize: 20,
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
  mapCard: {
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },
  mapCardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12
  },
  mapFrame: {
    height: 320,
    borderRadius: 18,
    overflow: "hidden"
  },
  mapCaption: {
    marginTop: 10,
    fontSize: 12,
    color: "#6B7280"
  },
  buttonCluster: {
    marginTop: 28,
    gap: 12
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
  secondaryButton: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDE7E2"
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800"
  },
  secondaryButtonText: {
    color: "#066544",
    fontSize: 18,
    fontWeight: "800"
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }]
  }
});
