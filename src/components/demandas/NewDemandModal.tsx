"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";
import { MATERIAL_TYPES, MATERIAL_FORMATS, PRIORITIES } from "@/lib/constants";
import { createDemand } from "@/app/(app)/demandas/actions";

export type NewDemandOptions = { campaigns: { id: string; name: string }[] };

export function NewDemandModal({ options, onClose }: { options: NewDemandOptions; onClose: () => void }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await createDemand(new FormData(event.currentTarget));
      router.refresh();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 hub-animate-in" onMouseDown={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-hub-brown">Nova demanda</h2>
          <button type="button" onClick={onClose} aria-label="Fechar" className="text-hub-ink/40 hover:text-hub-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Título">
            <input name="title" required className={inputClass} placeholder="Ex.: Campanha Dia das Mães — Regional SP" />
          </Field>

          <Field label="Descrição">
            <textarea name="description" rows={3} className={inputClass} placeholder="Objetivo, público, contexto..." />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Tipo de material">
              <select name="materialType" required className={inputClass} defaultValue="Feed Instagram">
                {MATERIAL_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Prioridade">
              <select name="priority" className={inputClass} defaultValue="MEDIA">
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Departamento">
              <input name="department" className={inputClass} placeholder="Marketing" />
            </Field>
            <Field label="Prazo">
              <input name="dueDate" type="date" className={inputClass} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Campanha">
              <select name="campaignId" className={inputClass} defaultValue="">
                <option value="">Nenhuma</option>
                {options.campaigns.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Região">
              <input name="region" className={inputClass} placeholder="Regional SP" />
            </Field>
          </div>

          <Field label="Formatos necessários">
            <div className="grid grid-cols-2 gap-1.5">
              {MATERIAL_FORMATS.map((f) => (
                <label key={f} className="flex items-center gap-2 text-[12.5px] text-hub-ink/75">
                  <input type="checkbox" name="formats" value={f} className="h-3.5 w-3.5 rounded border-hub-line accent-hub-brown" />
                  {f}
                </label>
              ))}
            </div>
          </Field>

          <div className="mt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-full border border-hub-line px-4 py-2.5 text-[13px] font-semibold text-hub-ink/70 hover:bg-hub-paper">
              Cancelar
            </button>
            <button type="submit" disabled={submitting} className="flex items-center gap-2 rounded-full bg-hub-brown px-5 py-2.5 text-[13px] font-bold text-white hover:brightness-110 disabled:opacity-60">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Criar demanda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClass = "w-full rounded-lg border border-hub-line bg-hub-paper/40 px-3 py-2 text-[13.5px] text-hub-ink outline-none transition focus:border-hub-gold/60 focus:bg-white focus:ring-2 focus:ring-hub-gold/15";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11.5px] font-bold uppercase tracking-wide text-hub-ink/50">{label}</span>
      {children}
    </label>
  );
}
