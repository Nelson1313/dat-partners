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

import { partners } from "../../../data/partners";

type Props = {
    selectedPartnerId?: string | null;
};

type Partner = {
    id: string;
    name: string;
    address: string;
    phone?: string;
    email?: string;
    latitude: number;
    longitude: number;
};

export default function WebMap({
    selectedPartnerId,
}: Props) {
    const mapRef =
        useRef<MapView>(null);

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

    // late sidebar/click zoom
    useEffect(() => {
        if (
            !selectedPartnerId
        )
            return;

        const partner =
            partners.find(
                (
                    p: Partner
                ) =>
                    p.id ===
                    selectedPartnerId
            );

        if (!partner)
            return;

        mapRef.current?.animateToRegion(
            {
                latitude:
                    partner.latitude,

                longitude:
                    partner.longitude,

                latitudeDelta:
                    0.02,

                longitudeDelta:
                    0.02,
            },
            600
        );
    }, [
        selectedPartnerId,
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
                        partner: Partner
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