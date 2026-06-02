// Debug helpers (optional). Not used in UI.
export function safeName(value: unknown) {
    if (!value) return "—";
    if (typeof value === "string") return value.trim() || "—";
    // If api returns { nome: string }
    if (typeof value === "object" && value && "nome" in (value as any)) {
        const nome = (value as any).nome;
        return typeof nome === "string" && nome.trim() ? nome : "—";
    }
    return "—";
}

