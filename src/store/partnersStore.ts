import {
    create,
} from "zustand";

import {
    supabase,
} from "../lib/supabase";

export type Partner = {
    id: string;

    name: string;

    address: string;

    phone: string;

    email: string;

    latitude: number;

    longitude: number;
};

type PartnerState = {
    partners: Partner[];

    loading: boolean;

    fetchPartners:
    () => Promise<void>;
};

export const
    usePartnersStore =
        create<PartnerState>()(
            (set) => ({
                partners: [],

                loading: false,

                fetchPartners:
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
                                    "partners"
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
                            "PARTNERS:",
                            data
                        );

                        console.log(
                            "PARTNERS ERROR:",
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
                            partners:
                                data ??
                                [],

                            loading:
                                false,
                        });
                    },
            })
        );