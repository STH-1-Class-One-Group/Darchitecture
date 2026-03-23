import React from "react";
import { StyleSheet } from "react-native";
import MapView from "react-native-maps";
import MapMarker from "./MapMarker";
import RoutePolyline from "./RoutePolyline";

export default function MapCanvas({ stations, loadingStations, coordinates, initialRegion }) {
  return (
    <MapView
      style={StyleSheet.absoluteFill}
      initialRegion={initialRegion}
      showsUserLocation
      showsMyLocationButton={false}
    >
      {!loadingStations && stations.map((station) => <MapMarker key={station.id} station={station} />)}
      <RoutePolyline coordinates={coordinates} />
    </MapView>
  );
}
