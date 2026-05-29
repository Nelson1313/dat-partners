import {
    createClient,
} from "@supabase/supabase-js";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    Platform,
} from "react-native";

const supabaseUrl =
    "https://nebgtkogsnvlvoveiaxv.supabase.co";

const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lYmd0a29nc252bHZvdmVpYXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4ODU3MDYsImV4cCI6MjA5NTQ2MTcwNn0.krLCwlV9M-50RS7NrC001WosHegRXAA_Uc010M4jYPs";

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