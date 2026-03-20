import React, { useMemo, useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../components/Button";
import apiClient from "../modules/apiClient";
import { API_ENDPOINTS } from "../constants/apiConstants";
import { REGIONS } from "../constants/regionConstants";

export default function OnboardingScreen({ navigation, onCompleted }) {
  const { width } = useWindowDimensions();
  const contentWidth = useMemo(() => Math.min(width, 520), [width]);
  const [selected, setSelected] = useState(null);

  const submit = async () => {
    if (!selected) return;
    try {
      const response = await apiClient.patch(API_ENDPOINTS.authMe, { region: selected });
      const syncedRegion = response.data?.user?.region || selected;
      await AsyncStorage.setItem("user_region", syncedRegion);
      onCompleted(syncedRegion);
      navigation.replace("Map", { showGuide: true });
    } catch (error) {
      Alert.alert("지역 저장 실패", "Firestore에 지역 정보를 저장하지 못했습니다. 네트워크와 로그인 상태를 확인해 주세요.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { maxWidth: contentWidth }]}>
        <Text style={styles.title}>처음 오셨군요!</Text>
        <Text style={styles.subtitle}>거주 중인 지역구 또는 관광객 여부를 선택해주세요.</Text>

        <View style={styles.list}>
          {REGIONS.map((region) => (
            <TouchableOpacity
              key={region.id}
              style={[styles.item, selected === region.id && styles.itemSelected]}
              onPress={() => setSelected(region.id)}
            >
              <Text style={[styles.itemText, selected === region.id && styles.itemTextSelected]}>
                {region.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button label="선택 완료" onPress={submit} disabled={!selected} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: "#F5FBF8"
  },
  content: {
    width: "100%",
    alignSelf: "center"
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 6
  },
  subtitle: {
    color: "#60726B",
    marginBottom: 18
  },
  list: {
    marginBottom: 16
  },
  item: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDE7E2",
    marginBottom: 8,
    backgroundColor: "#FFFFFF"
  },
  itemSelected: {
    borderColor: "#0D6E4F",
    backgroundColor: "#E9F4EF"
  },
  itemText: {
    fontSize: 15
  },
  itemTextSelected: {
    fontWeight: "700",
    color: "#0D6E4F"
  }
});
