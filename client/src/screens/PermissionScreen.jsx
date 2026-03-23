import React, { useEffect, useState } from "react";
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import PermissionRow from "../components/PermissionRow";

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

export default function PermissionScreen({ navigation }) {
  const [locationStatus, setLocationStatus] = useState("Checking...");

  useEffect(() => {
    const load = async () => {
      setLocationStatus(await readBrowserLocationPermission());
    };
    load();
  }, []);

  const openBrowserGuidance = () => {
    Alert.alert(
      "Browser permissions",
      "Use the browser address bar or site settings to change location permissions."
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Permissions</Text>
        <PermissionRow label="Location" status={locationStatus} />
        <PermissionRow label="Notifications" status="Not configured" />
        <Text style={styles.caption}>Notification permission will be connected later with push features.</Text>
        <Button label="Back to map" onPress={() => navigation.navigate("Map")} />
        <Pressable onPress={openBrowserGuidance} style={styles.link}>
          <Text style={styles.linkText}>View browser permission help</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F5FBF8",
    justifyContent: "center"
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12
  },
  caption: {
    color: "#60726B",
    marginTop: 12,
    marginBottom: 16
  },
  link: {
    marginTop: 12,
    alignItems: "center"
  },
  linkText: {
    color: "#0D6E4F",
    fontWeight: "700",
    textDecorationLine: "underline"
  }
});
