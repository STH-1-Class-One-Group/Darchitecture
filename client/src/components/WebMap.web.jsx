import React, { useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";
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

function BoundsController({ stations, coordinates, defaultCenter }) {
  const map = useMap();

  const points = useMemo(() => {
    const stationPoints = stations
      .filter((station) => Number.isFinite(station.lat) && Number.isFinite(station.lng))
      .map((station) => [station.lat, station.lng]);
    const ridePoints = coordinates
      .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng))
      .map((point) => [point.lat, point.lng]);
    return [...stationPoints, ...ridePoints];
  }, [stations, coordinates]);

  useEffect(() => {
    if (points.length === 0) {
      map.setView([defaultCenter.latitude, defaultCenter.longitude], 13);
      return;
    }

    if (points.length === 1) {
      map.setView(points[0], 16);
      return;
    }

    map.fitBounds(points, { padding: [32, 32], maxZoom: 16 });
  }, [defaultCenter.latitude, defaultCenter.longitude, map, points]);

  return null;
}

export default function WebMap({ stations = [], coordinates = [], defaultCenter }) {
  const currentPoint = coordinates.length > 0 ? coordinates[coordinates.length - 1] : null;
  const stationIcon = useMemo(() => createStationIcon(), []);
  const currentIcon = useMemo(() => createCurrentPositionIcon(), []);

  return (
    <View style={styles.container}>
      <MapContainer
        center={[defaultCenter.latitude, defaultCenter.longitude]}
        zoom={13}
        scrollWheelZoom={false}
        style={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <BoundsController stations={stations} coordinates={coordinates} defaultCenter={defaultCenter} />

        {stations
          .filter((station) => Number.isFinite(station.lat) && Number.isFinite(station.lng))
          .map((station) => (
            <Marker
              key={station.id}
              position={[station.lat, station.lng]}
              icon={stationIcon}
            >
              <Popup>
                <strong>{station.name}</strong>
                <br />
                {station.address}
              </Popup>
            </Marker>
          ))}

        {coordinates.length > 1 ? (
          <Polyline
            positions={coordinates
              .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng))
              .map((point) => [point.lat, point.lng])}
            pathOptions={{ color: "#0D6E4F", weight: 4 }}
          />
        ) : null}

        {currentPoint ? (
          <Marker position={[currentPoint.lat, currentPoint.lng]} icon={currentIcon} />
        ) : null}

        {currentPoint ? (
          <CircleMarker
            center={[currentPoint.lat, currentPoint.lng]}
            radius={10}
            pathOptions={{ color: "#22c55e", fillColor: "#22c55e", fillOpacity: 0.25 }}
          />
        ) : null}
      </MapContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 320
  },
  map: {
    flex: 1,
    width: "100%",
    minHeight: 320,
    borderRadius: 24,
    overflow: "hidden"
  }
});
