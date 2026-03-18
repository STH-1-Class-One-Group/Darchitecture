import React, { useEffect, useMemo, useState } from "react";
import { Alert, Modal, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import MapView from "react-native-maps";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../components/Button";
import MapMarker from "../components/MapMarker";
import RoutePolyline from "../components/RoutePolyline";
import { API_BASE_URL, API_ENDPOINTS } from "../constants/apiConstants";
import { calculateCarbonReductionKg, calculateDistanceKm } from "../modules/carbonModule";
import { calculatePoints } from "../modules/pointModule";
import { endRideSession, startRideSession, getCurrentSession } from "../modules/rideModule";
import { logUsage } from "../modules/usageModule";

const DEFAULT_REGION = {
  latitude: 36.3504,
  longitude: 127.3845,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05
};

export default function MapScreen({ navigation, route }) {
  const { width } = useWindowDimensions();
  const panelWidth = useMemo(() => Math.min(width, 520), [width]);
  const [stations, setStations] = useState([]);
  const [loadingStations, setLoadingStations] = useState(true);
  const [riding, setRiding] = useState(false);
  const [session, setSession] = useState(null);
  const [showGuide, setShowGuide] = useState(false);

  const coordinates = useMemo(() => session?.coordinates ?? [], [session]);

  useEffect(() => {
    if (route?.params?.showGuide) {
      setShowGuide(true);
    }
  }, [route?.params?.showGuide]);

  useEffect(() => {
    const loadStations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.mapStations}`);
        setStations(response.data.stations || []);
      } catch (error) {
        setStations([]);
      } finally {
        setLoadingStations(false);
      }
    };
    loadStations();
  }, []);

  const startRide = async () => {
    try {
      await logUsage("ride_start", await AsyncStorage.getItem("user_id"));
      const rideSession = await startRideSession();
      setSession({ ...rideSession });
      setRiding(true);
    } catch (error) {
      Alert.alert("위치 권한 필요", "이용 시작을 위해 위치 권한을 허용해주세요.");
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
      durationMin: Math.max(1, Math.round((finished.endTime - finished.startTime) / 60000)),
      coordinates: finished.coordinates
    };

    const stored = await AsyncStorage.getItem("report_list");
    const list = stored ? JSON.parse(stored) : [];
    list.unshift(report);
    await AsyncStorage.setItem("report_list", JSON.stringify(list));

    setRiding(false);
    setSession(null);
    await logUsage("ride_end", await AsyncStorage.getItem("user_id"));
    navigation.navigate("Report", { report });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const current = getCurrentSession();
      if (current) {
        setSession({ ...current, coordinates: [...current.coordinates] });
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>타슈 이용 지도</Text>
        <Text style={styles.subtitle}>{riding ? "이용 중" : "대기 중"}</Text>
      </View>

      <MapView style={styles.map} initialRegion={DEFAULT_REGION}>
        {!loadingStations && stations.map((station) => <MapMarker key={station.id} station={station} />)}
        <RoutePolyline coordinates={coordinates} />
      </MapView>

      <View style={[styles.panel, { maxWidth: panelWidth }]}> 
        <Text style={styles.panelTitle}>이용 세션</Text>
        <Text style={styles.panelText}>기록된 좌표: {coordinates.length}개</Text>
        <Button label={riding ? "이용 종료" : "이용 시작"} onPress={riding ? endRide : startRide} />

        <View style={styles.quickLinks}>
          <Button label="리포트 목록" onPress={() => navigation.navigate("ReportList")} />
          <Button label="마이페이지" onPress={() => navigation.navigate("MyPage")} />
          <Button label="퀴즈" onPress={() => navigation.navigate("Quiz")} />
        </View>
      </View>

      <Modal transparent visible={showGuide} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>이용 시작 순서 안내</Text>
            <Text style={styles.modalText}>1. 타슈 앱에서 대여 시작</Text>
            <Text style={styles.modalText}>2. 본 앱에서 이용 시작 버튼 클릭</Text>
            <Button label="닫기" onPress={() => setShowGuide(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FBF8"
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10
  },
  title: {
    fontSize: 22,
    fontWeight: "800"
  },
  subtitle: {
    color: "#60726B",
    marginTop: 4
  },
  map: {
    flex: 1
  },
  panel: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    alignSelf: "center",
    width: "100%"
  },
  panelTitle: {
    fontWeight: "700",
    marginBottom: 4
  },
  panelText: {
    color: "#60726B",
    marginBottom: 8
  },
  quickLinks: {
    marginTop: 8
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 24
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12
  },
  modalText: {
    color: "#60726B",
    marginBottom: 6
  }
});