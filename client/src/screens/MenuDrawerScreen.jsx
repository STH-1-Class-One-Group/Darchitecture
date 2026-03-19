import React from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MENU_ITEMS = [
  { id: "reports", label: "이용 리포트 목록", onPress: (nav) => nav.navigate("ReportList") },
  { id: "mypage", label: "마이페이지", onPress: (nav) => nav.navigate("MyPage") },
  { id: "guide", label: "이용 안내", onPress: (nav) => nav.goBack() },
  { id: "quiz", label: "탄소 중립 퀴즈", sub: "포인트 적립 가능!", onPress: (nav) => nav.navigate("Quiz") }
];

export default function MenuDrawerScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileRow}>
          <View style={styles.avatar} />
          <View style={styles.profileText}>
            <Text style={styles.welcome}>Welcome back,</Text>
            <Text style={styles.username} numberOfLines={1}>
              user_177376460...
            </Text>
          </View>
          <TouchableOpacity style={styles.closeCircle} onPress={() => navigation.goBack()}>
            <Text style={styles.closeIcon}>×</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Auth")} style={styles.logoutLink}>
          <Text style={styles.logoutText}>Logout →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuSection}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => item.onPress(navigation)}
          >
            <View style={styles.menuIcon} />
            <View style={styles.menuText}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.sub ? <Text style={styles.menuSub}>{item.sub}</Text> : null}
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.divider} />

        <View style={styles.regionItem}>
          <View style={styles.regionIcon} />
          <View style={styles.menuText}>
            <Text style={styles.menuLabel}>현재 지역 설정</Text>
            <Text style={styles.regionValue}>YUSEONG</Text>
          </View>
          <Text style={styles.menuChevron}>⌄</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.help}>Help Center</Text>
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Tashu Carbon Neutrality v2.4.0</Text>
          <Text style={styles.footerText}>© 2024 Tashu</Text>
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
  header: {
    backgroundColor: "#35664A",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.25)"
  },
  profileText: {
    flex: 1
  },
  welcome: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12
  },
  username: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700"
  },
  closeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center"
  },
  closeIcon: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700"
  },
  logoutLink: {
    alignSelf: "flex-end",
    marginTop: 8
  },
  logoutText: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600"
  },
  menuSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E6EFEA"
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F0F4F2",
    marginRight: 12
  },
  menuText: {
    flex: 1
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2A24"
  },
  menuSub: {
    marginTop: 2,
    color: "#3A7D5B",
    fontSize: 12,
    fontWeight: "600"
  },
  menuChevron: {
    fontSize: 18,
    color: "#9AA7A0"
  },
  divider: {
    height: 1,
    backgroundColor: "#E6EFEA",
    marginVertical: 12
  },
  regionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6EFEA"
  },
  regionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F0F4F2",
    marginRight: 12
  },
  regionValue: {
    marginTop: 2,
    color: "#2E6A4A",
    fontSize: 14,
    fontWeight: "700"
  },
  footer: {
    marginTop: "auto",
    paddingHorizontal: 20,
    paddingBottom: 24
  },
  help: {
    textAlign: "right",
    color: "#2E6A4A",
    fontWeight: "600",
    marginBottom: 8
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  footerText: {
    color: "#98A39D",
    fontSize: 11
  }
});
