import React, { useEffect, useMemo, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged } from "firebase/auth";
import apiClient from "./src/modules/apiClient";
import { API_ENDPOINTS } from "./src/constants/apiConstants";
import { auth } from "./src/lib/firebase";

import AuthScreen from "./src/screens/AuthScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import MapScreen from "./src/screens/MapScreen";
import ReportScreen from "./src/screens/ReportScreen";
import ReportListScreen from "./src/screens/ReportListScreen";
import MyPageScreen from "./src/screens/MyPageScreen";
import ProfileEditScreen from "./src/screens/ProfileEditScreen";
import QuizScreen from "./src/screens/QuizScreen";
import PermissionScreen from "./src/screens/PermissionScreen";

const Stack = createStackNavigator();

export default function App() {
  const [booting, setBooting] = useState(true);
  const [authState, setAuthState] = useState({ token: null, region: null });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        try {
        if (!currentUser) {
          setAuthState({ token: null, region: null });
          return;
        }

        const [token, profile] = await Promise.all([
          currentUser.getIdToken(),
          apiClient.get(API_ENDPOINTS.authMe).catch(() => null)
        ]);

        const user = profile?.data?.user || {};
        setAuthState({
          token,
          region: user.region || null
        });
      } finally {
        setBooting(false);
      }
    });

    return unsubscribe;
  }, []);

  const initialRoute = useMemo(() => {
    if (!authState.token) return "Auth";
    if (!authState.region) return "Onboarding";
    return "Map";
  }, [authState]);

  if (booting) return null;

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth">
          {(props) => <AuthScreen {...props} onAuthed={setAuthState} />}
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
        <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Permission" component={PermissionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
