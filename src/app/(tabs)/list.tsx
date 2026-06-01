import { router, useFocusEffect } from "expo-router";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import {
    Mail,
    MapPin,
    Phone,
} from "lucide-react";

import {
    useJavitosStore,
} from "../../store/javitosStore";


import {
    useCallback,
    useMemo,
    useState
} from "react";

import {
    setSelectedjavito,
} from "../../store/mapStore";

export default function ListScreen() {
    const [search, setSearch] =
        useState("");

    const {
        javitos,
        fetchJavitos,
    } =
        useJavitosStore();

    useFocusEffect(
        useCallback(() => {
            const load =
                async () => {
                    await fetchJavitos();
                };

            load();
        }, [])
    );

    const filteredjavitos =
        useMemo(() => {
            return [...javitos]
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
                    (javito) => {
                        const query =
                            search.toLowerCase();

                        return (
                            javito.name
                                .toLowerCase()
                                .includes(
                                    query
                                ) ||
                            javito.address
                                .toLowerCase()
                                .includes(
                                    query
                                )
                        );
                    }
                );
        }, [
            search,
            javitos,
        ]);

    return (
        <View style={styles.container}>
            {/* topbar */}
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
                            javitoek
                        </Text>
                    </View>
                </View>
            </View>

            {/* content */}
            <View style={styles.content}>
                {/* header */}
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
                        javitoek
                    </Text>

                    <Text
                        style={
                            styles.count
                        }
                    >
                        {
                            filteredjavitos.length
                        }{" "}
                        javito
                    </Text>
                </View>

                {/* search */}
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

                {/* list */}
                <FlatList
                    data={
                        filteredjavitos
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
                                setSelectedjavito(
                                    item.id
                                );

                                router.push({
                                    pathname:
                                        "/javito/[id]",

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
                                        styles.javitoName
                                    }
                                >
                                    {
                                        item.name
                                    }
                                </Text>

                                <View style={styles.infoRow}>
                                    <MapPin
                                        size={16}
                                        color="#003B7A"
                                        strokeWidth={2.4}
                                    />

                                    <Text style={styles.infoText}>
                                        {item.address}
                                    </Text>
                                </View>

                                <View style={styles.infoRow}>
                                    <Phone
                                        size={16}
                                        color="#EC4899"
                                        strokeWidth={2.4}
                                    />

                                    <Text style={styles.infoText}>
                                        {item.phone}
                                    </Text>
                                </View>

                                <View style={styles.infoRow}>
                                    <Mail
                                        size={16}
                                        color="#8B5CF6"
                                        strokeWidth={2.4}
                                    />

                                    <Text style={styles.infoText}>
                                        {item.email}
                                    </Text>
                                </View>
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
                "#003B7A",
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
            color: "#003B7A",
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
                "#003B7A",
            marginTop: 6,
            marginRight: 14,
        },

        info: {
            flex: 1,
        },

        javitoName: {
            fontSize: 18,
            fontWeight: "700",
            color: "#003B7A",
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
        infoRow: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginTop: 8,
        },

        infoText: {
            color: "#64748B",
            fontSize: 14,
            fontWeight: "500",
        },
    });