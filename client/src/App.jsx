import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable } from 'react-native';

import AuthScreen from './screens/AuthScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import MapScreen from './screens/MapScreen';
import ReportScreen from './screens/ReportScreen';
import ReportListScreen from './screens/ReportListScreen';
import MyPageScreen from './screens/MyPageScreen';
import QuizScreen from './screens/QuizScreen';
import PermissionScreen from './screens/PermissionScreen';

import { createRideSession, endRideSession } from './modules/rideModule';
import { calculateCarbonReductionKg } from './modules/carbonModule';
import { calculatePoints } from './modules/pointModule';
import { logUsage } from './modules/usageModule';

const TABS = [
  { key: 'Map', label: '지도' },
  { key: 'Reports', label: '리포트' },
  { key: 'MyPage', label: '마이페이지' },
  { key: 'Permission', label: '권한' },
];

export default function App() {
  const [screen, setScreen] = useState('Auth');
  const [user, setUser] = useState(null);
  const [region, setRegion] = useState(null);
  const [currentRide, setCurrentRide] = useState(null);
  const [reports, setReports] = useState([]);
  const [pointLogs, setPointLogs] = useState([]);
  const [pointBalance, setPointBalance] = useState(0);
  const [activeReport, setActiveReport] = useState(null);

  const canUseTabs = Boolean(user && region && !['Auth', 'Onboarding', 'Quiz'].includes(screen));

  const handleLogin = (profile) => {
    setUser(profile);
    logUsage(profile.id, 'login');
    setScreen(region ? 'Map' : 'Onboarding');
  };

  const handleOnboardingComplete = (selectedRegion) => {
    setRegion(selectedRegion);
    logUsage(user?.id, 'onboarding_complete');
    setScreen('Map');
  };

  const handleStartRide = () => {
    const ride = createRideSession(user?.id || 'guest');
    setCurrentRide(ride);
    logUsage(user?.id, 'ride_start');
  };

  const handleEndRide = (rideMeta) => {
    if (!currentRide) return;
    const finishedRide = endRideSession(currentRide, rideMeta);
    const carbonReductionKg = calculateCarbonReductionKg(finishedRide.distanceKm);
    const pointsEarned = calculatePoints(carbonReductionKg);

    const report = {
      id: `report_${Date.now()}`,
      rideId: finishedRide.id,
      distanceKm: finishedRide.distanceKm,
      durationMin: finishedRide.durationMin,
      carbonReductionKg,
      pointsEarned,
      createdAt: new Date().toISOString(),
    };

    setReports((prev) => [report, ...prev]);
    setPointLogs((prev) => [
      {
        id: `point_${Date.now()}`,
        amount: pointsEarned,
        earnedAt: report.createdAt,
      },
      ...prev,
    ]);
    setPointBalance((prev) => prev + pointsEarned);
    setActiveReport(report);
    setCurrentRide(null);
    logUsage(user?.id, 'ride_end');
    setScreen('Report');
  };

  const handleSelectReport = (report) => {
    setActiveReport(report);
    logUsage(user?.id, 'report_view');
    setScreen('Report');
  };

  const screenNode = useMemo(() => {
    if (screen === 'Auth') {
      return <AuthScreen onLogin={handleLogin} />;
    }

    if (screen === 'Onboarding') {
      return <OnboardingScreen onComplete={handleOnboardingComplete} />;
    }

    if (screen === 'Map') {
      return (
        <MapScreen
          user={user}
          region={region}
          currentRide={currentRide}
          onStartRide={handleStartRide}
          onEndRide={handleEndRide}
        />
      );
    }

    if (screen === 'Report') {
      return (
        <ReportScreen
          report={activeReport}
          onBack={() => setScreen('Map')}
          onViewList={() => setScreen('Reports')}
        />
      );
    }

    if (screen === 'Reports') {
      return (
        <ReportListScreen
          reports={reports}
          onSelectReport={handleSelectReport}
          onEmptyAction={() => setScreen('Map')}
        />
      );
    }

    if (screen === 'MyPage') {
      return (
        <MyPageScreen
          user={user}
          region={region}
          pointBalance={pointBalance}
          pointLogs={pointLogs}
          onOpenQuiz={() => setScreen('Quiz')}
        />
      );
    }

    if (screen === 'Quiz') {
      return <QuizScreen onDone={() => setScreen('MyPage')} />;
    }

    if (screen === 'Permission') {
      return <PermissionScreen />;
    }

    return null;
  }, [
    screen,
    user,
    region,
    currentRide,
    reports,
    pointLogs,
    pointBalance,
    activeReport,
  ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundLayer} />
      <View style={styles.backgroundAccent} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>TA-CU</Text>
          <Text style={styles.headerSubtitle}>대전 탄소중립 라이프</Text>
        </View>
        <View style={styles.screenArea}>{screenNode}</View>
        {canUseTabs && (
          <View style={styles.tabBar}>
            {TABS.map((tab) => (
              <Pressable
                key={tab.key}
                onPress={() => setScreen(tab.key)}
                style={[
                  styles.tabButton,
                  screen === tab.key && styles.tabButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    screen === tab.key && styles.tabLabelActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F1EA',
  },
  backgroundLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: '#DDEBDD',
  },
  backgroundAccent: {
    position: 'absolute',
    top: '45%',
    left: 24,
    right: 24,
    height: 160,
    borderRadius: 32,
    backgroundColor: '#F9EED8',
    opacity: 0.8,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Georgia',
    color: '#1E3A2B',
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#3D5A43',
    marginTop: 4,
    fontFamily: 'serif',
  },
  screenArea: {
    flex: 1,
    paddingHorizontal: 18,
    paddingBottom: 12,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    marginBottom: 14,
    padding: 8,
    borderRadius: 16,
    backgroundColor: '#1F3A2E',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: '#EFD6A6',
  },
  tabLabel: {
    color: '#E6E3DA',
    fontSize: 12,
    fontFamily: 'serif',
  },
  tabLabelActive: {
    color: '#1F3A2E',
    fontWeight: '700',
  },
});
