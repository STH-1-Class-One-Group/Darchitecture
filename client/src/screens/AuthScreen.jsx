import React, { useEffect, useMemo, useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import Button from "../components/Button";
import { API_BASE_URL, API_ENDPOINTS } from "../constants/apiConstants";
import { auth } from "../lib/firebase";

WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen({ navigation, onAuthed }) {
  const { width } = useWindowDimensions();
  const contentWidth = useMemo(() => Math.min(width, 480), [width]);
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("demo@tacu.app");
  const [password, setPassword] = useState("password");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID || process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
  });

  useEffect(() => {
    console.log(AuthSession.getRedirectUrl("redirect"));
  }, []);

  useEffect(() => {
    const completeGoogleSignIn = async () => {
      if (response?.type !== "success") {
        setGoogleLoading(false);
        return;
      }

      const idToken = response.authentication?.idToken ?? response.params?.id_token;
      const accessToken = response.authentication?.accessToken ?? response.params?.access_token;

      if (!idToken && !accessToken) {
        setGoogleLoading(false);
        Alert.alert("Google 로그인 실패", "인증 토큰을 가져오지 못했습니다.");
        return;
      }

      try {
        const credential = GoogleAuthProvider.credential(idToken ?? null, accessToken ?? null);
        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user;
        const token = await user.getIdToken();

        await AsyncStorage.setItem("auth_token", token);
        await AsyncStorage.setItem("user_id", user.uid);

        if (user.email) {
          await AsyncStorage.setItem("user_email", user.email);
        }
        if (user.displayName) {
          await AsyncStorage.setItem("user_name", user.displayName);
        }

        onAuthed({ token, userId: user.uid, region: null });
        navigation.replace("Onboarding");
      } catch (error) {
        Alert.alert("Google 로그인 실패", "Firebase 인증 처리에 실패했습니다.");
      } finally {
        setGoogleLoading(false);
      }
    };

    completeGoogleSignIn();
  }, [response, navigation, onAuthed]);

  const submit = async () => {
    if (!email || !password || (mode === "register" && (!name || !passwordConfirm))) {
      Alert.alert("입력 필요", "이메일과 비밀번호를 입력해주세요.");
      return;
    }
    if (mode === "register" && password !== passwordConfirm) {
      Alert.alert("비밀번호 확인", "비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === "login" ? API_ENDPOINTS.authLogin : API_ENDPOINTS.authRegister;
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, { name, email, password });
      const { token, userId } = response.data;
      await AsyncStorage.setItem("auth_token", token);
      await AsyncStorage.setItem("user_id", userId);
      onAuthed({ token, userId, region: null });
      navigation.replace("Onboarding");
    } catch (error) {
      Alert.alert("로그인 실패", "서버 연결을 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const submitGoogleLogin = async () => {
    if (!request) {
      Alert.alert("Google 로그인 준비 중", "잠시 후 다시 시도해주세요.");
      return;
    }

    try {
      setGoogleLoading(true);
      await promptAsync({ useProxy: true });
    } catch (error) {
      setGoogleLoading(false);
      Alert.alert("Google 로그인 실패", "로그인 창을 열지 못했습니다.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { maxWidth: contentWidth }]}>
        <Text style={styles.title}>타슈어드벤처</Text>
        <Text style={styles.subtitle}>타슈 앱 접속을 시작하세요</Text>

        <Button
          label={googleLoading ? "Google 로그인 처리 중..." : "Google로 로그인"}
          onPress={submitGoogleLogin}
          disabled={loading || googleLoading || !request}
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>또는</Text>
          <View style={styles.dividerLine} />
        </View>

        {mode === "register" && (
          <TextInput style={styles.input} placeholder="이름" value={name} onChangeText={setName} />
        )}
        <TextInput
          style={styles.input}
          placeholder="이메일"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {mode === "register" && (
          <TextInput
            style={styles.input}
            placeholder="비밀번호 확인"
            secureTextEntry
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
          />
        )}

        <Button
          label={loading ? "처리 중..." : mode === "login" ? "로그인" : "회원가입"}
          onPress={submit}
          disabled={loading || googleLoading}
        />
        <Text style={styles.switch} onPress={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "회원가입 모드로 전환" : "로그인 모드로 전환"}
        </Text>
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
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 14
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#DDE7E2"
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#60726B",
    fontSize: 12
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#DDE7E2",
    marginBottom: 12
  },
  switch: {
    textAlign: "center",
    marginTop: 12,
    color: "#0D6E4F",
    fontWeight: "600"
  }
});
