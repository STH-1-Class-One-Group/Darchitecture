import React, { useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, setDoc } from "firebase/firestore";
import Button from "../components/Button";
import { REGIONS } from "../constants/regionConstants";
import { auth, db } from "../config/firebase";

export default function OnboardingScreen({ navigation, onCompleted }) {
  const { width } = useWindowDimensions();
  const contentWidth = useMemo(() => Math.min(width, 520), [width]);
  const [selected, setSelected] = useState(null);

  const submit = async () => {
    if (!selected) return;

    await AsyncStorage.setItem("user_region", selected);
    const user = auth.currentUser;
    if (user) {
      await setDoc(
        doc(db, "users", user.uid),
        {
          id: user.uid,
          region: selected,
          updatedAt: Date.now()
        },
        { merge: true }
      );
    }

    onCompleted(selected);
    navigation.replace("Map");
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

        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>이용 시작 순서 안내</Text>
          <Text style={styles.tipText}>1. 타슈 앱에서 대여 시작</Text>
          <Text style={styles.tipText}>2. 본 앱에서 이용 시작 버튼 클릭</Text>
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
  },
  tipBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14
  },
  tipTitle: {
    fontWeight: "700",
    marginBottom: 6
  },
  tipText: {
    color: "#60726B"
  }
});
