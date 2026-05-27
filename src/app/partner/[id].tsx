import { router, useLocalSearchParams } from "expo-router";
import {
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { partners } from "../../../data/partners";

export default function PartnerDetail() {
    const { id } =
        useLocalSearchParams();

    const partner =
        partners.find(
            (p) => p.id === id
        );

    if (!partner) {
        return (
            <View
                style={
                    styles.emptyContainer
                }
            >
                <Text
                    style={
                        styles.emptyText
                    }
                >
                    Partner nem található
                </Text>
            </View>
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
            {/* BACK */}
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

            {/* CARD */}
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

                {/* ADDRESS */}
                <View
                    style={
                        styles.infoCard
                    }
                >
                    <Text
                        style={
                            styles.label
                        }
                    >
                        📍 Cím
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

                {/* PHONE */}
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
                        <Text
                            style={
                                styles.label
                            }
                        >
                            📞 Telefon
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
                    </TouchableOpacity>
                )}

                {/* EMAIL */}
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
                        <Text
                            style={
                                styles.label
                            }
                        >
                            ✉️ Email
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
                    </TouchableOpacity>
                )}

                {/* BUTTONS */}
                <TouchableOpacity
                    style={
                        styles.routeButton
                    }
                    onPress={
                        openMaps
                    }
                >
                    <Text
                        style={
                            styles.routeButtonText
                        }
                    >
                        Útvonalterv
                    </Text>
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
            padding: 28,
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
            borderRadius: 34,
            padding: 30,
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
            fontSize: 34,
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
            borderRadius: 24,
            padding: 22,
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
    });