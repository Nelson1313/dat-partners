import {
    create,
} from "zustand";

import {
    supabase,
} from "../lib/supabase";

export type javito = {
    id: string;

    name: string;

    address: string;

    phone: string;

    email: string;

    latitude: number;

    longitude: number;
};

type javitoState = {
    javitos: javito[];

    loading: boolean;

    fetchJavitos:
    () => Promise<void>;
};

export const
    useJavitosStore =
        create<javitoState>()(
            (set) => ({
                javitos: [],

                loading: false,

                fetchJavitos:
                    async () => {
                        set({
                            loading:
                                true,
                        });

                        const {
                            data,
                            error,
                        } =
                            await supabase
                                .from(
                                    "javitos"
                                )
                                .select(
                                    "*"
                                )
                                .order(
                                    "name",
                                    {
                                        ascending:
                                            true,
                                    }
                                );

                        console.log(
                            "javitos:",
                            data
                        );

                        console.log(
                            "javitos ERROR:",
                            error
                        );

                        if (
                            error
                        ) {
                            console.error(
                                error
                            );

                            set({
                                loading:
                                    false,
                            });

                            return;
                        }

                        set({
                            javitos:
                                data ??
                                [],

                            loading:
                                false,
                        });
                    },
            })
        );