import { CalendarClock, MessageSquare, Paperclip, ListChecks } from "lucide-react";
import { priorityMeta, initials } from "@/lib/constants";
import type { DemandCardData } from "./types";

function formatDueDate(date: Date | null): { label: string; overdue: boolean } | null {
  if (!date) return null;
  const diffDays = Math.ceil((date.getTime() - Date.now()) / 86_400_000);
  if (diffDays < 0) return { label: `atrasado ${Math.abs(diffDays)}d`, overdue: true };
  if (diffDays === 0) return { label: "vence hoje", overdue: true };
  if (diffDays === 1) return { label: "vence amanhã", overdue: false };
  return { label: `${diffDays}d restantes`, overdue: false };
}

export function DemandCard({
  demand,
  onOpen,
  onDragStart,
  dragging,
}: {
  demand: DemandCardData;
  onOpen: () => void;
  onDragStart: (event: React.DragEvent) => void;
  dragging: boolean;
}) {
  const priority = priorityMeta(demand.priority);
  const due = formatDueDate(demand.dueDate);

  return (
    <button
      type="button"
      draggable
      onDragStart={onDragStart}
      onClick={onOpen}
      className={`group flex w-full flex-col gap-2.5 rounded-xl border border-hub-line bg-white p-3.5 text-left shadow-sm shadow-hub-brown/[0.02] transition hover:-translate-y-0.5 hover:border-hub-gold/40 hover:shadow-md ${dragging ? "opacity-40" : ""}`}
      style={{ borderLeftWidth: 3, borderLeftColor: demand.campaign?.color ?? "var(--hub-line)" }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10.5px] font-bold text-hub-ink/40">{demand.code}</span>
        <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: `${priority.color}1a`, color: priority.color }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: priority.color }} />
          {priority.label}
        </span>
      </div>

      <p className="text-[13.5px] font-semibold leading-snug text-hub-ink">{demand.title}</p>
      <p className="text-[11px] text-hub-ink/45">{demand.materialType}</p>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5 text-hub-ink/40">
          {demand._count.checklist > 0 && (
            <span className="flex items-center gap-1 text-[10.5px]">
              <ListChecks className="h-3.5 w-3.5" strokeWidth={1.8} /> {demand._count.checklist}
            </span>
          )}
          {demand._count.comments > 0 && (
            <span className="flex items-center gap-1 text-[10.5px]">
              <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.8} /> {demand._count.comments}
            </span>
          )}
          {demand._count.versions > 0 && (
            <span className="flex items-center gap-1 text-[10.5px]">
              <Paperclip className="h-3.5 w-3.5" strokeWidth={1.8} /> {demand._count.versions}
            </span>
          )}
        </div>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-hub-paper text-[10px] font-bold text-hub-brown" title={demand.assignee?.name ?? demand.requester.name}>
          {initials(demand.assignee?.name ?? demand.requester.name)}
        </span>
      </div>

      {due && (
        <span className={`flex items-center gap-1 text-[10.5px] font-medium ${due.overdue ? "text-hub-red" : "text-hub-ink/45"}`}>
          <CalendarClock className="h-3.5 w-3.5" strokeWidth={1.8} /> {due.label}
        </span>
      )}
    </button>
  );
}
