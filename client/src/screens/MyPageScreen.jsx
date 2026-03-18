import React, { useEffect, useMemo, useState } from "react";
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Location from "expo-location";
import Button from "../components/Button";
import Card from "../components/Card";
import PointLogItem from "../components/PointLogItem";
import PermissionRow from "../components/PermissionRow";
import { API_BASE_URL, API_ENDPOINTS } from "../constants/apiConstants";

export default function MyPageScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const contentWidth = useMemo(() => Math.min(width, 520), [width]);
  const [profile, setProfile] = useState({ email: "", region: "" });
  const [balance, setBalance] = useState(0);
  const [logs, setLogs] = useState([]);
  const [locationStatus, setLocationStatus] = useState("확인 중...");
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const load = async () => {
      const userId = await AsyncStorage.getItem("user_id");
      const region = await AsyncStorage.getItem("user_region");
      setProfile({ email: userId || "demo-user", region: region || "미설정" });

      try {
        const [balanceRes, logRes] = await Promise.all([
          axios.get(`${API_BASE_URL}${API_ENDPOINTS.pointBalance}`, { params: { userId } }),
          axios.get(`${API_BASE_URL}${API_ENDPOINTS.pointLog}`, { params: { userId } })
        ]);
        setBalance(balanceRes.data.balance || 0);
        setLogs(logRes.data.logs || []);
      } catch (error) {
        setBalance(0);
        setLogs([]);
      }

      const status = await Location.getForegroundPermissionsAsync();
      setLocationStatus(status.status === "granted" ? "허용" : "비허용");
    };
    load();
  }, []);

  const logout = async () => {
    await AsyncStorage.multiRemove(["auth_token", "user_id", "user_region"]);
    navigation.reset({ index: 0, routes: [{ name: "Auth" }] });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.content, { maxWidth: contentWidth }]}> 
        <Text style={styles.title}>마이페이지</Text>

        <Card>
          <Text style={styles.label}>사용자</Text>
          <Text style={styles.value}>{profile.email}</Text>
          <Button label="로그아웃" onPress={logout} />
        </Card>

        <Card>
          <Text style={styles.label}>지역</Text>
          <Text style={styles.value}>{profile.region}</Text>
        </Card>

        <Card>
          <Text style={styles.label}>포인트 잔액</Text>
          <Text style={styles.balance}>{balance} P</Text>
        </Card>

        <Card>
          <Text style={styles.label}>포인트 적립 로그</Text>
          {logs.length === 0 ? (
            <Text style={styles.empty}>아직 적립 내역이 없습니다.</Text>
          ) : (
            logs.map((item) => <PointLogItem key={item.id} item={item} />)
          )}
        </Card>

        <Card>
          <Text style={styles.label}>이용 안내</Text>
          <Text style={styles.guideText}>타슈 앱에서 대여 시작 → 본 앱에서 이용 시작</Text>
          <Button label="안내 팝업 보기" onPress={() => setShowGuide(true)} />
        </Card>

        <Card>
          <Text style={styles.label}>권한 현황</Text>
          <PermissionRow label="위치 권한" status={locationStatus} />
          <PermissionRow label="알림 권한" status="미연동" />
        </Card>
      </ScrollView>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FBF8"
  },
  content: {
    padding: 24,
    width: "100%",
    alignSelf: "center"
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12
  },
  label: {
    color: "#60726B",
    marginBottom: 4
  },
  value: {
    fontWeight: "600",
    marginBottom: 10
  },
  balance: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0D6E4F"
  },
  empty: {
    color: "#60726B",
    marginTop: 8
  },
  guideText: {
    color: "#60726B",
    marginBottom: 8
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