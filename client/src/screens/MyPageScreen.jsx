import React, { useEffect, useMemo, useState } from "react";
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { signOut } from "firebase/auth";
import Button from "../components/Button";
import Card from "../components/Card";
import PointLogItem from "../components/PointLogItem";
import PermissionRow from "../components/PermissionRow";
import apiClient from "../modules/apiClient";
import { API_ENDPOINTS } from "../constants/apiConstants";
import { auth } from "../lib/firebase";

export default function MyPageScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const contentWidth = useMemo(() => Math.min(width, 520), [width]);
  const [profile, setProfile] = useState({ email: "", region: "" });
  const [balance, setBalance] = useState(0);
  const [logs, setLogs] = useState([]);
  const [locationStatus, setLocationStatus] = useState("Checking...");
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const load = async () => {
      const userEmail = await AsyncStorage.getItem("user_email");
      const region = await AsyncStorage.getItem("user_region");
      setProfile({ email: userEmail || "demo-user", region: region || "unset" });

      try {
        const [balanceRes, logRes] = await Promise.all([
          apiClient.get(API_ENDPOINTS.pointBalance),
          apiClient.get(API_ENDPOINTS.pointLog)
        ]);
        setBalance(balanceRes.data.balance || 0);
        setLogs(logRes.data.logs || []);
      } catch (error) {
        setBalance(0);
        setLogs([]);
      }

      const status = await Location.getForegroundPermissionsAsync();
      setLocationStatus(status.status === "granted" ? "Granted" : "Denied");
    };
    load();
  }, []);

  const logout = async () => {
    await signOut(auth);
    await AsyncStorage.multiRemove(["auth_token", "user_id", "user_email", "user_name", "user_region"]);
    navigation.reset({ index: 0, routes: [{ name: "Auth" }] });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.content, { maxWidth: contentWidth }]}>
        <Text style={styles.title}>My Page</Text>

        <Card>
          <Text style={styles.label}>User</Text>
          <Text style={styles.value}>{profile.email}</Text>
          <Button label="Logout" onPress={logout} />
        </Card>

        <Card>
          <Text style={styles.label}>Region</Text>
          <Text style={styles.value}>{profile.region}</Text>
        </Card>

        <Card>
          <Text style={styles.label}>Point Balance</Text>
          <Text style={styles.balance}>{balance} P</Text>
        </Card>

        <Card>
          <Text style={styles.label}>Point Logs</Text>
          {logs.length === 0 ? (
            <Text style={styles.empty}>No point history yet.</Text>
          ) : (
            logs.map((item) => <PointLogItem key={item.id} item={item} />)
          )}
        </Card>

        <Card>
          <Text style={styles.label}>Guide</Text>
          <Text style={styles.guideText}>Start from a station, then tap Start Ride on the map.</Text>
          <Button label="Open guide" onPress={() => setShowGuide(true)} />
        </Card>

        <Card>
          <Text style={styles.label}>Permissions</Text>
          <PermissionRow label="Location" status={locationStatus} />
          <PermissionRow label="Notifications" status="Not linked" />
        </Card>
      </ScrollView>

      <Modal transparent visible={showGuide} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Ride guide</Text>
            <Text style={styles.modalText}>1. Check a station on the map.</Text>
            <Text style={styles.modalText}>2. Tap Start Ride to begin tracking.</Text>
            <Button label="Close" onPress={() => setShowGuide(false)} />
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
