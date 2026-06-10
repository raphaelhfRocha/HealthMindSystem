// Claims emitidas pelo back-end (TokenService.GenerateToken).
// Os ClaimTypes do .NET são serializados no JWT com as URIs padrão abaixo.
const CLAIM_NAME_IDENTIFIER = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
const CLAIM_EMAIL = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
const CLAIM_ROLE = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

export interface TokenClaims {
    id: string;
    nome: string;
    email: string;
    role: string;
}

interface JwtPayload {
    [claim: string]: unknown;
}

export function decodeToken(token: string): JwtPayload | null {
    try {
        const payload = token.split(".")[1];
        if (!payload) return null;

        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const decoded = atob(base64);

        const json = decodeURIComponent(
            decoded
                .split("")
                .map(char => "%" + char.charCodeAt(0).toString(16).padStart(2, "0"))
                .join("")
        );

        return JSON.parse(json) as JwtPayload;
    } catch {
        return null;
    }
}

export function getClaimsFromToken(token: string): TokenClaims | null {
    const payload = decodeToken(token);
    if (!payload) return null;

    const asString = (value: unknown): string =>
        typeof value === "string" ? value : "";

    return {
        id: asString(payload[CLAIM_NAME_IDENTIFIER] ?? payload["nameid"] ?? payload["sub"]),
        nome: asString(payload["usuarioNome"]),
        email: asString(payload[CLAIM_EMAIL] ?? payload["email"]),
        role: asString(payload[CLAIM_ROLE] ?? payload["role"]),
    };
}
