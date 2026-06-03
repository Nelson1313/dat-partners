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

console.log(
  "VERSION 2 UPDATE"
);
serve(async (req) => {
  // CORS preflight
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
    const {
  id,
  name,
  address,
  phone,
  email,
  partner_type,
  tax_number,
  customer_id,
  contact,
  county,
} =
  await req.json();

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
    .update({
  name,
  address,
  phone,
  email,
  partner_type,
  tax_number,
  customer_id,
  contact,
  county,
})
    .eq(
      "id",
      id
    )
    .select();

console.log(
  "UPDATED DATA:",
  data
);

console.log(
  "UPDATE ERROR:",
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
    "No rows updated"
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
    console.error(
      error
    );

    return new Response(
      JSON.stringify({
        error:
          String(error),
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