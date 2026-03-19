import React, { useEffect, useMemo, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AuthScreen from "./src/screens/AuthScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import MapScreen from "./src/screens/MapScreen";
import ReportScreen from "./src/screens/ReportScreen";
import ReportListScreen from "./src/screens/ReportListScreen";
import MyPageScreen from "./src/screens/MyPageScreen";
import QuizScreen from "./src/screens/QuizScreen";
import PermissionScreen from "./src/screens/PermissionScreen";
import MenuDrawerScreen from "./src/screens/MenuDrawerScreen";

const Stack = createStackNavigator();

export default function App() {
  const [booting, setBooting] = useState(true);
  const [authState, setAuthState] = useState({ token: null, userId: null, region: null });

  useEffect(() => {
    const boot = async () => {
      try {
        const [token, userId, region] = await Promise.all([
          AsyncStorage.getItem("auth_token"),
          AsyncStorage.getItem("user_id"),
          AsyncStorage.getItem("user_region")
        ]);
        setAuthState({ token, userId, region });
      } finally {
        setBooting(false);
      }
    };
    boot();
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
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Permission" component={PermissionScreen} />
        <Stack.Screen name="MenuDrawer" component={MenuDrawerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
