import { router, useFocusEffect } from "expo-router";
import {
    FlatList,
    ScrollView,
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
    usePartnersStore,
} from "../../store/partnersStore";


import {
    useCallback,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    setSelectedPartner,
} from "../../store/mapStore";

import {
    getPartnerColor
} from "../../utils/partnerTypes";
export default function ListScreen() {
    const [search, setSearch] =
        useState("");

    const [
        selectedCounty,
        setSelectedCounty,
    ] = useState<string | null>(
        null
    );

    const [
        selectedType,
        setSelectedType,
    ] = useState<string | null>(
        null
    );

    const countyScrollRef =
        useRef<any>(null);

    const isDraggingRef =
        useRef(false);

    const startXRef =
        useRef(0);

    const scrollLeftRef =
        useRef(0);

    const {
        partners,
        fetchPartners,
    } =
        usePartnersStore();

    useFocusEffect(
        useCallback(() => {
            const load =
                async () => {
                    await fetchPartners();
                };

            load();
        }, [])
    );

    const counties =
        [
            ...new Set(
                partners
                    .map(
                        (p) =>
                            p.county
                    )
                    .filter(
                        (
                            county
                        ): county is string =>
                            !!county
                    )
            ),
        ].sort();

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
                .filter((partner) => {
                    const matchesType =
                        selectedType
                            ? partner.partner_types?.includes(selectedType) ?? false
                            : true;

                    const matchesCounty =
                        selectedCounty
                            ? partner.county
                                ?.trim()
                                .toLowerCase() ===
                            selectedCounty
                                .trim()
                                .toLowerCase()
                            : true;

                    const query =
                        search.toLowerCase();

                    const matchesSearch =
                        partner.name
                            ?.toLowerCase()
                            .includes(query) ||

                        partner.address
                            ?.toLowerCase()
                            .includes(query) ||

                        partner.email
                            ?.toLowerCase()
                            .includes(query) ||

                        partner.phone
                            ?.toLowerCase()
                            .includes(query);

                    return (
                        matchesType &&
                        matchesCounty &&
                        matchesSearch
                    );
                })
        }, [
            search,
            partners,
            selectedCounty,
            selectedType,
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
                            Javítók
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
                        Javítók
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

                <View style={styles.filtersBar}>
                    <div
                        style={{
                            width: "100%",
                            cursor: "grab",
                        }}
                        onMouseDown={(e) => {
                            isDraggingRef.current =
                                true;

                            startXRef.current =
                                e.pageX;
                        }}
                        onMouseUp={() => {
                            isDraggingRef.current =
                                false;
                        }}
                        onMouseLeave={() => {
                            isDraggingRef.current =
                                false;
                        }}
                        onMouseMove={(e) => {
                            if (
                                !isDraggingRef.current
                            )
                                return;

                            const walk =
                                (startXRef.current -
                                    e.pageX) * 1.8;

                            countyScrollRef.current?.scrollTo({
                                x:
                                    scrollLeftRef.current +
                                    walk,
                                animated: false,
                            });
                        }}
                    >
                        <ScrollView
                            ref={countyScrollRef}
                            horizontal
                            scrollEventThrottle={32}
                            showsHorizontalScrollIndicator={
                                false
                            }
                            onScroll={(e) => {
                                scrollLeftRef.current =
                                    e.nativeEvent.contentOffset.x;
                            }}
                            contentContainerStyle={{
                                gap: 10,
                                paddingRight: 20,
                                alignItems:
                                    "center",
                            }}
                        >
                            <TouchableOpacity
                                onPress={() =>
                                    setSelectedCounty(
                                        null
                                    )
                                }
                                style={[
                                    styles.filterChip,
                                    !selectedCounty &&
                                    styles.activeChip,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.filterChipText,
                                        !selectedCounty &&
                                        styles.activeChipText,
                                    ]}
                                >
                                    Összes
                                </Text>
                            </TouchableOpacity>

                            {counties.map(
                                (county) => (
                                    <TouchableOpacity
                                        key={county}
                                        onPress={() =>
                                            setSelectedCounty(
                                                county
                                            )
                                        }
                                        style={[
                                            styles.filterChip,
                                            selectedCounty ===
                                            county &&
                                            styles.activeChip,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.filterChipText,
                                                selectedCounty ===
                                                county &&
                                                styles.activeChipText,
                                            ]}
                                        >
                                            {county}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            )}
                        </ScrollView>
                    </div>

                    <View style={styles.typeFilters}>
                        {[
                            "Független",
                            "Márkaszervíz",
                            "Értékelő",
                            "Javítói börze",
                            "Roncsbörze",
                        ].map((type) => (
                            <TouchableOpacity
                                key={type}
                                onPress={() =>
                                    setSelectedType(
                                        selectedType ===
                                            type
                                            ? null
                                            : type
                                    )
                                }
                                style={[
                                    styles.legendItem,

                                    type ===
                                    "Független" && {
                                        borderColor:
                                            "#63D471",
                                    },

                                    type ===
                                    "Márkaszervíz" && {
                                        borderColor:
                                            "#FFD400",
                                    },

                                    type ===
                                    "Értékelő" && {
                                        borderColor:
                                            "#FF5C8A",
                                    },

                                    type === "Javítói börze" && {
                                        borderColor: "#FF8A00",
                                    },

                                    type === "Roncsbörze" && {
                                        borderColor: "#8B5CF6",
                                    },



                                    selectedType ===
                                    type && {
                                        backgroundColor:
                                            type === "Független"
                                                ?
                                                "#63D471"
                                                :
                                                type === "Márkaszervíz"
                                                    ?
                                                    "#FFD400"
                                                    :
                                                    type === "Értékelő"
                                                        ?
                                                        "#FF5C8A"
                                                        :
                                                        type === "Javítói börze"
                                                            ?
                                                            "#FF8A00"
                                                            :
                                                            "#8B5CF6",
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.legendText,
                                        selectedType ===
                                        type && {
                                            color:
                                                "#09142B",
                                        },
                                    ]}
                                >
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* search */}
                <View style={styles.searchContainer}>
                    <Text
                        style={
                            styles.searchIcon
                        }
                    >
                        🔍
                    </Text>

                    <TextInput
                        placeholder="Keresés név, cím vagy város alapján..."
                        placeholderTextColor="#6F86B7"
                        value={search}
                        onChangeText={
                            setSearch
                        }
                        style={
                            styles.searchInput
                        }
                    />

                    {search.length >
                        0 && (
                            <TouchableOpacity
                                onPress={() =>
                                    setSearch("")
                                }
                            >
                                <Text
                                    style={
                                        styles.clearText
                                    }
                                >
                                    ✕
                                </Text>
                            </TouchableOpacity>
                        )}
                </View>

                {/* list */}
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
                                style={[
                                    styles.typeBar,
                                    {
                                        backgroundColor: getPartnerColor(
                                            item.partner_types
                                        ),
                                    },
                                ]}
                            />

                            <View
                                style={
                                    styles.info
                                }
                            >
                                <View style={styles.partnerMain}>
                                    <Text
                                        style={
                                            styles.partnerName
                                        }
                                    >
                                        {
                                            item.name
                                        }
                                    </Text>

                                    <View
                                        style={{
                                            flexDirection: "row",
                                            flexWrap: "wrap",
                                            gap: 8,
                                            marginTop: 8,
                                            marginBottom: 4,
                                        }}
                                    >
                                        {(item.partner_types ?? []).map(
                                            (type) => (
                                                <View
                                                    key={type}
                                                    style={[
                                                        styles.partnerTypeBadge,
                                                        {
                                                            backgroundColor:
                                                                getPartnerColor([
                                                                    type,
                                                                ]),
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={
                                                            styles.partnerTypeText
                                                        }
                                                    >
                                                        {type}
                                                    </Text>
                                                </View>
                                            )
                                        )}
                                    </View>

                                    <View style={styles.infoRow}>
                                        <MapPin
                                            size={16}
                                            color="#009DDF"
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
                                <View style={styles.partnerMeta}>
                                    {!!item.tax_number && (
                                        <View
                                            style={
                                                styles.metaItem
                                            }
                                        >
                                            <Text
                                                style={
                                                    styles.metaLabel
                                                }
                                            >
                                                Adószám
                                            </Text>

                                            <Text
                                                style={
                                                    styles.metaValue
                                                }
                                            >
                                                {
                                                    item.tax_number
                                                }
                                            </Text>
                                        </View>
                                    )}

                                    {!!item.contact && (
                                        <View
                                            style={
                                                styles.metaItem
                                            }
                                        >
                                            <Text
                                                style={
                                                    styles.metaLabel
                                                }
                                            >
                                                Kapcsolattartó
                                            </Text>

                                            <Text
                                                style={
                                                    styles.metaValue
                                                }
                                            >
                                                {
                                                    item.contact
                                                }
                                            </Text>
                                        </View>
                                    )}

                                    {!!item.customer_id && (
                                        <View
                                            style={
                                                styles.metaItem
                                            }
                                        >
                                            <Text
                                                style={
                                                    styles.metaLabel
                                                }
                                            >
                                                Ügyfélszám
                                            </Text>

                                            <Text
                                                style={
                                                    styles.metaValue
                                                }
                                            >
                                                {
                                                    item.customer_id
                                                }
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View >
    );
}

const styles =
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor:
                "#071021",
            padding: 14,
        },

        topbar: {
            height: 58,
            backgroundColor:
                "#0B1633",
            borderRadius: 18,
            paddingHorizontal: 18,
            marginBottom: 14,
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor:
                "#13254D",
            shadowColor:
                "#000",

            shadowOpacity:
                0.18,

            shadowRadius:
                20,
        },

        segmented: {
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
        },

        activeTab: {
            backgroundColor:
                "#FFD400",
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 8,
        },

        activeTabText: {
            color: "#09142B",
            fontWeight: "700",
        },

        tabText: {
            color: "#B7C6E0",
            fontWeight: "600",
            fontSize: 15,
        },

        content: {
            flex: 1,
            backgroundColor:
                "#0B1633",
            borderRadius: 26,
            padding: 24,
            borderWidth: 1,
            borderColor:
                "#13254D",
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
            color: "#FFFFFF",
        },

        count: {
            color: "#8AA2D3",
            fontWeight: "600",
        },

        search: {
            height: 54,
            borderRadius: 18,
            backgroundColor:
                "#112043",
            borderWidth: 1,
            borderColor:
                "#223B73",
            color: "#FFFFFF",
            paddingHorizontal: 18,
            fontSize: 15,
            marginBottom: 20,
        },

        card: {
            flexDirection: "row",
            borderRadius: 24,
            paddingVertical: 18,
            paddingHorizontal: 22,
            marginBottom: 14,
            borderWidth: 1,

            alignItems:
                "flex-start",
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
            flexDirection: "row",
            alignItems:
                "flex-start",

            minHeight: 0,
        },

        partnerName: {
            fontSize: 18,
            fontWeight: "700",
            color: "#FFFFFF",
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
                "#101F42",

            borderColor:
                "#20386B",
        },

        cardDark: {
            backgroundColor:
                "#0E1B39",

            borderColor:
                "#1C3363",
        },
        infoRow: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginTop: 8,
        },

        infoText: {
            color: "#B7C6E0",
            fontSize: 14,
            fontWeight: "500",
        },

        partnerTypeBadge: {
            alignSelf: "flex-start",

            paddingHorizontal: 10,

            paddingVertical: 5,

            borderRadius: 999,

            marginTop: 8,
        },

        partnerTypeText: {
            color: "#0B1633",

            fontWeight: "700",

            fontSize: 12,
        },

        independentBadge: {
            backgroundColor:
                "#63D471",
        },

        brandBadge: {
            backgroundColor:
                "#FFD400",
        },

        evaluatorBadge: {
            backgroundColor:
                "#FF5C8A",
        },

        searchContainer: {
            height: 58,
            borderRadius: 20,
            backgroundColor:
                "#101F42",

            borderWidth: 1,
            borderColor:
                "#20386B",

            flexDirection:
                "row",

            alignItems:
                "center",

            paddingHorizontal:
                18,

            marginBottom:
                20,
        },

        searchInput: {
            flex: 1,
            color: "#FFFFFF",
            fontSize: 15,
            fontWeight: "500",
        },

        searchIcon: {
            fontSize: 18,
            marginRight: 10,
        },

        clearText: {
            color: "#7A93C7",
            fontSize: 18,
            fontWeight: "700",
        },

        typeBar: {
            width: 5,
            borderRadius: 999,
            marginRight: 16,
            alignSelf: "stretch",
        },

        filtersBar: {
            marginBottom: 18,
            gap: 14,
        },

        typeFilters: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
        },

        legendItem: {
            height: 42,
            borderRadius: 14,
            paddingHorizontal: 14,
            backgroundColor:
                "#112043",
            justifyContent:
                "center",

            borderWidth: 2,
        },

        legendItemActive: {
            backgroundColor:
                "#FFD400",
        },

        legendText: {
            color: "#FFFFFF",
            fontWeight: "700",
        },

        filterChip: {
            height: 40,
            borderRadius: 12,
            paddingHorizontal: 14,
            justifyContent:
                "center",
            backgroundColor:
                "#112043",
        },

        activeChip: {
            backgroundColor:
                "#FFD400",
        },

        filterChipText: {
            color: "#AFC0E0",
            fontWeight: "600",
        },

        activeChipText: {
            color: "#09142B",
            fontWeight: "700",
        },
        partnerMain: {
            flex: 1,
            paddingRight: 20,
        },

        partnerMeta: {
            width: 260,

            marginLeft: "auto",

            alignSelf:
                "flex-start",

            marginTop: 4,

            paddingLeft: 28,

            borderLeftWidth: 1,

            borderLeftColor:
                "#203A6E",

            gap: 18,
        },

        metaItem: {
            gap: 4,
        },

        metaLabel: {
            color: "#8EA4CC",
            fontSize: 12,
            fontWeight: "700",
            textTransform:
                "uppercase",
        },

        metaValue: {
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: "700",
        },
    });