import { create } from "zustand";

import { supabase } from "../lib/supabase";

export type Partner = {
    id: string;

    identifier?:
        string;

    name: string;

    address: string;

    phone: string;

    email: string;

    latitude: number;

    longitude: number;

    partner_type?:
        string; // átmenetileg marad

    partner_types?:
        string[];

    tax_number?:
        string;

    customer_id?:
        string;

    contact?:
        string;

    county?:
        string;

    postal_code?:
        string;

    city?:
        string;

    street?:
        string;
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

        const {
            data,
            error,
        } =
        await supabase
            .from(
                "partners"
            )
            .select("*");

        console.log(
            "PARTNERS:",
            data
        );

        console.log(
            "ERROR:",
            error
        );

        set({
            partners:
                data ?? [],
        });
    },
}));