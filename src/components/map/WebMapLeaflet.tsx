import {
    useEffect,
    useMemo,
    useRef,
} from "react";

import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    useMap,
} from "react-leaflet";

import {
    Mail,
    MapPin,
    Navigation,
    Phone,
} from "lucide-react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Partner = {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phone?: string;
    county?: string;
    email?: string;
    partner_type?: string;
};

type Props = {
    partners: Partner[];
    selectedPartner?: Partner | null;
};


function getMarkerIcon(
    type?: string
) {
    const color =
        type ===
            "Független"
            ? "#63D471"
            : type ===
                "Márkaszervíz"
                ? "#FFD400"
                : "#FF5C8A";

    return L.divIcon({
        className:
            "custom-marker",

        html: `
        <div
            style="
                width:44px;
                height:56px;
                display:flex;
                align-items:center;
                justify-content:center;
                filter:
                    drop-shadow(
                        0 6px 14px
                        rgba(0,0,0,.22)
                    );
            "
        >
            <svg
                width="34"
                height="46"
                viewBox="0 0 44 56"
                xmlns="http://www.w3.org/2000/svg"
                style="
                    overflow: visible;
                "
            >
                <path
                    d="
                    M22 2
                    C11.5 2 3 10.5 3 21
                    C3 35.5 22 53 22 53
                    C22 53 41 35.5 41 21
                    C41 10.5 32.5 2 22 2
                    Z
                    "
                    fill="${color}"
                    stroke="#09142B"
                    stroke-width="2.5"
                    stroke-linejoin="round"
                />

                <circle
                    cx="22"
                    cy="21"
                    r="8"
                    fill="white"
                />
            </svg>
        </div>
        `,

        iconSize: [44, 56],

        iconAnchor: [22, 54],

        popupAnchor: [0, -52],
    });
}

function MapController({
    selectedPartner,
    markerRefs,
}: {
    selectedPartner?: Partner | null;
    markerRefs: React.MutableRefObject<
        Record<
            string,
            L.Marker | null
        >
    >;
}) {
    const map =
        useMap();

    // sidebar click
    useEffect(() => {
        if (
            !selectedPartner
        )
            return;

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

        map.once(
            "moveend",
            () => {
                marker?.openPopup();
            }
        );
    }, [
        selectedPartner,
        map,
        markerRefs,
    ]);

    // zoom out popup close
    useEffect(() => {
        const handleZoom =
            () => {
                const zoom =
                    map.getZoom();

                if (
                    zoom < 17
                ) {
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

export default function WebMapLeaflet({
    partners,
    selectedPartner,
}: Props) {
    const markerRefs = useRef<
        Record<string, L.Marker | null>
    >({});

    const validPartners =
        useMemo(() => {
            return partners.filter(
                (partner) =>
                    partner.latitude &&
                    partner.longitude
            );
        }, [partners]);

    return (
        <MapContainer
            center={[47.1625, 19.5033]}
            zoom={7}
            style={{
                height: "100%",
                width: "100%",
            }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <MapController
                selectedPartner={
                    selectedPartner
                }
                markerRefs={
                    markerRefs
                }
            />

            {validPartners.map(
                (partner) => (
                    <Marker
                        key={
                            `${partner.id}-${partner.partner_type}`
                        }
                        position={[
                            partner.latitude,
                            partner.longitude,
                        ]}
                        icon={getMarkerIcon(
                            partner.partner_type
                        )}
                        ref={(ref) => {
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
                                    )._map as L.Map;

                                // bezárjuk az előző popupot
                                map.closePopup();

                                // zoom partnerre
                                map.flyTo(
                                    [
                                        partner.latitude,
                                        partner.longitude,
                                    ],
                                    17,
                                    {
                                        duration: 0.7,
                                    }
                                );

                                // popup nyitás zoom után
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
                                    {partner.name}
                                </div>

                                <div className="popup-address">
                                    <div className="popup-icon location">
                                        <MapPin
                                            size={18}
                                            color="#009DDF"
                                            strokeWidth={2.4}
                                        />
                                    </div>

                                    <span className="popup-address-text">
                                        {partner.address}
                                    </span>
                                </div>

                                {partner.phone && (
                                    <a
                                        className="popup-action popup-phone"
                                        href={`tel:${partner.phone.replace(
                                            /\s/g,
                                            ""
                                        )}`}
                                    >
                                        <div className="popup-icon phone">
                                            <Phone
                                                size={18}
                                                color="#EC4899"
                                                strokeWidth={2.4}
                                            />
                                        </div>

                                        <span>
                                            {partner.phone}
                                        </span>
                                    </a>
                                )}

                                {partner.email && (
                                    <a
                                        className="popup-action popup-email"
                                        href={`mailto:${partner.email}`}
                                    >
                                        <div className="popup-icon email">
                                            <Mail
                                                size={18}
                                                color="#8B5CF6"
                                                strokeWidth={2.4}
                                            />
                                        </div>

                                        <span>
                                            {partner.email}
                                        </span>
                                    </a>
                                )}

                                <a
                                    className="popup-route"
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${partner.latitude},${partner.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Navigation
                                        size={18}
                                        color="#fff"
                                        strokeWidth={2.4}
                                    />

                                    <span>
                                        Útvonalterv
                                    </span>
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                )
            )}
        </MapContainer>
    );
}