import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

function StationChip({ station }) {
  return (
    <View style={styles.stationChip}>
      <Text style={styles.stationName} numberOfLines={1}>
        {station.name}
      </Text>
      <Text style={styles.stationAddress} numberOfLines={2}>
        {station.address || "No address available"}
      </Text>
    </View>
  );
}

export default function MapCanvas({ stations, loadingStations, coordinates }) {
  const visibleStations = stations.slice(0, 6);

  return (
    <View style={styles.canvas}>
      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>Web Preview</Text>
        <Text style={styles.heroTitle}>Web export shows a summary view instead of the native map</Text>
        <Text style={styles.heroBody}>
          `react-native-maps` does not provide a real browser map here, so Pages will show the station list and ride
          summary in a stable fallback layout.
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{loadingStations ? "..." : stations.length}</Text>
          <Text style={styles.statLabel}>Stations</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{coordinates.length}</Text>
          <Text style={styles.statLabel}>Track points</Text>
        </View>
      </View>

      <View style={styles.listCard}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Station preview</Text>
          <Text style={styles.listMeta}>{loadingStations ? "Loading" : `${visibleStations.length} shown`}</Text>
        </View>

        {loadingStations ? (
          <Text style={styles.emptyText}>Fetching station data...</Text>
        ) : visibleStations.length > 0 ? (
          <ScrollView contentContainerStyle={styles.stationList} showsVerticalScrollIndicator={false}>
            {visibleStations.map((station) => (
              <StationChip key={station.id} station={station} />
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.emptyText}>No stations available.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 20,
    paddingTop: 96,
    paddingBottom: 160,
    backgroundColor: "#F5FBF8",
    gap: 14
  },
  heroCard: {
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5EFEA",
    padding: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2
  },
  heroLabel: {
    color: "#0D6E4F",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 8
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    lineHeight: 28,
    marginBottom: 8
  },
  heroBody: {
    fontSize: 13,
    lineHeight: 20,
    color: "#5B6B64"
  },
  statsRow: {
    flexDirection: "row",
    gap: 12
  },
  statCard: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderWidth: 1,
    borderColor: "#E6EEE9",
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center"
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#066544"
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: "#60726B"
  },
  listCard: {
    flex: 1,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5EFEA",
    padding: 18,
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14
  },
  listTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827"
  },
  listMeta: {
    fontSize: 12,
    color: "#60726B",
    fontWeight: "600"
  },
  stationList: {
    gap: 10,
    paddingBottom: 8
  },
  stationChip: {
    borderRadius: 18,
    backgroundColor: "#F7FAF8",
    borderWidth: 1,
    borderColor: "#EDF3EF",
    padding: 14
  },
  stationName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4
  },
  stationAddress: {
    fontSize: 12,
    lineHeight: 18,
    color: "#60726B"
  },
  emptyText: {
    fontSize: 13,
    color: "#60726B"
  }
});
