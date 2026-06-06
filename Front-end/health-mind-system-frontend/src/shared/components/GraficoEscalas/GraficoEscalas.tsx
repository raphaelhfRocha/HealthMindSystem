export default function GraficoEscalas({ seriesEscalas, pontos }: { seriesEscalas: Array<{ key: string; color: string }>; pontos: Array<{ label: string } & Record<string, number | string>> }) {
    const W = 600, H = 210;
    const PAD = { top: 16, right: 16, bottom: 36, left: 36 };
    const cW = W - PAD.left - PAD.right;
    const cH = H - PAD.top - PAD.bottom;

    const xPos = (i: number) => PAD.left + (pontos.length < 2 ? cW / 2 : (i / (pontos.length - 1)) * cW);
    const yPos = (v: number) => PAD.top + cH - ((v - 1) / 9) * cH;
    const gridVals = [1, 3, 5, 7, 10];

    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
            {gridVals.map(v => (
                <g key={v}>
                    <line x1={PAD.left} y1={yPos(v)} x2={W - PAD.right} y2={yPos(v)} stroke="#eef0f6" strokeWidth="1" />
                    <text x={PAD.left - 6} y={yPos(v)} textAnchor="end" dominantBaseline="middle" fontSize="9" fill="#bbb">{v}</text>
                </g>
            ))}
            {pontos.map((p, i) => (
                <text key={i} x={xPos(i)} y={H - PAD.bottom + 14} textAnchor="middle" fontSize="9" fill="#aaa">{p.label}</text>
            ))}
            {seriesEscalas.map(({ key, color }) => (
                <g key={key}>
                    {pontos.length > 1 && (
                        <polyline points={pontos.map((p, i) => `${xPos(i)},${yPos(Number(p[key]))}`).join(" ")} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                    )}
                    {pontos.map((p, i) => (
                        <g key={i}>
                            <circle cx={xPos(i)} cy={yPos(Number(p[key]))} r="5" fill="white" stroke={color} strokeWidth="2" />
                            <text x={xPos(i)} y={yPos(Number(p[key])) - 9} textAnchor="middle" fontSize="9" fontWeight="700" fill={color}>{p[key]}</text>
                        </g>
                    ))}
                </g>
            ))}
        </svg>
    );
}