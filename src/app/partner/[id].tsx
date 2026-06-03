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
                Javító nem található
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
                        style={
                            styles.infoCard
                        }
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
                        style={
                            styles.infoCard
                        }
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
                                <View style={styles.extraInfo}>
                                    {!!partner.tax_number && (
                                        <View style={styles.extraRow}>
                                            <Text
                                                style={
                                                    styles.extraLabel
                                                }
                                            >
                                                Adószám
                                            </Text>

                                            <Text
                                                style={
                                                    styles.extraValue
                                                }
                                            >
                                                {
                                                    partner.tax_number
                                                }
                                            </Text>
                                        </View>
                                    )}

                                    {!!partner.contact && (
                                        <View style={styles.extraRow}>
                                            <Text
                                                style={
                                                    styles.extraLabel
                                                }
                                            >
                                                Kapcsolattartó
                                            </Text>

                                            <Text
                                                style={
                                                    styles.extraValue
                                                }
                                            >
                                                {
                                                    partner.contact
                                                }
                                            </Text>
                                        </View>
                                    )}

                                    {!!partner.customer_id && (
                                        <View style={styles.extraRow}>
                                            <Text
                                                style={
                                                    styles.extraLabel
                                                }
                                            >
                                                Ügyfélszám
                                            </Text>

                                            <Text
                                                style={
                                                    styles.extraValue
                                                }
                                            >
                                                {
                                                    partner.customer_id
                                                }
                                            </Text>
                                        </View>
                                    )}
                                </View>
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
                "#071021",
            padding: 22,
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
            height: 44,
            alignSelf: "flex-start",

            paddingHorizontal: 18,

            borderRadius: 14,

            backgroundColor:
                "#0F1C37",

            borderWidth: 1,

            borderColor:
                "#203A6E",

            justifyContent:
                "center",

            marginBottom: 22,
        },

        backText: {
            fontSize: 15,
            fontWeight: "700",
            color: "#FFD400",
        },

        card: {
            backgroundColor:
                "#09142B",

            borderRadius: 30,

            padding: 24,

            borderWidth: 1,

            borderColor:
                "#203A6E",

            shadowColor:
                "#000",

            shadowOffset: {
                width: 0,
                height: 12,
            },

            shadowOpacity: 0.25,

            shadowRadius: 24,

            elevation: 8,
        },

        partnerName: {
            fontSize: 28,
            fontWeight: "800",
            color: "#FFFFFF",
            marginBottom: 8,
        },

        subtitle: {
            color: "#FFD400",
            fontSize: 13,
            fontWeight: "800",
            textTransform:
                "uppercase",
            letterSpacing: 1.2,
            marginBottom: 26,
        },

        infoCard: {
            backgroundColor:
                "#112043",

            borderRadius: 22,

            padding: 18,

            marginBottom: 14,

            borderWidth: 1,

            borderColor:
                "#203A6E",
        },

        label: {
            fontSize: 13,
            color: "#FFD400",
            marginBottom: 6,
            fontWeight: "700",
            textTransform:
                "uppercase",
        },

        value: {
            fontSize: 16,
            color: "#FFFFFF",
            fontWeight: "700",
        },

        routeButton: {
            marginTop: 10,

            borderRadius: 20,

            height: 58,

            alignItems:
                "center",

            justifyContent:
                "center",

            backgroundColor:
                "#FFD400",
        },

        routeButtonText: {
            color: "#09142B",
            fontSize: 16,
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
                "#0F1C37",
        },

        phoneIcon: {
            backgroundColor:
                "#0F1C37",
        },

        emailIcon: {
            backgroundColor:
                "#0F1C37",
        },

        routeRow: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
        },
        extraInfo: {
            marginTop: 18,
            paddingTop: 16,

            borderTopWidth: 1,

            borderTopColor:
                "#203A6E",

            gap: 12,
        },

        extraRow: {
            flexDirection: "row",
            justifyContent:
                "space-between",
            alignItems: "center",
        },

        extraLabel: {
            color: "#8EA4CC",
            fontSize: 13,
            fontWeight: "700",
        },

        extraValue: {
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: "700",
        },
    });