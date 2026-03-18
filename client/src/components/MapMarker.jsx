import React from "react";
import { Marker } from "react-native-maps";

export default function MapMarker({ station }) {
  return (
    <Marker
      key={station.id}
      coordinate={{ latitude: station.lat, longitude: station.lng }}
      title={station.name}
      description={station.address}
    />
  );
}
