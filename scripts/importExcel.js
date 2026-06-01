const XLSX = require("xlsx");
const fs = require("fs");
const axios = require("axios");

async function geocodeAddress(address) {
    try {
        const cleanedAddress = String(address)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\./g, "")
            .replace(/\bu\b/g, "utca")
            .replace(/\but\b/g, "ut")
            .replace(/\bter\b/g, "ter")
            .replace(/\bep\b/g, "epulet")
            .replace(/\s+/g, " ")
            .trim();

        const match = cleanedAddress.match(
            /^(\d{4})\s+([^,]+),\s*(.+)$/
        );

        let queryAddress = cleanedAddress;

        if (match) {
            const postalCode = match[1];
            const city = match[2];
            const street = match[3];

            queryAddress = `${street}, ${city}, ${postalCode}, Hungary`;
        }

        console.log("QUERY:", queryAddress);

        const query =
            encodeURIComponent(queryAddress);

        const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
            {
                headers: {
                    "User-Agent":
                        "AVILOO-javito-Locator/1.0",
                },
                timeout: 10000,
            }
        );

        const data = response.data;

        if (data.length > 0) {
            console.log(
                `✓ ${cleanedAddress}`
            );

            return {
                latitude: Number(data[0].lat),
                longitude: Number(data[0].lon),
            };
        }

        console.log(
            `✗ Nincs találat: ${cleanedAddress}`
        );

        return {
            latitude: null,
            longitude: null,
        };
    } catch (error) {
        console.log(
            `❌ Geocoding error: ${address}`
        );

        return {
            latitude: null,
            longitude: null,
        };
    }
}

async function run() {
    const workbook = XLSX.readFile(
        "./Aviloo_megrendelők.xlsx"
    );

    const sheetName =
        workbook.SheetNames[0];

    const sheet =
        workbook.Sheets[sheetName];

    const rows =
        XLSX.utils.sheet_to_json(sheet);

    const javitos = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        const name =
            row["Megrendeő neve"] ||
            row["Megrendelő neve"] ||
            "";

        if (!name || String(name).trim() === "") {
            continue;
        }

        const address =
            row["Címe"] || "";

        const geoAddress =
            row["GeoCode_ADD"] || "";

        const phone =
            row["Telefonszám"] || "";

        const email =
            row["E-mail"] || "";

        console.log(
            `Geocoding: ${geoAddress || "NINCS_GEO"
            }`
        );

        const coords =
            await geocodeAddress(
                geoAddress || address
            );

        javitos.push({
            id: String(i + 1),
            name,
            address,
            phone,
            email,
            latitude:
                coords.latitude,
            longitude:
                coords.longitude,
        });

        await new Promise((resolve) =>
            setTimeout(resolve, 1200)
        );
    }

    const output = `
export const javitos = ${JSON.stringify(
        javitos,
        null,
        2
    )};
`;

    fs.writeFileSync(
        "./data/javitos.ts",
        output
    );

    console.log(
        "javitos.ts sikeresen generálva!"
    );
}

run();