import React, { useEffect, useMemo, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import AuthScreen from "./src/screens/AuthScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import MapScreen from "./src/screens/MapScreen";
import ReportScreen from "./src/screens/ReportScreen";
import ReportListScreen from "./src/screens/ReportListScreen";
import MyPageScreen from "./src/screens/MyPageScreen";
import QuizScreen from "./src/screens/QuizScreen";
import PermissionScreen from "./src/screens/PermissionScreen";
import { auth, db } from "./src/config/firebase";

const Stack = createStackNavigator();

export default function App() {
  const [booting, setBooting] = useState(true);
  const [authState, setAuthState] = useState({ user: null, region: null });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAuthState({ user: null, region: null });
        setBooting(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        const data = snap.exists() ? snap.data() : null;
        setAuthState({ user, region: data?.region || null });
      } finally {
        setBooting(false);
      }
    });

    return unsubscribe;
  }, []);

  const initialRoute = useMemo(() => {
    if (!authState.user) return "Auth";
    if (!authState.region) return "Onboarding";
    return "Map";
  }, [authState]);

  if (booting) return null;

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        key={`${authState.user?.uid || "guest"}-${authState.region || "none"}`}
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Auth">
          {(props) => <AuthScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Onboarding">
          {(props) => (
            <OnboardingScreen
              {...props}
              onCompleted={(region) => setAuthState((prev) => ({ ...prev, region }))}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Report" component={ReportScreen} />
        <Stack.Screen name="ReportList" component={ReportListScreen} />
        <Stack.Screen name="MyPage" component={MyPageScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Permission" component={PermissionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
