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
                        />
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
    });