"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { DEMAND_STATUSES } from "@/lib/constants";
import { moveDemand } from "@/app/(app)/demandas/actions";
import { DemandCard } from "./DemandCard";
import { NewDemandModal, type NewDemandOptions } from "./NewDemandModal";
import { DemandDetailDrawer } from "./DemandDetailDrawer";
import type { DemandCardData } from "./types";

export function KanbanBoard({ demands, options }: { demands: DemandCardData[]; options: NewDemandOptions }) {
  const router = useRouter();
  const [items, setItems] = useState(demands);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null);
  const [openDemandId, setOpenDemandId] = useState<string | null>(null);
  const [newDemandOpen, setNewDemandOpen] = useState(false);
  const [, startTransition] = useTransition();

  const columns = useMemo(() => {
    const grouped = new Map<string, DemandCardData[]>();
    for (const status of DEMAND_STATUSES) grouped.set(status.value, []);
    for (const demand of items) grouped.get(demand.status)?.push(demand);
    for (const list of grouped.values()) list.sort((a, b) => a.position - b.position);
    return grouped;
  }, [items]);

  const handleDrop = (status: string) => {
    setDragOverStatus(null);
    const id = draggingId;
    setDraggingId(null);
    if (!id) return;
    const demand = items.find((d) => d.id === id);
    if (!demand || demand.status === status) return;

    const targetCount = columns.get(status)?.length ?? 0;
    setItems((prev) => prev.map((d) => (d.id === id ? { ...d, status, position: targetCount } : d)));
    startTransition(() => {
      moveDemand(id, status, targetCount).then(() => router.refresh());
    });
  };

  const openDemand = items.find((d) => d.id === openDemandId) ?? null;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-6 pb-4 pt-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-hub-brown">Central de Demandas</h1>
          <p className="text-[13px] text-hub-ink/55">Arraste os cartões entre as colunas para atualizar o status.</p>
        </div>
        <button
          type="button"
          onClick={() => setNewDemandOpen(true)}
          className="flex items-center gap-2 rounded-full bg-hub-brown px-4 py-2.5 text-[13px] font-bold text-white transition hover:brightness-110"
        >
          <Plus className="h-4 w-4" strokeWidth={2.2} /> Nova demanda
        </button>
      </div>

      <div className="flex flex-1 gap-4 overflow-x-auto px-6 pb-6">
        {DEMAND_STATUSES.map((status) => {
          const columnItems = columns.get(status.value) ?? [];
          return (
            <div
              key={status.value}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverStatus(status.value);
              }}
              onDragLeave={() => setDragOverStatus((s) => (s === status.value ? null : s))}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(status.value);
              }}
              className={`flex w-[268px] flex-none flex-col rounded-2xl border bg-hub-paper/50 transition ${
                dragOverStatus === status.value ? "border-hub-gold bg-hub-gold/[0.06]" : "border-hub-line"
              }`}
            >
              <div className="flex items-center justify-between px-3.5 pt-3.5">
                <span className="flex items-center gap-2 text-[12px] font-bold text-hub-ink/75">
                  <span className="h-2 w-2 rounded-full" style={{ background: status.color }} />
                  {status.label}
                </span>
                <span className="rounded-full bg-white px-2 py-0.5 text-[10.5px] font-bold text-hub-ink/50">{columnItems.length}</span>
              </div>
              <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-3.5">
                {columnItems.map((demand) => (
                  <DemandCard
                    key={demand.id}
                    demand={demand}
                    dragging={draggingId === demand.id}
                    onDragStart={(e) => {
                      setDraggingId(demand.id);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onOpen={() => setOpenDemandId(demand.id)}
                  />
                ))}
                {columnItems.length === 0 && <p className="py-6 text-center text-[11px] text-hub-ink/30">Nenhuma demanda aqui.</p>}
              </div>
            </div>
          );
        })}
      </div>

      {newDemandOpen && <NewDemandModal options={options} onClose={() => setNewDemandOpen(false)} />}
      {openDemand && <DemandDetailDrawer demandId={openDemand.id} summary={openDemand} onClose={() => setOpenDemandId(null)} />}
    </div>
  );
}
