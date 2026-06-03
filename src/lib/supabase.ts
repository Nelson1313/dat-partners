import {
    createClient,
} from "@supabase/supabase-js";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    Platform,
} from "react-native";

const supabaseUrl =
    "https://nseopolqejpjftjutckn.supabase.co";

const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zZW9wb2xxZWpwamZ0anV0Y2tuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyOTYwMzUsImV4cCI6MjA5NTg3MjAzNX0.Zz6yR3WEnXQwneTkJEqcX0nHYC-_Xz4V7_W9sGwHAic";

export const supabase =
    createClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            auth: {
                storage:
                    Platform.OS ===
                        "web"
                        ? undefined
                        : AsyncStorage,

                autoRefreshToken:
                    true,

                persistSession:
                    true,

                detectSessionInUrl:
                    Platform.OS ===
                    "web",
            },
        }
    );