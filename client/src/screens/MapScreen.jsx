import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import MapView from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../modules/apiClient";
import { API_ENDPOINTS } from "../constants/apiConstants";
import MapMarker from "../components/MapMarker";
import RoutePolyline from "../components/RoutePolyline";
import { calculateCarbonReductionKg, calculateDistanceKm } from "../modules/carbonModule";
import { calculatePoints } from "../modules/pointModule";
import { endRideSession, getCurrentSession, startRideSession } from "../modules/rideModule";
import { logUsage } from "../modules/usageModule";

const DEFAULT_REGION = {
  latitude: 36.3504,
  longitude: 127.3845,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05
};

function formatElapsed(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function formatDistance(distanceKm) {
  return distanceKm.toFixed(1);
}

export default function MapScreen({ navigation, route }) {
  const [stations, setStations] = useState([]);
  const [loadingStations, setLoadingStations] = useState(true);
  const [riding, setRiding] = useState(false);
  const [session, setSession] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [showReportSheet, setShowReportSheet] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const coordinates = useMemo(() => session?.coordinates ?? [], [session]);
  const elapsedMs = useMemo(() => {
    if (!session) return 0;
    return (session.endTime ?? Date.now()) - session.startTime;
  }, [session]);

  const liveReport = useMemo(() => {
    if (!session) {
      return {
        distanceKm: 0,
        carbonReductionKg: 0,
        pointsEarned: 0,
        durationMin: 0
      };
    }

    const distanceKm = calculateDistanceKm(coordinates);
    const carbonReductionKg = calculateCarbonReductionKg(distanceKm);
    const pointsEarned = calculatePoints(distanceKm, carbonReductionKg);
    const durationMin = Math.max(0, Math.floor(elapsedMs / 60000));

    return {
      distanceKm,
      carbonReductionKg,
      pointsEarned,
      durationMin
    };
  }, [coordinates, elapsedMs, session]);

  useEffect(() => {
    if (route?.params?.showGuide) {
      setShowGuide(true);
    }
  }, [route?.params?.showGuide]);

  useEffect(() => {
    const loadStations = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.mapStations);
        setStations(response.data.stations || []);
      } catch (error) {
        setStations([]);
      } finally {
        setLoadingStations(false);
      }
    };

    loadStations();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const current = getCurrentSession();
      if (current) {
        setSession({ ...current, coordinates: [...current.coordinates] });
        setRiding(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const startRide = async () => {
    try {
      await logUsage("ride_start", await AsyncStorage.getItem("user_id"));
      const rideSession = await startRideSession();
      setSession({ ...rideSession });
      setRiding(true);
    } catch (error) {
      if (error?.message === "location_permission_denied") {
        Alert.alert("위치 권한 필요", "주행 시작을 위해 위치 권한을 허용해주세요.");
        return;
      }
      Alert.alert("주행 시작 실패", "주행 시작에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const endRide = async () => {
    const finished = await endRideSession();
    if (!finished) return;

    const distanceKm = calculateDistanceKm(finished.coordinates);
    const carbonReductionKg = calculateCarbonReductionKg(distanceKm);
    const pointsEarned = calculatePoints(distanceKm, carbonReductionKg);
    const report = {
      id: `local-${Date.now()}`,
      distanceKm,
      carbonReductionKg,
      pointsEarned,
      durationMin: Math.max(0, Math.floor((finished.endTime - finished.startTime) / 60000)),
      coordinates: finished.coordinates
    };

    const stored = await AsyncStorage.getItem("report_list");
    const list = stored ? JSON.parse(stored) : [];
    list.unshift(report);
    await AsyncStorage.setItem("report_list", JSON.stringify(list));

    setRiding(false);
    setSession(null);
    setShowReportSheet(false);
    await logUsage("ride_end", await AsyncStorage.getItem("user_id"));
    navigation.navigate("Report", { report });
  };

  const statusLabel = riding ? "이용 중" : "대기 중";
  const primaryButtonLabel = riding ? "이용 종료" : "이용 시작";
  const currentTimeLabel = formatElapsed(elapsedMs);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>타슈 이용 지도</Text>
            <Text style={styles.subtitle}>{statusLabel}</Text>
          </View>

          <Pressable
            onPress={() => setShowMenu(true)}
            style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
          >
            <FontAwesome6 name="bars" size={18} color="#374151" />
          </Pressable>
        </View>

        <View style={styles.mapWrap}>
          <MapView
            style={StyleSheet.absoluteFill}
            initialRegion={DEFAULT_REGION}
            showsUserLocation
            showsMyLocationButton={false}
          >
            {!loadingStations && stations.map((station) => <MapMarker key={station.id} station={station} />)}
            <RoutePolyline coordinates={coordinates} />
          </MapView>

          <View pointerEvents="none" style={styles.centerBadgeWrap}>
            <View style={styles.centerBadge}>
              <FontAwesome6 name="bicycle" size={13} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.bottomOverlay}>
            <Pressable
              onPress={() => setShowReportSheet((prev) => !prev)}
              style={({ pressed }) => [styles.timeCard, pressed && styles.pressed]}
            >
              <View style={styles.timeCardLeft}>
                <View style={styles.timeIcon}>
                  <FontAwesome6 name="stopwatch" size={15} color="#066544" />
                </View>
                <View>
                  <Text style={styles.timeLabel}>이용 시간</Text>
                  <Text style={styles.timeValue}>{currentTimeLabel}</Text>
                </View>
              </View>
              <FontAwesome6 name="chevron-up" size={14} color="#9CA3AF" />
            </Pressable>

            <Pressable
              onPress={riding ? endRide : startRide}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
            >
              <Text style={styles.primaryButtonText}>{primaryButtonLabel}</Text>
            </Pressable>
          </View>
        </View>

        <View pointerEvents="none" style={styles.homeIndicatorWrap}>
          <View style={styles.homeIndicator} />
        </View>

        <Modal transparent visible={showReportSheet} animationType="slide" onRequestClose={() => setShowReportSheet(false)}>
          <View style={styles.sheetBackdrop}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowReportSheet(false)} />

            <View style={styles.sheet}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>실시간 이용 리포트</Text>

              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>이동 거리</Text>
                  <Text style={styles.statValue}>
                    {formatDistance(liveReport.distanceKm)} <Text style={styles.statUnit}>km</Text>
                  </Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>이용 시간</Text>
                  <Text style={styles.statValue}>
                    {liveReport.durationMin} <Text style={styles.statUnit}>분</Text>
                  </Text>
                </View>
              </View>

              <View style={styles.greenSummary}>
                <View>
                  <Text style={styles.greenLabel}>실시간 탄소 감축량</Text>
                  <Text style={styles.greenValue}>
                    {liveReport.carbonReductionKg.toFixed(2)} <Text style={styles.greenUnit}>kg</Text>
                  </Text>
                </View>

                <View style={styles.leafIcon}>
                  <FontAwesome6 name="leaf" size={24} color="#FFFFFF" />
                </View>
              </View>

              <View style={styles.pointsRow}>
                <Text style={styles.pointsLabel}>적립 포인트</Text>
                <Text style={styles.pointsValue}>{liveReport.pointsEarned} P</Text>
              </View>

              <Pressable
                onPress={() => setShowReportSheet(false)}
                style={({ pressed }) => [styles.sheetCloseButton, pressed && styles.pressed]}
              >
                <Text style={styles.sheetCloseText}>닫기</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Modal transparent visible={showMenu} animationType="fade" onRequestClose={() => setShowMenu(false)}>
          <View style={styles.menuBackdrop}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowMenu(false)} />

            <View style={styles.menuCard}>
              <Text style={styles.menuTitle}>메뉴</Text>

              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  navigation.navigate("ReportList");
                }}
              >
                <Text style={styles.menuItemText}>리포트 목록</Text>
              </Pressable>
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  navigation.navigate("MyPage");
                }}
              >
                <Text style={styles.menuItemText}>마이페이지</Text>
              </Pressable>
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  navigation.navigate("Quiz");
                }}
              >
                <Text style={styles.menuItemText}>퀴즈</Text>
              </Pressable>

              <Pressable style={styles.menuCloseButton} onPress={() => setShowMenu(false)}>
                <Text style={styles.menuCloseText}>닫기</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Modal transparent visible={showGuide} animationType="fade" onRequestClose={() => setShowGuide(false)}>
          <View style={styles.guideBackdrop}>
            <View style={styles.guideCard}>
              <Text style={styles.guideTitle}>이용 시작 안내</Text>
              <Text style={styles.guideText}>1. 지도에서 대여소 위치를 확인하세요.</Text>
              <Text style={styles.guideText}>2. 이용 시작 버튼을 눌러 주행을 시작하세요.</Text>
              <Text style={styles.guideText}>3. 이용 종료 후 리포트를 확인하세요.</Text>

              <Pressable
                onPress={() => setShowGuide(false)}
                style={({ pressed }) => [styles.guideCloseButton, pressed && styles.pressed]}
              >
                <Text style={styles.guideCloseText}>확인</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5FBF8"
  },
  screen: {
    flex: 1,
    backgroundColor: "#F5FBF8"
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between"
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827"
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    color: "#6B7280"
  },
  menuButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4
  },
  mapWrap: {
    flex: 1,
    overflow: "hidden"
  },
  centerBadgeWrap: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -16 }, { translateY: -16 }],
    zIndex: 5
  },
  centerBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#066544",
    borderWidth: 4,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6
  },
  bottomOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 14
  },
  timeCard: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#EFF2F1",
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8
  },
  timeCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  timeIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(6,101,68,0.10)",
    alignItems: "center",
    justifyContent: "center"
  },
  timeLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 0.6,
    textTransform: "uppercase"
  },
  timeValue: {
    marginTop: 2,
    fontSize: 20,
    fontWeight: "800",
    color: "#111827"
  },
  primaryButton: {
    backgroundColor: "#066544",
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#066544",
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10
  },
  primaryButtonPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }]
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800"
  },
  homeIndicatorWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 6,
    zIndex: 12,
    alignItems: "center"
  },
  homeIndicator: {
    width: 120,
    height: 4,
    borderRadius: 999,
    backgroundColor: "#D1D5DB"
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end"
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 24,
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -8 },
    elevation: 20
  },
  sheetHandle: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
    marginBottom: 18
  },
  sheetTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 18
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16
  },
  statCard: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EEF2F7"
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 4
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827"
  },
  statUnit: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600"
  },
  greenSummary: {
    backgroundColor: "#066544",
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#066544",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12
  },
  greenLabel: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4
  },
  greenValue: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800"
  },
  greenUnit: {
    fontSize: 16,
    color: "rgba(255,255,255,0.72)",
    fontWeight: "600"
  },
  leafIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center"
  },
  pointsRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4
  },
  pointsLabel: {
    fontSize: 15,
    color: "#4B5563",
    fontWeight: "600"
  },
  pointsValue: {
    fontSize: 18,
    color: "#111827",
    fontWeight: "800"
  },
  sheetCloseButton: {
    width: "100%",
    marginTop: 18,
    paddingVertical: 12,
    alignItems: "center"
  },
  sheetCloseText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "700"
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-start",
    paddingTop: 72,
    paddingHorizontal: 20
  },
  menuCard: {
    alignSelf: "flex-end",
    width: 220,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    shadowColor: "#000000",
    shadowOpacity: 0.16,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 20
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 10
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6"
  },
  menuItemText: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "600"
  },
  menuCloseButton: {
    marginTop: 8,
    alignItems: "center",
    paddingVertical: 10
  },
  menuCloseText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "700"
  },
  guideBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 24
  },
  guideCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    shadowColor: "#000000",
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 18
  },
  guideTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12
  },
  guideText: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 8,
    lineHeight: 20
  },
  guideCloseButton: {
    marginTop: 14,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "#F3F4F6"
  },
  guideCloseText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "700"
  },
  pressed: {
    opacity: 0.88
  }
});
