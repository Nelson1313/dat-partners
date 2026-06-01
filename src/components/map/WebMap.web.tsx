import { useEffect, useState } from "react";

type Props = {
    selectedjavitoId?: string | null;
};

export default function WebMap({
    selectedjavitoId,
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
            selectedjavitoId={
                selectedjavitoId
            }
        />
    );
}