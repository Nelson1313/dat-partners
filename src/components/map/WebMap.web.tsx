import { useEffect, useState } from "react";

type Props = {
    selectedPartnerId?: string | null;
};

export default function WebMap({
    selectedPartnerId,
}: Props) {
    const [MapComponent, setMapComponent] =
        useState<any>(null);

    useEffect(() => {
        async function load() {
            const module = await import(
                "../map/WebMapLeaflet"
            );

            setMapComponent(
                () => module.default
            );
        }

        load();
    }, []);

    if (!MapComponent) {
        return null;
    }

    return (
        <MapComponent
            selectedPartnerId={
                selectedPartnerId
            }
        />
    );
}