import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';
import MapMarker from '../components/MapMarker';
import RoutePolyline from '../components/RoutePolyline';

const STATIONS = [
  { id: 'tashu-01', name: '대전역 1번 출구', docks: 18 },
  { id: 'tashu-02', name: '유성 온천역', docks: 22 },
  { id: 'tashu-03', name: '정부청사 앞', docks: 16 },
];

export default function MapScreen({ user, region, currentRide, onStartRide, onEndRide }) {
  const [coordinates, setCoordinates] = useState([]);

  useEffect(() => {
    if (!currentRide) {
      setCoordinates([]);
      return undefined;
    }

    const interval = setInterval(() => {
      setCoordinates((prev) => {
        const last = prev[prev.length - 1] || { lat: 36.35, lng: 127.38 };
        const next = {
          lat: last.lat + (Math.random() - 0.5) * 0.001,
          lng: last.lng + (Math.random() - 0.5) * 0.001,
        };
        return [...prev, next];
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [currentRide]);

  const rideStatus = currentRide ? '이용 중' : '대기 중';

  const rideMeta = useMemo(
    () => ({
      coordinates,
    }),
    [coordinates]
  );

  return (
    <View style={styles.container}>
      <Card style={styles.hero}>
        <Text style={styles.title}>안녕하세요, {user?.name}님</Text>
        <Text style={styles.meta}>현재 지역: {region?.label}</Text>
        <Text style={styles.status}>타슈 상태: {rideStatus}</Text>
      </Card>

      <Card style={styles.mapBox}>
        <Text style={styles.mapTitle}>실시간 지도</Text>
        <Text style={styles.mapSubtitle}>타슈 대여소와 이동 경로를 한눈에.</Text>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>지도 영역 (프로토타입)</Text>
        </View>
        <RoutePolyline points={coordinates.length} />
      </Card>

      <View style={styles.buttonRow}>
        {!currentRide ? (
          <Button label="이용 시작" onPress={onStartRide} />
        ) : (
          <Button label="이용 종료" onPress={() => onEndRide(rideMeta)} />
        )}
      </View>

      <Text style={styles.sectionTitle}>가까운 타슈 대여소</Text>
      {STATIONS.map((station) => (
        <MapMarker key={station.id} name={station.name} docks={station.docks} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    marginBottom: 14,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 16,
    color: '#1F3A2E',
  },
  meta: {
    marginTop: 6,
    color: '#4A5E4F',
  },
  status: {
    marginTop: 4,
    color: '#8B3F2D',
    fontWeight: '600',
  },
  mapBox: {
    marginBottom: 14,
  },
  mapTitle: {
    fontFamily: 'serif',
    fontSize: 15,
    color: '#1F3A2E',
  },
  mapSubtitle: {
    color: '#4A5E4F',
    marginBottom: 8,
  },
  mapPlaceholder: {
    height: 120,
    borderRadius: 16,
    backgroundColor: '#1F3A2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  mapPlaceholderText: {
    color: '#F4F1EA',
    fontSize: 12,
  },
  buttonRow: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: 'serif',
    color: '#1F3A2E',
    marginBottom: 10,
  },
});
