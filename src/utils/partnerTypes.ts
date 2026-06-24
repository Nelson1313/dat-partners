export function getPrimaryPartnerType(
    partnerTypes?: string[]
) {
    if (
        partnerTypes?.includes("Roncsbörze")
    )
        return "Roncsbörze";

    if (
        partnerTypes?.includes(
            "Javítói börze"
        )
    )
        return "Javítói börze";

    if (
        partnerTypes?.includes(
            "Értékelő"
        )
    )
        return "Értékelő";

    if (
        partnerTypes?.includes(
            "Márkaszervíz"
        )
    )
        return "Márkaszervíz";

    return "Független";
}

export function getPartnerColor(
    partnerTypes?: string[]
) {
    switch (
        getPrimaryPartnerType(
            partnerTypes
        )
    ) {
        case "Roncsbörze":
            return "#8B5CF6";

        case "Javítói börze":
            return "#FF8A00";

        case "Értékelő":
            return "#FF5C8A";

        case "Márkaszervíz":
            return "#FFD400";

        default:
            return "#63D471";
    }
}