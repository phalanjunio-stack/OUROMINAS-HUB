export type PerformancePoint = { label: string; publicacoes: number; engajamento: number };

export function PerformanceChart({ data }: { data: PerformancePoint[] }) {
  const maxValue = Math.max(1, ...data.flatMap((d) => [d.publicacoes, d.engajamento]));
  const chartTop = Math.ceil(maxValue / 10) * 10 || 10;
  const steps = 4;
  const width = 560;
  const height = 220;
  const paddingLeft = 30;
  const paddingBottom = 26;
  const plotWidth = width - paddingLeft - 8;
  const plotHeight = height - paddingBottom - 10;
  const groupWidth = plotWidth / data.length;
  const barWidth = Math.min(16, groupWidth * 0.28);

  const yFor = (value: number) => plotHeight - (value / chartTop) * plotHeight + 6;

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Gráfico de desempenho de publicações">
        {Array.from({ length: steps + 1 }, (_, i) => {
          const value = (chartTop / steps) * i;
          const y = yFor(value);
          return (
            <g key={i}>
              <line x1={paddingLeft} x2={width - 4} y1={y} y2={y} stroke="rgba(66,19,13,0.08)" strokeWidth={1} />
              <text x={0} y={y + 3} fontSize={10} fill="rgba(44,24,16,0.45)">
                {Math.round(value)}
              </text>
            </g>
          );
        })}

        {data.map((point, i) => {
          const groupX = paddingLeft + i * groupWidth + groupWidth / 2;
          const barGap = 4;
          const x1 = groupX - barWidth - barGap / 2;
          const x2 = groupX + barGap / 2;
          const y1 = yFor(point.publicacoes);
          const y2 = yFor(point.engajamento);
          return (
            <g key={point.label}>
              <rect x={x1} y={y1} width={barWidth} height={Math.max(0, plotHeight + 6 - y1)} rx={3} fill="var(--hub-brown)" />
              <rect x={x2} y={y2} width={barWidth} height={Math.max(0, plotHeight + 6 - y2)} rx={3} fill="var(--hub-gold-light)" />
              <text x={groupX} y={height - 6} fontSize={11} textAnchor="middle" fill="rgba(44,24,16,0.55)">
                {point.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex items-center gap-5 text-[12px] text-hub-ink/60">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-hub-brown" /> Publicações
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-hub-gold-light" /> Engajamento (mil)
        </span>
      </div>
    </div>
  );
}
