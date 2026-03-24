import React, { useEffect, useState } from "react";
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import PermissionRow from "../components/PermissionRow";
import ScreenHeader from "../components/ScreenHeader";

async function readBrowserLocationPermission() {
  if (typeof navigator === "undefined") return "사용 불가";

  if (navigator.permissions?.query) {
    try {
      const permission = await navigator.permissions.query({ name: "geolocation" });
      if (permission.state === "granted") return "허용됨";
      if (permission.state === "denied") return "차단됨";
      return "확인 필요";
    } catch (error) {
      return "사용 불가";
    }
  }

  return "브라우저 설정 확인";
}

export default function PermissionScreen({ navigation }) {
  const [locationStatus, setLocationStatus] = useState("확인 중...");

  useEffect(() => {
    const load = async () => {
      setLocationStatus(await readBrowserLocationPermission());
    };
    load();
  }, []);

  const openBrowserGuidance = () => {
    Alert.alert(
      "브라우저 권한",
      "브라우저 주소창 또는 사이트 설정에서 위치 권한을 변경할 수 있습니다."
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screen}>
        <ScreenHeader
          title="권한 관리"
          onBack={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Map"))}
        />

        <View style={styles.card}>
          <Text style={styles.title}>권한 상태</Text>
          <PermissionRow label="위치" status={locationStatus} />
          <PermissionRow label="알림" status="설정 안 됨" />
          <Text style={styles.caption}>알림 권한은 추후 푸시 기능과 연결할 예정입니다.</Text>
          <Button label="지도 화면으로" onPress={() => navigation.navigate("Map")} />
          <Pressable onPress={openBrowserGuidance} style={styles.link}>
            <Text style={styles.linkText}>브라우저 권한 도움말 보기</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FBF8"
  },
  screen: {
    flex: 1,
    backgroundColor: "#F5FBF8"
  },
  card: {
    flex: 1,
    margin: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
    color: "#111827"
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
