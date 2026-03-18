import React, { useMemo } from "react";
import { SafeAreaView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Button from "../components/Button";
import ReportCard from "../components/ReportCard";

export default function ReportScreen({ navigation, route }) {
  const { width } = useWindowDimensions();
  const contentWidth = useMemo(() => Math.min(width, 520), [width]);
  const report = route.params?.report;

  if (!report) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>리포트 데이터가 없습니다.</Text>
        <Button label="지도 화면으로" onPress={() => navigation.navigate("Map")} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { maxWidth: contentWidth }]}> 
        <Text style={styles.title}>이용 리포트</Text>
        <ReportCard report={report} />
        <View style={styles.row}>
          <Text style={styles.label}>이용 시간</Text>
          <Text style={styles.value}>{report.durationMin} 분</Text>
        </View>
        <Button label="리포트 목록" onPress={() => navigation.navigate("ReportList")} />
        <Button label="지도 화면으로" onPress={() => navigation.navigate("Map")} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F5FBF8"
  },
  content: {
    width: "100%",
    alignSelf: "center"
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6
  },
  label: {
    color: "#60726B"
  },
  value: {
    fontWeight: "600"
  }
});