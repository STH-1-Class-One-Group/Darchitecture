import React from "react";
import { Polyline } from "react-native-maps";

export default function RoutePolyline({ coordinates }) {
  if (!coordinates || coordinates.length < 2) return null;
  return (
    <Polyline
      coordinates={coordinates.map((c) => ({ latitude: c.lat, longitude: c.lng }))}
      strokeColor="#0D6E4F"
      strokeWidth={4}
    />
  );
}
