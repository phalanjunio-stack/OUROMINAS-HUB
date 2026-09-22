import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  deltaValue,
  deltaUp,
  deltaSuffix = "vs. mês anterior",
}: {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  deltaValue: number;
  deltaUp: boolean;
  deltaSuffix?: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-hub-line bg-white p-5 shadow-sm shadow-hub-brown/[0.03]">
      <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl" style={{ background: iconBg, color: iconColor }}>
        <Icon className="h-[22px] w-[22px]" strokeWidth={1.8} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[13px] text-hub-ink/60">{label}</p>
        <div className="mt-0.5 flex items-baseline gap-2">
          <span className="font-display text-[26px] font-semibold leading-none text-hub-ink">{value}</span>
          <span className={`flex items-center gap-0.5 text-[12px] font-bold ${deltaUp ? "text-hub-green" : "text-hub-red"}`}>
            {deltaUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {deltaValue}%
          </span>
        </div>
        <p className="mt-0.5 text-[11px] text-hub-ink/40">{deltaSuffix}</p>
      </div>
    </div>
  );
}
