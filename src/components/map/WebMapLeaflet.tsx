import { useEffect, useMemo, useRef } from "react";
import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { partners } from "../../../data/partners";

type Partner = {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phone?: string;
    email?: string;
};

type WebMapLeafletProps = {
    selectedPartnerId?: string | null;
};

/* marker icon */

const customIcon = L.icon({
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

    iconSize: [28, 42],

    /* pin edge */
    iconAnchor: [14, 42],

    /* popup up */
    popupAnchor: [0, -40],
});

/* map controller */

function MapController({
    selectedPartner,
    markerRefs,
}: {
    selectedPartner?: Partner | null;
    markerRefs: React.MutableRefObject<
        Record<string, L.Marker | null>
    >;
}) {
    const map = useMap();

    /* sidebar click */
    useEffect(() => {
        if (!selectedPartner) return;

        map.flyTo(
            [
                selectedPartner.latitude,
                selectedPartner.longitude,
            ],
            17,
            {
                duration: 0.7,
            }
        );

        const marker =
            markerRefs.current[
            selectedPartner.id
            ];

        map.once("moveend", () => {
            marker?.openPopup();
        });
    }, [
        selectedPartner,
        map,
        markerRefs,
    ]);

    /* zoom out -> popup close */
    useEffect(() => {
        const handleZoom = () => {
            const zoom =
                map.getZoom();

            if (zoom < 17) {
                map.closePopup();
            }
        };

        map.on(
            "zoomend",
            handleZoom
        );

        return () => {
            map.off(
                "zoomend",
                handleZoom
            );
        };
    }, [map]);

    return null;
}

/* component */

export default function WebMapLeaflet({
    selectedPartnerId,
}: WebMapLeafletProps) {
    const markerRefs = useRef<
        Record<string, L.Marker | null>
    >({});

    const validPartners =
        useMemo(() => {
            return partners.filter(
                (partner) =>
                    partner.latitude &&
                    partner.longitude
            ) as Partner[];
        }, []);

    const selectedPartner =
        useMemo(() => {
            return validPartners.find(
                (partner) =>
                    partner.id ===
                    selectedPartnerId
            );
        }, [
            validPartners,
            selectedPartnerId,
        ]);

    return (
        <MapContainer
            center={[47.1625, 19.5033]}
            zoom={7}
            style={{
                height: "100%",
                width: "100%",
            }}
            zoomControl
        >
            <TileLayer
                attribution=""
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapController
                selectedPartner={
                    selectedPartner
                }
                markerRefs={markerRefs}
            />

            {validPartners.map(
                (partner) => (
                    <Marker
                        key={partner.id}
                        position={[
                            partner.latitude,
                            partner.longitude,
                        ]}
                        icon={customIcon}
                        ref={(
                            ref: L.Marker | null
                        ) => {
                            markerRefs.current[
                                partner.id
                            ] = ref;
                        }}
                        eventHandlers={{
                            click: () => {
                                const marker =
                                    markerRefs.current[
                                    partner.id
                                    ];

                                if (!marker)
                                    return;

                                const map =
                                    (
                                        marker as any
                                    )
                                        ._map as L.Map;

                                /* previous popup close */
                                map.closePopup();

                                map.flyTo(
                                    [
                                        partner.latitude,
                                        partner.longitude,
                                    ],
                                    17,
                                    {
                                        duration: 0.6,
                                    }
                                );

                                map.once(
                                    "moveend",
                                    () => {
                                        requestAnimationFrame(
                                            () => {
                                                marker.openPopup();
                                            }
                                        );
                                    }
                                );
                            },
                        }}
                    >
                        <Popup
                            closeButton={
                                false
                            }
                            autoPan={
                                true
                            }
                        >
                            <div className="popup-card">
                                <div className="popup-title">
                                    {
                                        partner.name
                                    }
                                </div>

                                <div className="popup-address">
                                    <span className="popup-dot" />
                                    {
                                        partner.address
                                    }
                                </div>

                                {/* phone */}
                                {partner.phone && (
                                    <a
                                        className="popup-action popup-phone"
                                        href={`tel:${partner.phone.replace(
                                            /\s/g,
                                            ""
                                        )}`}
                                    >
                                        <div className="popup-icon">
                                            📞
                                        </div>

                                        <span>
                                            {
                                                partner.phone
                                            }
                                        </span>
                                    </a>
                                )}

                                {/* email */}
                                {partner.email && (
                                    <a
                                        className="popup-action popup-email"
                                        href={`mailto:${partner.email}`}
                                    >
                                        <div className="popup-icon">
                                            ✉️
                                        </div>

                                        <span>
                                            {
                                                partner.email
                                            }
                                        </span>
                                    </a>
                                )}

                                {/* route */}
                                <a
                                    className="popup-route"
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${partner.latitude},${partner.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Útvonalterv
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                )
            )}
        </MapContainer>
    );
}