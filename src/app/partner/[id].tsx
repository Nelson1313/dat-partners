import { router, useLocalSearchParams } from "expo-router";
import {
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    usePartnersStore,
} from "../../store/partnersStore";

import {
    Mail,
    MapPin,
    Navigation,
    Phone,
} from "lucide-react";
import { useEffect } from "react";


export default function PartnerDetail() {
    const { id } =
        useLocalSearchParams();

    const {
        partners,
        fetchPartners,
    } =
        usePartnersStore();

    useEffect(() => {
        fetchPartners();
    }, []);

    const partner =
        partners.find(
            (p) =>
                String(p.id) ===
                String(id)
        );

    if (
        partners.length === 0
    ) {
        return null;
    }

    if (!partner) {
        return (
            <Text>
                Partner nem található
            </Text>
        );
    }

    const openMaps = () => {
        const query =
            encodeURIComponent(
                partner.address
            );

        Linking.openURL(
            `https://www.google.com/maps/search/?api=1&query=${query}`
        );
    };

    const callPartner =
        () => {
            if (
                partner.phone
            ) {
                Linking.openURL(
                    `tel:${partner.phone}`
                );
            }
        };

    const sendEmail =
        () => {
            if (
                partner.email
            ) {
                Linking.openURL(
                    `mailto:${partner.email}`
                );
            }
        };

    return (
        <View style={styles.container}>
            {/* back */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() =>
                    router.back()
                }
            >
                <Text
                    style={
                        styles.backText
                    }
                >
                    ← Vissza
                </Text>
            </TouchableOpacity>

            {/* card */}
            <View style={styles.card}>
                <Text
                    style={
                        styles.partnerName
                    }
                >
                    {partner.name}
                </Text>

                <Text
                    style={
                        styles.subtitle
                    }
                >
                    Partner adatok
                </Text>

                {/* address */}
                <View
                    style={
                        styles.infoCard
                    }
                >
                    <View style={styles.row}>
                        <View
                            style={[
                                styles.iconWrap,
                                styles.locationIcon,
                            ]}
                        >
                            <MapPin
                                size={18}
                                color="#009DDF"
                                strokeWidth={2.4}
                            />
                        </View>

                        <View
                            style={
                                styles.infoContent
                            }
                        >
                            <Text
                                style={
                                    styles.label
                                }
                            >
                                Cím
                            </Text>

                            <Text
                                style={
                                    styles.value
                                }
                            >
                                {
                                    partner.address
                                }
                            </Text>
                        </View>
                    </View>
                </View>

                {/* phone */}
                {!!partner.phone && (
                    <TouchableOpacity
                        style={[
                            styles.infoCard,
                            styles.phoneCard,
                        ]}
                        onPress={
                            callPartner
                        }
                    >
                        <View style={styles.row}>
                            <View
                                style={[
                                    styles.iconWrap,
                                    styles.phoneIcon,
                                ]}
                            >
                                <Phone
                                    size={18}
                                    color="#EC4899"
                                    strokeWidth={2.4}
                                />
                            </View>

                            <View
                                style={
                                    styles.infoContent
                                }
                            >
                                <Text
                                    style={
                                        styles.label
                                    }
                                >
                                    Telefon
                                </Text>

                                <Text
                                    style={
                                        styles.value
                                    }
                                >
                                    {
                                        partner.phone
                                    }
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}

                {/* email */}
                {!!partner.email && (
                    <TouchableOpacity
                        style={[
                            styles.infoCard,
                            styles.emailCard,
                        ]}
                        onPress={
                            sendEmail
                        }
                    >
                        <View style={styles.row}>
                            <View
                                style={[
                                    styles.iconWrap,
                                    styles.emailIcon,
                                ]}
                            >
                                <Mail
                                    size={18}
                                    color="#8B5CF6"
                                    strokeWidth={2.4}
                                />
                            </View>

                            <View
                                style={
                                    styles.infoContent
                                }
                            >
                                <Text
                                    style={
                                        styles.label
                                    }
                                >
                                    Email
                                </Text>

                                <Text
                                    style={
                                        styles.value
                                    }
                                >
                                    {
                                        partner.email
                                    }
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}

                {/* buttons */}
                <TouchableOpacity
                    style={
                        styles.routeButton
                    }
                    onPress={
                        openMaps
                    }
                >
                    <View
                        style={
                            styles.routeRow
                        }
                    >
                        <Navigation
                            size={18}
                            color="#FFF"
                            strokeWidth={2.5}
                        />

                        <Text
                            style={
                                styles.routeButtonText
                            }
                        >
                            Útvonalterv
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles =
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor:
                "#F6F8FB",
            padding: 18,
        },

        emptyContainer: {
            flex: 1,
            justifyContent:
                "center",
            alignItems:
                "center",
            backgroundColor:
                "#F6F8FB",
        },

        emptyText: {
            fontSize: 18,
            color: "#64748B",
        },

        backButton: {
            marginBottom: 22,
        },

        backText: {
            fontSize: 16,
            fontWeight: "700",
            color: "#0F172A",
        },

        card: {
            backgroundColor:
                "#FFFFFF",
            borderRadius: 28,
            padding: 22,
            borderWidth: 1,
            borderColor:
                "#E9EEF4",

            shadowColor:
                "#000",
            shadowOffset: {
                width: 0,
                height: 12,
            },
            shadowOpacity: 0.08,
            shadowRadius: 30,

            elevation: 10,
        },

        partnerName: {
            fontSize: 26,
            fontWeight: "800",
            color: "#0F172A",
            marginBottom: 6,
        },

        subtitle: {
            color: "#64748B",
            fontSize: 15,
            marginBottom: 26,
        },

        infoCard: {
            backgroundColor:
                "#F8FAFC",
            borderRadius: 20,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor:
                "#E7EEF6",
        },

        phoneCard: {
            backgroundColor:
                "#EEF8FF",
            borderColor:
                "#D7EBFB",
        },

        emailCard: {
            backgroundColor:
                "#F7F4FF",
            borderColor:
                "#ECE6FF",
        },

        label: {
            fontSize: 14,
            color: "#64748B",
            marginBottom: 8,
            fontWeight: "700",
        },

        value: {
            fontSize: 18,
            color: "#0F172A",
            fontWeight: "700",
        },

        routeButton: {
            marginTop: 8,
            borderRadius: 22,
            paddingVertical: 18,
            alignItems: "center",

            backgroundColor:
                "#009DDF",
        },

        routeButtonText: {
            color: "#FFF",
            fontSize: 17,
            fontWeight: "800",
        },

        row: {
            flexDirection: "row",
            alignItems: "center",
        },

        infoContent: {
            flex: 1,
        },

        iconWrap: {
            width: 48,
            height: 48,
            borderRadius: 16,
            justifyContent:
                "center",
            alignItems:
                "center",
            marginRight: 14,
        },

        locationIcon: {
            backgroundColor:
                "rgba(0,157,223,.10)",
        },

        phoneIcon: {
            backgroundColor:
                "rgba(236,72,153,.10)",
        },

        emailIcon: {
            backgroundColor:
                "rgba(139,92,246,.10)",
        },

        routeRow: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
        },
    });