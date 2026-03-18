import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Button from "../components/Button";
import Card from "../components/Card";
import PointLogItem from "../components/PointLogItem";
import { API_BASE_URL, API_ENDPOINTS } from "../constants/apiConstants";

export default function MyPageScreen({ navigation }) {
  const [profile, setProfile] = useState({ email: "", region: "" });
  const [balance, setBalance] = useState(0);
  const [logs, setLogs] = useState([]);

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
    };
    load();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>마이페이지</Text>
      <Card>
        <Text style={styles.label}>사용자</Text>
        <Text style={styles.value}>{profile.email}</Text>
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

      <Button label="지도 화면으로" onPress={() => navigation.navigate("Map")} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FBF8"
  },
  content: {
    padding: 24
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
