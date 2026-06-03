import { serve } from "https://deno.land/std/http/server.ts";

import {
  createClient,
} from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin":
    "*",

  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // preflight
  if (
    req.method ===
    "OPTIONS"
  ) {
    return new Response(
      "ok",
      {
        headers:
          corsHeaders,
      }
    );
  }

  try {
    const body =
      await req.json();

    const {
  identifier,
  name,
  address,
  phone,
  email,
  partner_type,
  tax_number,
  customer_id,
  contact,
  postal_code,
  city,
  street,
  county,
} = body;

    function cleanAddress(
      address: string
    ) {
      const cleaned =
        String(address)
          .normalize(
            "NFD"
          )
          .replace(
            /[\u0300-\u036f]/g,
            ""
          )
          .replace(
            /\./g,
            ""
          )
          .replace(
            /\bu\b/g,
            "utca"
          )
          .replace(
            /\but\b/g,
            "ut"
          )
          .replace(
            /\bter\b/g,
            "ter"
          )
          .replace(
            /\bep\b/g,
            "epulet"
          )
          .replace(
            /\s+/g,
            " "
          )
          .trim();

      const match =
        cleaned.match(
          /^(\d{4})\s+([^,]+),\s*(.+)$/
        );

      if (
        match
      ) {
        const postalCode =
          match[1];

        const city =
          match[2];

        const street =
          match[3];

        return `${street}, ${city}, ${postalCode}, Hungary`;
      }

      return cleaned;
    }

    const query =
      encodeURIComponent(
        cleanAddress(
          address
        )
      );

    const geo =
      await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
        {
          headers:
          {
            "User-Agent":
              "AVILOO-partner-Locator/1.0",
          },
        }
      );

    const data =
      await geo.json();

    const latitude =
      data?.[0]
        ?.lat
        ? Number(
          data[0]
            .lat
        )
        : null;

    const longitude =
      data?.[0]
        ?.lon
        ? Number(
          data[0]
            .lon
        )
        : null;

    console.log(
  "SUPABASE URL:",
  Deno.env.get(
    "SUPABASE_URL"
  )
);

const supabase =
  createClient(
    Deno.env.get(
      "SUPABASE_URL"
    )!,
    Deno.env.get(
      "SUPABASE_SERVICE_ROLE_KEY"
    )!
  );

    const {
  data,
  error,
} =
  await supabase
    .from(
      "partners"
    )
    .insert({
  identifier,

  name,

  address,

  phone,

  email,

  latitude,

  longitude,

  partner_type,

  tax_number,

  customer_id,

  contact,

  postal_code,

  city,

  street,
})
    .select();

console.log(
  "INSERTED DATA:",
  data
);

console.log(
  "INSERT ERROR:",
  error
);

if (
  error
) {
  throw error;
}

if (
  !data ||
  data.length === 0
) {
  throw new Error(
    "Insert failed"
  );
}

    return new Response(
      JSON.stringify({
        success:
          true,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type":
            "application/json",
        },
      }
    );
  } catch (
    error
  ) {
    return new Response(
      JSON.stringify({
        error:
          String(
            error
          ),
      }),
      {
        status:
          500,

        headers: {
          ...corsHeaders,
          "Content-Type":
            "application/json",
        },
      }
    );
  }
});