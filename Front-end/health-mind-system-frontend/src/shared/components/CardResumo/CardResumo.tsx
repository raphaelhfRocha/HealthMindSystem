export default function CardResumo({
    label,
    valor,
    cor,
    sub,
}: {
    label: string;
    valor: string | number;
    cor: string;
    sub?: string;
}) {
    return (
        <div
            style={{
                background: "white",
                borderRadius: "14px",
                padding: "20px 22px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                flex: 1,
                minWidth: "140px",
            }}
        >
            <div
                style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#aaa",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "8px",
                }}
            >
                {label}
            </div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: cor }}>{valor}</div>
            {sub && <div style={{ fontSize: "11px", color: "#bbb", marginTop: "4px" }}>{sub}</div>}
        </div>
    );
}