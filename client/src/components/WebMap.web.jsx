import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";

function createStationIcon() {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 18px;
        height: 18px;
        border-radius: 999px;
        background: #066544;
        border: 3px solid white;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
      "></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
}

function createCurrentPositionIcon() {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 18px;
        height: 18px;
        border-radius: 999px;
        background: #22c55e;
        border: 3px solid white;
        box-shadow: 0 0 0 8px rgba(34, 197, 94, 0.18);
      "></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
}

function MapController({ defaultCenter, currentPoint, onActionsReady }) {
  const map = useMap();
  const initialViewAppliedRef = useRef(false);
  const currentPointAppliedRef = useRef(false);

  useEffect(() => {
    if (!onActionsReady) return;

    onActionsReady({
      zoomIn: () => map.zoomIn(),
      zoomOut: () => map.zoomOut(),
      recenter: (target, zoom = 16) => {
        const nextTarget = Array.isArray(target) && target.length === 2 ? target : [defaultCenter.latitude, defaultCenter.longitude];
        map.setView(nextTarget, zoom, { animate: true });
      }
    });
  }, [defaultCenter.latitude, defaultCenter.longitude, map, onActionsReady]);

  useEffect(() => {
    if (currentPoint && !currentPointAppliedRef.current) {
      map.setView([currentPoint.lat, currentPoint.lng], 16, { animate: false });
      currentPointAppliedRef.current = true;
      return;
    }

    if (!currentPoint && !initialViewAppliedRef.current) {
      map.setView([defaultCenter.latitude, defaultCenter.longitude], 13, { animate: false });
      initialViewAppliedRef.current = true;
    }
  }, [currentPoint, defaultCenter.latitude, defaultCenter.longitude, map]);

  return null;
}

export default function WebMap({ stations = [], coordinates = [], defaultCenter, onActionsReady }) {
  const currentPoint = coordinates.length > 0 ? coordinates[coordinates.length - 1] : null;
  const stationIcon = useMemo(() => createStationIcon(), []);
  const currentIcon = useMemo(() => createCurrentPositionIcon(), []);
  const routePositions = useMemo(
    () =>
      coordinates
        .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng))
        .map((point) => [point.lat, point.lng]),
    [coordinates]
  );
  const stationMarkers = useMemo(
    () =>
      stations.filter((station) => Number.isFinite(station.lat) && Number.isFinite(station.lng)),
    [stations]
  );
  const [mapActions, setMapActions] = useState(null);

  return (
    <View style={styles.container}>
      <View style={styles.mapShell}>
        <MapContainer
          center={[defaultCenter.latitude, defaultCenter.longitude]}
          zoom={13}
          scrollWheelZoom
          zoomControl={false}
          style={styles.map}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController
            defaultCenter={defaultCenter}
            currentPoint={currentPoint}
            onActionsReady={(actions) => {
              setMapActions(actions);
              onActionsReady?.(actions);
            }}
          />

          {stationMarkers.map((station) => (
            <Marker key={station.id} position={[station.lat, station.lng]} icon={stationIcon}>
              <Popup>
                <strong>{station.name}</strong>
                <br />
                {station.address}
              </Popup>
            </Marker>
          ))}

          {routePositions.length > 1 ? (
            <Polyline positions={routePositions} pathOptions={{ color: "#0D6E4F", weight: 4 }} />
          ) : null}

          {currentPoint ? <Marker position={[currentPoint.lat, currentPoint.lng]} icon={currentIcon} /> : null}

          {currentPoint ? (
            <CircleMarker
              center={[currentPoint.lat, currentPoint.lng]}
              radius={10}
              pathOptions={{ color: "#22c55e", fillColor: "#22c55e", fillOpacity: 0.25 }}
            />
          ) : null}
        </MapContainer>

        <View pointerEvents="box-none" style={styles.zoomControlStack}>
          <Pressable
            onPress={() => mapActions?.zoomIn()}
            style={({ pressed }) => [styles.zoomButton, pressed && styles.pressed]}
          >
            <Text style={styles.zoomButtonText}>+</Text>
          </Pressable>
          <View style={styles.zoomDivider} />
          <Pressable
            onPress={() => mapActions?.zoomOut()}
            style={({ pressed }) => [styles.zoomButton, pressed && styles.pressed]}
          >
            <Text style={styles.zoomButtonText}>-</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 320
  },
  mapShell: {
    flex: 1,
    minHeight: 320,
    position: "relative",
    borderRadius: 24,
    overflow: "hidden"
  },
  map: {
    flex: 1,
    width: "100%",
    minHeight: 320,
    borderRadius: 24
  },
  zoomControlStack: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 1000,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8
  },
  zoomButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center"
  },
  zoomButtonText: {
    fontSize: 24,
    lineHeight: 24,
    fontWeight: "800",
    color: "#111827"
  },
  zoomDivider: {
    height: 1,
    backgroundColor: "#E5E7EB"
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }]
  }
});
