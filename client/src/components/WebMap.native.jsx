import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function WebMap() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>지도는 웹 버전에서 사용할 수 있습니다.</Text>
      <Text style={styles.text}>Cloudflare Pages로 배포되는 웹에서 지도가 활성화됩니다.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 320,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F3F4F6",
    borderRadius: 24
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
    textAlign: "center"
  },
  text: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center"
  }
});
