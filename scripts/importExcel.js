const XLSX = require("xlsx");
const axios = require("axios");
const path = require("path");

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    "https://nseopolqejpjftjutckn.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zZW9wb2xxZWpwamZ0anV0Y2tuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDI5NjAzNSwiZXhwIjoyMDk1ODcyMDM1fQ.6ZjRaBSpZd4iaS0X9j_Wa5NqstLEIIRmRPyeh_IS7WA"
);

function delay(ms) {
    return new Promise((resolve) =>
        setTimeout(resolve, ms)
    );
}

async function search(query) {
    const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
            params: {
                q: query,
                format: "json",
                limit: 1,
                countrycodes: "hu",
            },
            headers: {
                "User-Agent":
                    "DAT-partners/1.0",
            },
            timeout: 10000,
        }
    );

    await delay(1200);

    return response.data;
}

async function geocodeAddress(address) {
    try {
        const cleaned = String(
            address
        )
            .replace(/\s+/g, " ")
            .trim();

        // ==================
        // TRY 1
        // teljes cím
        // ==================

        let data =
            await search(cleaned);

        if (data.length > 0) {
            return {
                latitude: Number(
                    data[0].lat
                ),
                longitude: Number(
                    data[0].lon
                ),
                tryLevel: 1,
            };
        }

        // ==================
        // TRY 2
        // házszám nélkül
        // ==================

        const noHouse =
            cleaned.replace(
                /\d+\/?\d*.*$/,
                ""
            );

        data =
            await search(noHouse);

        if (data.length > 0) {
            return {
                latitude: Number(
                    data[0].lat
                ),
                longitude: Number(
                    data[0].lon
                ),
                tryLevel: 2,
            };
        }

        // ==================
        // TRY 3
        // csak város
        // ==================

        const cityOnly =
            cleaned.match(
                /^(\d{4})\s+([^,]+)/
            );

        if (cityOnly) {
            const query = `${cityOnly[1]} ${cityOnly[2]}`;

            data =
                await search(query);

            if (
                data.length > 0
            ) {
                return {
                    latitude:
                        Number(
                            data[0]
                                .lat
                        ),
                    longitude:
                        Number(
                            data[0]
                                .lon
                        ),
                    tryLevel: 3,
                };
            }
        }

        return {
            latitude: null,
            longitude: null,
            tryLevel: 0,
        };
    } catch (error) {
        console.log(
            "GEOCODE ERROR:",
            error.message
        );

        return {
            latitude: null,
            longitude: null,
            tryLevel: 0,
        };
    }
}

async function run() {
    const workbook =
        XLSX.readFile(
            path.join(
                __dirname,
                "../CarValue kereskedők_frissített lista.xlsx"
            )
        );

    const sheet =
        workbook.Sheets[
        workbook
            .SheetNames[0]
        ];

    const rows =
        XLSX.utils.sheet_to_json(
            sheet
        );

    const failedGeocodes =
        [];

    const secondTrySuccess =
        [];

    const thirdTrySuccess =
        [];

    for (
        let i = 0;
        i < rows.length;
        i++
    ) {
        const row =
            rows[i];

        const identifier =
            row[
            "Azonosító"
            ] || "";

        const name =
            row[
            "Cégnév"
            ] || "";

        if (!name) {
            continue;
        }

        const postal_code =
            row[
            "Irányítószám"
            ] || "";

        const city =
            row[
            "Város"
            ] || "";

        const street =
            row[
            "Utca"
            ] || "";

        const county =
            row["Megye"] || "";

        const address =
            `${postal_code} ${city}, ${street}`.trim();

        const tax_number =
            row[
            "Adószám"
            ] || "";

        const contact =
            row[
            "Kapcsolat"
            ] || "";

        const phone =
            row["Tel"] || "";

        const email =
            row["Mail"] || "";

        const customer_id =
            row[
            "Ügyfélszám"
            ] || "";

        const partner_type =
            row[
            "Partner típusa"
            ] ||
            "Független";

        console.log(
            `Geocoding: ${name}`
        );

        const coords =
            await geocodeAddress(
                address
            );

        if (
            coords.tryLevel ===
            2
        ) {
            secondTrySuccess.push(
                {
                    name,
                    address,
                }
            );
        }

        if (
            coords.tryLevel ===
            3
        ) {
            thirdTrySuccess.push(
                {
                    name,
                    address,
                }
            );
        }

        if (
            coords.tryLevel ===
            0
        ) {
            failedGeocodes.push(
                {
                    name,
                    address,
                }
            );

            console.log(
                `⚠️ ${name} (NO GEOCODE)`
            );
        } else {
            console.log(
                `✓ ${name} (TRY ${coords.tryLevel})`
            );
        }

        const { error } =
            await supabase
                .from(
                    "partners"
                )
                .insert({
                    identifier,
                    name,
                    county,
                    address,
                    phone,
                    email,

                    latitude:
                        coords.latitude ??
                        47.4979,

                    longitude:
                        coords.longitude ??
                        19.0402,

                    partner_type,
                    tax_number,
                    customer_id,
                    contact,
                    postal_code,
                    city,
                    street,
                });

        if (error) {
            console.log(
                "\nINSERT ERROR:"
            );

            console.log(
                name
            );

            console.log(
                address
            );

            console.log(
                error
            );
        }
    }

    console.log(
        "\n========================"
    );

    console.log(
        "IMPORT KÉSZ"
    );

    console.log(
        "========================\n"
    );

    console.log(
        "⚠️ 2. TRY-RA SIKERÜLT:\n"
    );

    if (
        secondTrySuccess.length ===
        0
    ) {
        console.log(
            "Nincs ilyen.\n"
        );
    } else {
        secondTrySuccess.forEach(
            (
                item,
                index
            ) => {
                console.log(
                    `${index + 1}. ${item.name}`
                );

                console.log(
                    `   ${item.address}\n`
                );
            }
        );
    }

    console.log(
        "\n⚠️ 3. TRY-RA SIKERÜLT:\n"
    );

    if (
        thirdTrySuccess.length ===
        0
    ) {
        console.log(
            "Nincs ilyen.\n"
        );
    } else {
        thirdTrySuccess.forEach(
            (
                item,
                index
            ) => {
                console.log(
                    `${index + 1}. ${item.name}`
                );

                console.log(
                    `   ${item.address}\n`
                );
            }
        );
    }

    console.log(
        "\n❌ NEM GEOCODOLT:\n"
    );

    if (
        failedGeocodes.length ===
        0
    ) {
        console.log(
            "✅ Minden partner geocodolva lett."
        );
    } else {
        failedGeocodes.forEach(
            (
                item,
                index
            ) => {
                console.log(
                    `${index + 1}. ${item.name}`
                );

                console.log(
                    `   ${item.address}\n`
                );
            }
        );

        console.log(
            `Összesen: ${failedGeocodes.length} db`
        );
    }
}

run();