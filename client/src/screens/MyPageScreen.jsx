import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Platform
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import apiClient from "../modules/apiClient";
import { API_ENDPOINTS } from "../constants/apiConstants";
import { auth } from "../lib/firebase";

function formatTimestamp(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatRegion(region) {
  if (!region) return "Yuseong-gu, Daejeon";
  if (region.toLowerCase() === "yuseong") return "Yuseong-gu, Daejeon";
  return region;
}

async function readBrowserLocationPermission() {
  if (typeof navigator === "undefined") return "Unavailable";

  if (navigator.permissions?.query) {
    try {
      const permission = await navigator.permissions.query({ name: "geolocation" });
      if (permission.state === "granted") return "Allowed";
      if (permission.state === "denied") return "Blocked";
      return "Ask";
    } catch (error) {
      return "Unavailable";
    }
  }

  return "Check browser settings";
}

export default function MyPageScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const contentWidth = useMemo(() => Math.min(width, 520), [width]);
  const [userName, setUserName] = useState("user");
  const [region, setRegion] = useState("");
  const [balance, setBalance] = useState(0);
  const [logs, setLogs] = useState([]);
  const [locationStatus, setLocationStatus] = useState("Checking...");

  const loadPage = useCallback(async () => {
    const [profileRes, permissionStatus, currentUser] = await Promise.all([
      apiClient.get(API_ENDPOINTS.authMe).catch(() => null),
      readBrowserLocationPermission(),
      Promise.resolve(auth.currentUser)
    ]);

    const profile = profileRes?.data?.user || {};
    setUserName(profile.name || currentUser?.displayName || currentUser?.email || currentUser?.uid || "user");
    setRegion(profile.region || "");
    setLocationStatus(permissionStatus);

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
  }, []);

  useEffect(() => {
    loadPage();
    const unsubscribe = navigation.addListener("focus", loadPage);
    return unsubscribe;
  }, [navigation, loadPage]);

  const openPermissionSettings = async () => {
    if (Platform.OS === "web") {
      Alert.alert(
        "Browser permissions",
        "Use the browser address bar or site settings to change location permissions."
      );
      return;
    }

    try {
      await Linking.openSettings();
    } catch (error) {
      Alert.alert("Settings unavailable", "This device does not expose a direct settings screen.");
    }
  };

  const exchangePoints = () => {
    Alert.alert("Coming soon", "Point exchange is not implemented yet.");
  };

  const openHelpCenter = () => {
    Alert.alert("Coming soon", "Help Center is not connected yet.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable
            onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Map"))}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <FontAwesome6 name="chevron-left" size={18} color="#374151" />
          </Pressable>

          <Text style={styles.headerTitle}>My Page</Text>

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { maxWidth: contentWidth }]}>
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <View style={styles.avatar}>
                <FontAwesome6 name="user" size={34} color="#066544" />
              </View>

              <View style={styles.profileContent}>
                <View style={styles.profileTopRow}>
                  <Text style={styles.profileName} numberOfLines={1} ellipsizeMode="tail">
                    {userName}
                  </Text>
                  <Pressable
                    onPress={() => navigation.navigate("Onboarding")}
                    style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </Pressable>
                </View>
                <Text style={styles.memberLabel}>Member</Text>
              </View>
            </View>
          </View>

          <View style={styles.regionCard}>
            <View style={styles.regionLeft}>
              <View style={styles.regionIconWrap}>
                <FontAwesome6 name="location-dot" size={18} color="#066544" />
              </View>

              <View>
                <Text style={styles.regionCaption}>Current region</Text>
                <Text style={styles.regionValue}>{formatRegion(region)}</Text>
              </View>
            </View>

            <Pressable
              onPress={() => navigation.navigate("Onboarding")}
              style={({ pressed }) => [styles.regionArrowButton, pressed && styles.pressed]}
            >
              <FontAwesome6 name="chevron-right" size={16} color="#9CA3AF" />
            </Pressable>
          </View>

          <View style={styles.pointCard}>
            <View style={styles.pointCardTopRow}>
              <View>
                <Text style={styles.pointSubtitle}>Available points</Text>
                <View style={styles.pointValueRow}>
                  <Text style={styles.pointValue}>{balance.toLocaleString()}</Text>
                  <Text style={styles.pointUnit}>P</Text>
                </View>
              </View>

              <View style={styles.pointIconWrap}>
                <FontAwesome6 name="coins" size={22} color="#FFFFFF" />
              </View>
            </View>

            <Pressable
              onPress={exchangePoints}
              style={({ pressed }) => [styles.exchangeButton, pressed && styles.pressed]}
            >
              <Text style={styles.exchangeButtonText}>Exchange points</Text>
            </Pressable>
          </View>

          <View style={styles.logCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Point history</Text>
              <Pressable
                onPress={() => navigation.navigate("ReportList")}
                style={({ pressed }) => [styles.sectionLinkButton, pressed && styles.pressed]}
              >
                <Text style={styles.sectionLinkText}>View all</Text>
                <FontAwesome6 name="chevron-right" size={10} color="#9CA3AF" />
              </Pressable>
            </View>

            <View style={styles.logList}>
              {logs.length === 0 ? (
                <Text style={styles.emptyText}>No point history yet.</Text>
              ) : (
                logs.map((item, index) => (
                  <View key={item.id} style={styles.logRow}>
                    <View style={styles.logLeft}>
                      <View style={styles.logIconWrap}>
                        <FontAwesome6 name={index % 2 === 0 ? "lightbulb" : "chart-line"} size={18} color="#9CA3AF" />
                      </View>
                      <View>
                        <Text style={styles.logTitle}>
                          {index % 2 === 0 ? "Energy saving reward" : "Usage reward"}
                        </Text>
                        <Text style={styles.logDate}>{formatTimestamp(item.earnedAt)}</Text>
                      </View>
                    </View>

                    <Text style={styles.logAmount}>+{item.amount.toLocaleString()} P</Text>
                  </View>
                ))
              )}
            </View>
          </View>

          <View style={styles.permissionCard}>
            <Text style={styles.permissionTitle}>Permissions</Text>

            <View style={styles.permissionList}>
              <View style={styles.permissionRow}>
                <Text style={styles.permissionLabel}>Location</Text>
                <Text style={styles.permissionStatusGranted}>{locationStatus}</Text>
              </View>

              <View style={styles.permissionRow}>
                <Text style={styles.permissionLabel}>Notifications</Text>
                <Text style={styles.permissionStatusMuted}>Not configured</Text>
              </View>
            </View>

            <Pressable
              onPress={openPermissionSettings}
              style={({ pressed }) => [styles.permissionButton, pressed && styles.pressed]}
            >
              <Text style={styles.permissionButtonText}>Manage permissions</Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Pressable
              onPress={openHelpCenter}
              style={({ pressed }) => [styles.helpLink, pressed && styles.pressed]}
            >
              <Text style={styles.helpLinkText}>Help Center</Text>
            </Pressable>

            <View style={styles.footerMetaRow}>
              <Text style={styles.footerMeta}>Tashu Carbon Neutrality v2.4.0</Text>
              <Text style={styles.footerMeta}>© 2024 Tashu</Text>
            </View>
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
  header: {
    height: 64,
    backgroundColor: "#F8FAF9",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    zIndex: 10
  },
  backButton: {
    width: 40,
    height: 40,
    marginLeft: -4,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937"
  },
  headerSpacer: {
    width: 40,
    height: 40
  },
  content: {
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
    gap: 16
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000000",
    shadowOpacity: 0.04,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(6,101,68,0.10)",
    borderWidth: 1,
    borderColor: "rgba(6,101,68,0.18)",
    alignItems: "center",
    justifyContent: "center"
  },
  profileContent: {
    flex: 1
  },
  profileTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8
  },
  profileName: {
    flex: 1,
    fontSize: 20,
    fontWeight: "800",
    color: "#111827"
  },
  editButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(6,101,68,0.3)",
    backgroundColor: "#FFFFFF"
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#066544"
  },
  memberLabel: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B7280"
  },
  regionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000000",
    shadowOpacity: 0.04,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2
  },
  regionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  regionIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#EFF6F3",
    alignItems: "center",
    justifyContent: "center"
  },
  regionCaption: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.4
  },
  regionValue: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: "800",
    color: "#1F2937"
  },
  regionArrowButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center"
  },
  pointCard: {
    backgroundColor: "#066544",
    borderRadius: 22,
    padding: 22,
    shadowColor: "#066544",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4
  },
  pointCardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12
  },
  pointSubtitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.72)"
  },
  pointValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginTop: 6
  },
  pointValue: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "800",
    color: "#FFFFFF"
  },
  pointUnit: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF"
  },
  pointIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center"
  },
  exchangeButton: {
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center"
  },
  exchangeButtonText: {
    color: "#066544",
    fontWeight: "800",
    fontSize: 14
  },
  logCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000000",
    shadowOpacity: 0.04,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F2937"
  },
  sectionLinkButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  sectionLinkText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9CA3AF"
  },
  logList: {
    gap: 16
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280"
  },
  logRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  logLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  logIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center"
  },
  logTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937"
  },
  logDate: {
    marginTop: 2,
    fontSize: 11,
    color: "#9CA3AF"
  },
  logAmount: {
    fontSize: 14,
    fontWeight: "800",
    color: "#066544"
  },
  permissionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000000",
    shadowOpacity: 0.04,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2
  },
  permissionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9CA3AF",
    marginBottom: 14
  },
  permissionList: {
    gap: 0
  },
  permissionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6"
  },
  permissionLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F2937"
  },
  permissionStatusGranted: {
    fontSize: 16,
    fontWeight: "800",
    color: "#066544"
  },
  permissionStatusMuted: {
    fontSize: 16,
    fontWeight: "800",
    color: "#9CA3AF"
  },
  permissionButton: {
    marginTop: 14,
    alignItems: "center",
    paddingVertical: 10
  },
  permissionButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9CA3AF",
    textDecorationLine: "underline"
  },
  footer: {
    paddingVertical: 8,
    paddingBottom: 12
  },
  helpLink: {
    alignSelf: "flex-end",
    marginBottom: 16
  },
  helpLinkText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
    textDecorationLine: "underline"
  },
  footerMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8
  },
  footerMeta: {
    fontSize: 10,
    color: "#9CA3AF"
  },
  pressed: {
    opacity: 0.88
  }
});
