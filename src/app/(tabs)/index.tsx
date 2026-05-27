import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";
import { useState } from "react";

import WebMap from "../../components/map/WebMap";

import { partners } from "../../../data/partners";

export default function MapScreen() {
  const [
    selectedPartnerId,
    setSelectedPartnerId,
  ] = useState<string | null>(
    null
  );


  return (
    <View style={styles.container}>
      {/* SIDEBAR */}
      <View style={styles.sidebar}>
        {/* Header */}
        <View style={styles.brandSection}>
          <View style={styles.brandDot} />

          <View>
            <Text style={styles.brandTitle}>
              AVILOO
            </Text>

            <Text
              style={
                styles.brandSubtitle
              }
            >
              {partners.length} partner
            </Text>
          </View>
        </View>

        {/* Header */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            Partnerek
          </Text>
        </View>

        {/* Partner List */}
        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        >
          {[...partners]
            .sort((a, b) => {
              const zipA = parseInt(
                a.address.match(/^\d+/)?.[0] || "0"
              );

              const zipB = parseInt(
                b.address.match(/^\d+/)?.[0] || "0"
              );

              return zipA - zipB;
            })
            .map((
              partner,
              index
            ) => (
              <TouchableOpacity
                key={partner.id}
                style={[
                  styles.partnerRow,
                  index % 2 === 0
                    ? styles.partnerRowLight
                    : styles.partnerRowDark,
                ]}
                activeOpacity={
                  0.85
                }
                onPress={() => {
                  setSelectedPartnerId(
                    partner.id
                  );
                }}
              >
                <View
                  style={
                    styles.partnerDot
                  }
                />

                <View
                  style={
                    styles.partnerInfo
                  }
                >
                  <Text
                    style={
                      styles.partnerName
                    }
                    numberOfLines={1}
                  >
                    {partner.name}
                  </Text>

                  <Text
                    style={
                      styles.partnerCity
                    }
                    numberOfLines={1}
                  >
                    {partner.address}
                  </Text>
                </View>

                <Text
                  style={
                    styles.arrow
                  }
                >
                  →
                </Text>
              </TouchableOpacity>
            )
            )}
        </ScrollView>
      </View>

      {/* MAIN */}
      <View style={styles.main}>
        {/* TOPBAR */}
        <View style={styles.topbar}>
          <View style={styles.segmented}>
            {/* MAP */}
            <TouchableOpacity
              style={styles.activeTab}
              activeOpacity={0.85}
            >
              <Text
                style={
                  styles.activeTabText
                }
              >
                Térkép
              </Text>
            </TouchableOpacity>

            {/* LIST */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() =>
                router.push("/list")
              }
            >
              <Text
                style={styles.tabText}
              >
                Partnerek
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* MAP */}
        <View
          style={
            styles.mapContainer
          }
        >
          <WebMap
            selectedPartnerId={
              selectedPartnerId
            }
          />
        </View>
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      backgroundColor:
        "#F5F7FA",
    },

    sidebar: {
      width: 310,
      backgroundColor:
        "#FFFFFF",
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 20,
      borderRightWidth: 1,
      borderRightColor:
        "#ECEFF3",
    },

    brandSection: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
    },

    brandDot: {
      width: 12,
      height: 12,
      borderRadius: 999,
      backgroundColor:
        "#009DDF",
      marginRight: 12,
    },

    brandTitle: {
      fontSize: 28,
      fontWeight: "700",
      color: "#111827",
    },

    brandSubtitle: {
      color: "#64748B",
      marginTop: 2,
      fontSize: 14,
    },

    listHeader: {
      marginBottom: 12,
    },

    listTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: "#94A3B8",
      textTransform:
        "uppercase",
      letterSpacing: 1,
    },

    partnerRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 14,
      borderRadius: 16,
      marginBottom: 8,
      backgroundColor:
        "#FFFFFF",
      borderWidth: 1,
      borderColor: "#EEF2F6",
    },

    partnerDot: {
      width: 10,
      height: 10,
      borderRadius: 999,
      backgroundColor:
        "#009DDF",
      marginRight: 14,
    },

    partnerInfo: {
      flex: 1,
    },

    partnerName: {
      fontSize: 15,
      fontWeight: "600",
      color: "#111827",
    },

    partnerCity: {
      color: "#64748B",
      marginTop: 2,
      fontSize: 13,
    },

    arrow: {
      color: "#94A3B8",
      fontSize: 18,
      fontWeight: "600",
    },

    main: {
      flex: 1,
      padding: 14,
      minWidth: 0,
    },

    topbar: {
      height: 58,
      backgroundColor:
        "#FFFFFF",
      borderRadius: 18,
      paddingHorizontal: 18,
      marginBottom: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      borderWidth: 1,
      borderColor: "#EEF2F6",
    },

    segmented: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    activeTab: {
      backgroundColor:
        "#009DDF",
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },

    activeTabText: {
      color: "#FFFFFF",
      fontWeight: "600",
    },

    tabText: {
      color: "#64748B",
      fontWeight: "500",
    },

    liveBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor:
        "#F8FAFC",
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: "#EEF2F6",
    },

    liveDot: {
      width: 8,
      height: 8,
      borderRadius: 999,
      backgroundColor:
        "#22C55E",
      marginRight: 8,
    },

    liveText: {
      fontWeight: "600",
      color: "#111827",
    },

    mapContainer: {
      flex: 1,
      borderRadius: 20,
      overflow: "hidden",
      backgroundColor:
        "#EAF2F8",
    },

    partnerRowLight: {
      backgroundColor:
        "#FFFFFF",
    },

    partnerRowDark: {
      backgroundColor:
        "#FAFCFE",
      borderColor:
        "#E7EEF6",
    },
  });