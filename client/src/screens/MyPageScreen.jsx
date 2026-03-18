import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Location from "expo-location";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import Button from "../components/Button";
import Card from "../components/Card";
import PointLogItem from "../components/PointLogItem";
import PermissionRow from "../components/PermissionRow";
import { API_BASE_URL, API_ENDPOINTS } from "../constants/apiConstants";
import { auth, db } from "../config/firebase";

export default function MyPageScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const contentWidth = useMemo(() => Math.min(width, 520), [width]);
  const [profile, setProfile] = useState({ email: "", region: "" });
  const [balance, setBalance] = useState(0);
  const [logs, setLogs] = useState([]);
  const [locationStatus, setLocationStatus] = useState("확인 중...");

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      const userId = user?.uid || (await AsyncStorage.getItem("user_id"));

      if (userId) {
        const snap = await getDoc(doc(db, "users", userId));
        const data = snap.exists() ? snap.data() : {};
        setProfile({
          email: data.email || user?.email || "demo-user",
          region: data.region || "미설정"
        });

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
      }

      const status = await Location.getForegroundPermissionsAsync();
      setLocationStatus(status.status === "granted" ? "허용" : "비허용");
    };
    load();
  }, []);

  const logout = async () => {
    await signOut(auth);
    await AsyncStorage.multiRemove(["auth_token", "user_id", "user_region", "user_email"]);
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
          <Text style={styles.label}>권한 현황</Text>
          <PermissionRow label="위치 권한" status={locationStatus} />
          <PermissionRow label="알림 권한" status="미연동" />
        </Card>
      </ScrollView>
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
  }
});
