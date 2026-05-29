import {
    create,
} from "zustand";

import {
    supabase,
} from "../lib/supabase";

type UserRole =
    | "admin"
    | "manager"
    | "viewer"
    | null;

type AuthState = {
    loading: boolean;

    isLoggedIn: boolean;

    role: UserRole;

    email:
    | string
    | null;

    checkSession:
    () => Promise<void>;

    logout:
    () => Promise<void>;
};

export const useAuthStore =
    create<AuthState>()(
        (set) => ({
            loading: true,

            isLoggedIn:
                false,

            role: null,

            email: null,

            checkSession:
                async () => {
                    const {
                        data,
                    } =
                        await supabase.auth.getSession();

                    const session =
                        data.session;

                    console.log(
                        "SESSION EMAIL:",
                        session?.user?.email
                    );

                    // nincs session
                    if (!session) {
                        set({
                            isLoggedIn:
                                false,

                            role:
                                null,

                            email:
                                null,

                            loading:
                                false,
                        });

                        return;
                    }

                    // role lekérés
                    const {
                        data:
                        profile,
                        error,
                    } =
                        await supabase
                            .from(
                                "profiles"
                            )
                            .select("*")
                            .eq(
                                "email",
                                session.user.email?.trim()
                            )
                            .maybeSingle();

                    console.log(
                        "PROFILE:",
                        profile
                    );

                    console.log(
                        "PROFILE ERROR:",
                        error
                    );

                    set({
                        isLoggedIn:
                            true,

                        role:
                            profile?.role ??
                            "viewer",

                        email:
                            session
                                .user
                                .email ??
                            null,

                        loading:
                            false,
                    });
                },

            logout:
                async () => {
                    await supabase
                        .auth
                        .signOut();

                    set({
                        isLoggedIn:
                            false,

                        role:
                            null,

                        email:
                            null,

                        loading:
                            false,
                    });

                    window.location.reload();
                },
        })
    );