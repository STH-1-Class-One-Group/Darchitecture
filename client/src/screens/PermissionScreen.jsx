import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import Button from "../components/Button";
import PermissionRow from "../components/PermissionRow";

export default function PermissionScreen({ navigation }) {
  const [locationStatus, setLocationStatus] = useState("확인 중...");

  useEffect(() => {
    const load = async () => {
      const status = await Location.getForegroundPermissionsAsync();
      setLocationStatus(status.status === "granted" ? "허용" : "비허용");
    };
    load();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>권한 현황</Text>
      <PermissionRow label="위치 권한" status={locationStatus} />
      <PermissionRow label="알림 권한" status="미연동" />
      <Text style={styles.caption}>알림 권한은 추후 푸시 기능과 함께 연동됩니다.</Text>
      <Button label="지도 화면으로" onPress={() => navigation.navigate("Map")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F5FBF8"
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
  }
});
