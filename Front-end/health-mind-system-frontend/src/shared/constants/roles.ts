// Valores correspondem ao StatusCargoEnum.ToString() do back-end,
// que é o que vem na claim de role do JWT.
export const ROLES = {
    PSICOLOGO: "StsPsicologo",
    RECEPCIONISTA: "StsRecepcionista",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
