import React, { useEffect, useMemo, useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import Button from "../components/Button";
import { API_BASE_URL, API_ENDPOINTS } from "../constants/apiConstants";
import { auth, isFirebaseConfigured } from "../config/firebase";

WebBrowser.maybeCompleteAuthSession();

const googleConfig = {
  expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID || "",
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "",
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || "",
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || ""
};

export default function AuthScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const contentWidth = useMemo(() => Math.min(width, 480), [width]);
  const [loading, setLoading] = useState(false);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(googleConfig);

  const isGoogleConfigured = Object.values(googleConfig).some(Boolean);

  useEffect(() => {
    const handleResponse = async () => {
      if (!response || response.type !== "success") return;

      const idToken = response.params?.id_token || response.authentication?.idToken;
      if (!idToken) {
        Alert.alert("로그인 실패", "Google 토큰을 가져오지 못했습니다.");
        return;
      }

      setLoading(true);
      try {
        const credential = GoogleAuthProvider.credential(idToken);
        const result = await signInWithCredential(auth, credential);
        const firebaseToken = await result.user.getIdToken();

        const syncRes = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.authLogin}`, {
          idToken: firebaseToken
        });

        await AsyncStorage.setItem("user_id", result.user.uid);
        if (result.user.email) {
          await AsyncStorage.setItem("user_email", result.user.email);
        }

        navigation.reset({
          index: 0,
          routes: [{ name: syncRes.data?.user?.region ? "Map" : "Onboarding" }]
        });
      } catch (error) {
        Alert.alert("로그인 실패", "Firebase 또는 서버 연결을 확인해주세요.");
      } finally {
        setLoading(false);
      }
    };

    handleResponse();
  }, [response, navigation]);

  const submit = async () => {
    if (!isFirebaseConfigured) {
      Alert.alert("Firebase 설정 필요", "Firebase 환경변수를 먼저 채워주세요.");
      return;
    }
    if (!isGoogleConfigured) {
      Alert.alert("Google 로그인 설정 필요", "Google Client ID를 먼저 채워주세요.");
      return;
    }
    await promptAsync({ useProxy: true });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { maxWidth: contentWidth }]}>
        <Text style={styles.title}>타슈 탄소중립</Text>
        <Text style={styles.subtitle}>Google 로그인으로 Firebase Auth에 연결합니다.</Text>

        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            Firebase 설정값과 Google Client ID가 들어가야 실제 로그인이 동작합니다.
          </Text>
        </View>

        <Button
          label={loading ? "처리 중..." : "Google로 로그인"}
          onPress={submit}
          disabled={loading || !request}
        />

        {!isFirebaseConfigured && (
          <Text style={styles.helper}>Firebase env 값은 빈칸 상태입니다.</Text>
        )}
        {!isGoogleConfigured && (
          <Text style={styles.helper}>Google OAuth client ID도 아직 빈칸입니다.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#F5FBF8"
  },
  content: {
    width: "100%",
    alignSelf: "center"
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0D6E4F",
    marginBottom: 6
  },
  subtitle: {
    color: "#60726B",
    marginBottom: 24
  },
  notice: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#DDE7E2",
    marginBottom: 12
  },
  noticeText: {
    color: "#60726B"
  },
  helper: {
    marginTop: 10,
    color: "#60726B",
    fontSize: 12
  }
});
