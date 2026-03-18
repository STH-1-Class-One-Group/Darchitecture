import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Button from "../components/Button";
import { API_BASE_URL, API_ENDPOINTS } from "../constants/apiConstants";

export default function AuthScreen({ navigation, onAuthed }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("demo@tacu.app");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !password) {
      Alert.alert("입력 필요", "이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === "login" ? API_ENDPOINTS.authLogin : API_ENDPOINTS.authRegister;
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, { email, password });
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>타슈 탄소중립</Text>
      <Text style={styles.subtitle}>대전시 자전거 이용과 탄소 절감 기록</Text>

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

      <Button label={loading ? "처리 중..." : mode === "login" ? "로그인" : "회원가입"} onPress={submit} disabled={loading} />
      <Text style={styles.switch} onPress={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login" ? "회원가입 모드로 전환" : "로그인 모드로 전환"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F5FBF8"
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
