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
    useJavitosStore,
} from "../../store/javitosStore";

type Props = {
    selectedjavito?:
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
    selectedjavito,
}: Props) {
    const mapRef =
        useRef<MapView>(null);

    const {
        javitos,
    } =
        useJavitosStore();

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
            !selectedjavito ||
            !mapRef.current
        )
            return;

        console.log(
            "ZOOMING TO:",
            selectedjavito.name
        );

        mapRef.current.animateToRegion(
            {
                latitude:
                    selectedjavito.latitude,

                longitude:
                    selectedjavito.longitude,

                latitudeDelta:
                    0.02,

                longitudeDelta:
                    0.02,
            },
            900
        );
    }, [
        selectedjavito,
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
                {javitos.map(
                    (
                        javito
                    ) => (
                        <Marker
                            key={
                                javito.id
                            }
                            coordinate={{
                                latitude:
                                    javito.latitude,

                                longitude:
                                    javito.longitude,
                            }}
                            title={
                                javito.name
                            }
                            description={
                                javito.address
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