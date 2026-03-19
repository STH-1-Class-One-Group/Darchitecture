import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../components/Button";
import ReportCard from "../components/ReportCard";

export default function ReportListScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const contentWidth = useMemo(() => Math.min(width, 520), [width]);
  const [reports, setReports] = useState([]);

  const loadReports = async () => {
    const stored = await AsyncStorage.getItem("report_list");
    setReports(stored ? JSON.parse(stored) : []);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadReports);
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.content, { maxWidth: contentWidth }]}>
        <Text style={styles.title}>내 리포트</Text>
        {reports.length === 0 ? (
          <Text style={styles.empty}>아직 리포트가 없습니다.</Text>
        ) : (
          reports.map((report) => (
            <View key={report.id}>
              <ReportCard report={report} />
              <Button label="상세 보기" onPress={() => navigation.navigate("Report", { report })} />
            </View>
          ))
        )}
        <Button label="지도 화면으로" onPress={() => navigation.navigate("Map")} />
      </ScrollView>
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
  empty: {
    color: "#60726B",
    marginTop: 20
  }
});
