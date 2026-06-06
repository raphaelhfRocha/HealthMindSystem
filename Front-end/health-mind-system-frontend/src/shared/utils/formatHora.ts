export const formatHora = (hora?: string): string =>  {
    if (!hora) return "—";
    const match = /^(\d{1,2}):(\d{2})/.exec(hora.trim());
    if (!match) return hora;
    return `${match[1].padStart(2, "0")}:${match[2]}`;
}