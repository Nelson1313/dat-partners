import { router } from "expo-router";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { useMemo, useState } from "react";

import { partners } from "../../../data/partners";

import {
    setSelectedPartner,
} from "../../store/mapStore";

export default function ListScreen() {
    const [search, setSearch] =
        useState("");

    const filteredPartners =
        useMemo(() => {
            return [...partners]
                .sort((a, b) => {
                    const zipA =
                        parseInt(
                            a.address.match(
                                /^\d+/
                            )?.[0] || "0"
                        );

                    const zipB =
                        parseInt(
                            b.address.match(
                                /^\d+/
                            )?.[0] || "0"
                        );

                    return (
                        zipA - zipB
                    );
                })
                .filter(
                    (partner) => {
                        const query =
                            search.toLowerCase();

                        return (
                            partner.name
                                .toLowerCase()
                                .includes(
                                    query
                                ) ||
                            partner.address
                                .toLowerCase()
                                .includes(
                                    query
                                )
                        );
                    }
                );
        }, [search]);

    return (
        <View style={styles.container}>
            {/* TOPBAR */}
            <View style={styles.topbar}>
                <View
                    style={
                        styles.segmented
                    }
                >
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() =>
                            router.push("/")
                        }
                    >
                        <Text
                            style={
                                styles.tabText
                            }
                        >
                            Térkép
                        </Text>
                    </TouchableOpacity>

                    <View
                        style={
                            styles.activeTab
                        }
                    >
                        <Text
                            style={
                                styles.activeTabText
                            }
                        >
                            Partnerek
                        </Text>
                    </View>
                </View>
            </View>

            {/* CONTENT */}
            <View style={styles.content}>
                {/* HEADER */}
                <View
                    style={
                        styles.headerRow
                    }
                >
                    <Text
                        style={
                            styles.title
                        }
                    >
                        Partnerek
                    </Text>

                    <Text
                        style={
                            styles.count
                        }
                    >
                        {
                            filteredPartners.length
                        }{" "}
                        partner
                    </Text>
                </View>

                {/* SEARCH */}
                <TextInput
                    placeholder="Keresés név vagy cím alapján..."
                    placeholderTextColor="#94A3B8"
                    value={search}
                    onChangeText={
                        setSearch
                    }
                    style={
                        styles.search
                    }
                />

                {/* LIST */}
                <FlatList
                    data={
                        filteredPartners
                    }
                    keyExtractor={(
                        item
                    ) => item.id}
                    showsVerticalScrollIndicator={
                        false
                    }
                    contentContainerStyle={{
                        paddingBottom: 30,
                    }}
                    renderItem={({
                        item,
                        index,
                    }) => (
                        <TouchableOpacity
                            style={[
                                styles.card,
                                index % 2 === 0
                                    ? styles.cardLight
                                    : styles.cardDark,
                            ]}
                            activeOpacity={
                                0.9
                            }
                            onPress={() => {
                                setSelectedPartner(
                                    item.id
                                );

                                router.push({
                                    pathname:
                                        "/partner/[id]",

                                    params: {
                                        id: item.id,
                                    },
                                });
                            }}
                        >
                            <View
                                style={
                                    styles.dot
                                }
                            />

                            <View
                                style={
                                    styles.info
                                }
                            >
                                <Text
                                    style={
                                        styles.partnerName
                                    }
                                >
                                    {
                                        item.name
                                    }
                                </Text>

                                <Text
                                    style={
                                        styles.address
                                    }
                                >
                                    📍{" "}
                                    {
                                        item.address
                                    }
                                </Text>

                                {!!item.phone && (
                                    <Text
                                        style={
                                            styles.meta
                                        }
                                    >
                                        📞{" "}
                                        {
                                            item.phone
                                        }
                                    </Text>
                                )}

                                {!!item.email && (
                                    <Text
                                        style={
                                            styles.meta
                                        }
                                    >
                                        ✉️{" "}
                                        {
                                            item.email
                                        }
                                    </Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    );
}

const styles =
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor:
                "#F5F7FA",
            padding: 14,
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
            borderWidth: 1,
            borderColor:
                "#EEF2F6",
        },

        segmented: {
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
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
            fontWeight: "700",
        },

        tabText: {
            color: "#64748B",
            fontWeight: "600",
            fontSize: 15,
        },

        content: {
            flex: 1,
            backgroundColor:
                "white",
            borderRadius: 26,
            padding: 24,
            borderWidth: 1,
            borderColor:
                "#E9EEF4",
        },

        headerRow: {
            flexDirection: "row",
            justifyContent:
                "space-between",
            alignItems: "center",
            marginBottom: 18,
        },

        title: {
            fontSize: 28,
            fontWeight: "800",
            color: "#0F172A",
        },

        count: {
            color: "#64748B",
            fontWeight: "600",
        },

        search: {
            height: 54,
            borderRadius: 18,
            backgroundColor:
                "#F8FAFC",
            borderWidth: 1,
            borderColor:
                "#E2E8F0",
            paddingHorizontal: 18,
            fontSize: 15,
            marginBottom: 20,
        },

        card: {
            flexDirection: "row",
            backgroundColor:
                "#FFFFFF",
            borderRadius: 22,
            padding: 20,
            marginBottom: 12,
            borderWidth: 1,
            borderColor:
                "#E8EDF3",
        },

        dot: {
            width: 12,
            height: 12,
            borderRadius: 999,
            backgroundColor:
                "#009DDF",
            marginTop: 6,
            marginRight: 14,
        },

        info: {
            flex: 1,
        },

        partnerName: {
            fontSize: 18,
            fontWeight: "700",
            color: "#0F172A",
            marginBottom: 8,
        },

        address: {
            color: "#64748B",
            marginBottom: 6,
        },

        meta: {
            color: "#475569",
            marginBottom: 4,
        },

        cardLight: {
            backgroundColor:
                "#FFFFFF",
        },

        cardDark: {
            backgroundColor:
                "#FAFCFE",
            borderColor:
                "#E6EDF5",
        },
    });