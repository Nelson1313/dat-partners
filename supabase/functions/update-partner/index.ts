import { serve } from "https://deno.land/std/http/server.ts";

import {
  createClient,
} from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin":
    "*",

  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",

  "Access-Control-Allow-Methods":
    "POST, OPTIONS",
};

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
      status: 200,
    });
  }

  // csak POST engedélyezett
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        error:
          "Method not allowed",
      }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type":
            "application/json",
        },
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

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        success:
          true,
        data,
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