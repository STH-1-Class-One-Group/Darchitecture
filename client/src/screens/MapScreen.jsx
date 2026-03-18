import React, { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
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

export default function MapScreen({ navigation }) {
  const [stations, setStations] = useState([]);
  const [loadingStations, setLoadingStations] = useState(true);
  const [riding, setRiding] = useState(false);
  const [session, setSession] = useState(null);

  const coordinates = useMemo(() => session?.coordinates ?? [], [session]);

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

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>이용 세션</Text>
        <Text style={styles.panelText}>기록된 좌표: {coordinates.length}개</Text>
        <Button label={riding ? "이용 종료" : "이용 시작"} onPress={riding ? endRide : startRide} />

        <View style={styles.quickLinks}>
          <Button label="리포트 목록" onPress={() => navigation.navigate("ReportList")} />
          <Button label="마이페이지" onPress={() => navigation.navigate("MyPage")} />
          <Button label="퀴즈" onPress={() => navigation.navigate("Quiz")} />
          <Button label="권한 현황" onPress={() => navigation.navigate("Permission")} />
        </View>
      </View>
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
    backgroundColor: "#FFFFFF"
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
  }
});
