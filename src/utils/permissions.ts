export const isAdmin = (
    role?: string | null
) =>
    role === "admin";

export const isUser = (
    role?: string | null
) =>
    role === "user";

export const canEditjavitos = (
    role?: string | null
) =>
    role === "admin";

export const canDeletejavitos = (
    role?: string | null
) =>
    role === "admin";