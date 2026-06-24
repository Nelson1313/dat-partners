import {
    useEffect,
    useRef,
} from "react";

import MapView, {
    Marker,
    Region,
} from "react-native-maps";

import {
    StyleSheet,
    View,
} from "react-native";


import {
    usePartnersStore,
} from "../../store/partnersStore";

type Props = {
    selectedPartner?:
    | {
        id: string;
        name: string;
        address: string;
        phone: string;
        email: string;
        latitude: number;
        longitude: number;
        partner_type?: string;
    }
    | null;
};

export default function WebMap({
    selectedPartner,
}: Props) {
    const mapRef =
        useRef<MapView>(null);

    const {
        partners,
    } =
        usePartnersStore();

    const initialRegion: Region =
    {
        latitude:
            47.1625,

        longitude:
            19.5033,

        latitudeDelta:
            3.2,

        longitudeDelta:
            3.2,
    };

    // sidebar click → zoom
    useEffect(() => {
        if (
            !selectedPartner ||
            !mapRef.current
        )
            return;

        console.log(
            "ZOOMING TO:",
            selectedPartner.name
        );

        mapRef.current.animateToRegion(
            {
                latitude:
                    selectedPartner.latitude,

                longitude:
                    selectedPartner.longitude,

                latitudeDelta:
                    0.02,

                longitudeDelta:
                    0.02,
            },
            900
        );
    }, [
        selectedPartner,
    ]);

    return (
        <View
            style={
                styles.container
            }
        >
            <MapView
                ref={mapRef}
                style={
                    styles.map
                }
                initialRegion={
                    initialRegion
                }
                showsUserLocation
            >
                {partners.map(
                    (
                        partner
                    ) => (
                        <Marker
                            key={
                                partner.id
                            }
                            coordinate={{
                                latitude:
                                    partner.latitude,

                                longitude:
                                    partner.longitude,
                            }}
                            title={
                                partner.name
                            }
                            description={
                                partner.address
                            }
                        >
                            <View
                                style={[
                                    styles.marker,
                                    partner.partner_type === "Független"
                                        ? styles.markerIndependent
                                        : partner.partner_type === "Márkaszervíz"
                                            ? styles.markerBrand
                                            : partner.partner_type === "Értékelő"
                                                ? styles.markerEvaluator
                                                : partner.partner_type === "Javítói börze"
                                                    ? styles.markerExchange
                                                    : styles.markerScrap,
                                ]}
                            >
                                <View
                                    style={
                                        styles.markerInner
                                    }
                                />
                            </View>
                        </Marker>
                    )
                )}
            </MapView>
        </View>
    );
}

const styles =
    StyleSheet.create({
        container: {
            flex: 1,
        },

        map: {
            flex: 1,
        },

        marker: {
            width: 28,
            height: 28,

            borderRadius: 999,

            borderWidth: 4,

            borderColor:
                "#09142B",

            justifyContent:
                "center",

            alignItems:
                "center",

            shadowColor:
                "#000",

            shadowOpacity:
                0.28,

            shadowRadius:
                12,

            shadowOffset: {
                width: 0,
                height: 5,
            },

            elevation: 8,
        },

        markerInner: {
            width: 8,
            height: 8,

            borderRadius: 999,

            backgroundColor:
                "#FFFFFF",
        },

        markerIndependent: {
            backgroundColor:
                "#63D471",
        },

        markerBrand: {
            backgroundColor:
                "#FFD400",
        },

        markerEvaluator: {
            backgroundColor:
                "#FF5C8A",
        },

        markerExchange: {
            backgroundColor: "#FF8A00",
        },

        markerScrap: {
            backgroundColor: "#8B5CF6",
        },
    });