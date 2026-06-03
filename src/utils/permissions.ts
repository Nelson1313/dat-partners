export const isAdmin = (
    role?: string | null
) =>
    role === "admin";

export const isUser = (
    role?: string | null
) =>
    role === "user";

export const canEditPartners = (
    role?: string | null
) =>
    role === "admin";

export const canDeletePartners = (
    role?: string | null
) =>
    role === "admin";