"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Folder, Download, ExternalLink, Copy, Video, Check } from "lucide-react";
import { MEDIA_CATEGORIES, MEDIA_TYPES } from "@/lib/constants";
import { parseList } from "@/lib/json";

export type GalleryFile = {
  id: string;
  name: string;
  category: string;
  type: string;
  url: string;
  sizeBytes: number | null;
  width: number | null;
  height: number | null;
  tags: string;
  status: string;
  version: string;
  reuseCount: number;
  createdAt: Date;
  campaign: { name: string } | null;
  uploadedBy: { name: string } | null;
};

function formatBytes(bytes: number | null): string {
  if (!bytes) return "—";
  const mb = bytes / 1_000_000;
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1000)} KB`;
}

export function GalleryGrid({ files }: { files: GalleryFile[] }) {
  const [category, setCategory] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(files[0]?.id ?? null);
  const [copied, setCopied] = useState(false);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const f of files) counts.set(f.category, (counts.get(f.category) ?? 0) + 1);
    return counts;
  }, [files]);

  const typeCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const f of files) counts.set(f.type, (counts.get(f.type) ?? 0) + 1);
    return counts;
  }, [files]);

  const filtered = files.filter((f) => (!category || f.category === category) && (!type || f.type === type));
  const selected = files.find((f) => f.id === selectedId) ?? filtered[0] ?? null;

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6 p-6 lg:p-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-hub-brown">Galeria &amp; Arquivos</h1>
        <p className="text-[13px] text-hub-ink/55">Organize, compartilhe e encontre tudo em um só lugar.</p>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-hub-line bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8f0fe] text-[#1a73e8]">
            <Folder className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-[13px] font-bold text-hub-ink">Seus arquivos estão organizados</p>
            <p className="text-[11.5px] text-hub-ink/50">{files.length} arquivos catalogados nesta central</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-hub-green/10 px-3 py-1.5 text-[11.5px] font-bold text-hub-green">
          <Check className="h-3.5 w-3.5" /> Sincronizado
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {MEDIA_CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory((current) => (current === c.value ? null : c.value))}
            className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
              category === c.value ? "border-hub-gold bg-hub-gold/[0.08]" : "border-hub-line bg-white hover:border-hub-gold/40"
            }`}
          >
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-hub-paper text-hub-caramel">
              <Folder className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[12.5px] font-bold text-hub-ink">{c.label}</p>
              <p className="text-[11px] text-hub-ink/45">{categoryCounts.get(c.value) ?? 0} arquivos</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <FilterPill active={!type} label={`Todos (${files.length})`} onClick={() => setType(null)} />
            {MEDIA_TYPES.map((t) => (
              <FilterPill key={t.value} active={type === t.value} label={`${t.label} (${typeCounts.get(t.value) ?? 0})`} onClick={() => setType((c) => (c === t.value ? null : t.value))} />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 xl:grid-cols-4">
            {filtered.map((file) => (
              <button
                key={file.id}
                onClick={() => setSelectedId(file.id)}
                className={`group overflow-hidden rounded-xl border bg-white text-left transition ${selectedId === file.id ? "border-hub-gold ring-2 ring-hub-gold/20" : "border-hub-line hover:border-hub-gold/40"}`}
              >
                <div className="relative h-28 w-full bg-hub-paper">
                  <Image src={file.url} alt={file.name} fill sizes="200px" className="object-cover transition group-hover:scale-105" />
                  {file.type === "VIDEO" && (
                    <span className="absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white">
                      <Video className="h-3 w-3" />
                    </span>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="truncate text-[12px] font-semibold text-hub-ink">{file.name}</p>
                  <p className="text-[10.5px] text-hub-ink/45">{file.type} · {formatBytes(file.sizeBytes)}</p>
                </div>
              </button>
            ))}
            {filtered.length === 0 && <p className="col-span-full py-10 text-center text-[13px] text-hub-ink/40">Nenhum arquivo nesse filtro.</p>}
          </div>
        </div>

        {selected && (
          <aside className="h-fit rounded-2xl border border-hub-line bg-white p-4">
            <div className="relative mb-3 h-44 w-full overflow-hidden rounded-lg bg-hub-paper">
              <Image src={selected.url} alt={selected.name} fill sizes="320px" className="object-cover" />
            </div>
            <p className="text-[14px] font-bold text-hub-ink">{selected.name}</p>
            <p className="mb-3 text-[11.5px] text-hub-ink/45">
              {formatBytes(selected.sizeBytes)}
              {selected.width && selected.height ? ` · ${selected.width}x${selected.height} px` : ""}
            </p>

            <dl className="mb-3 flex flex-col gap-2 text-[12px]">
              {selected.campaign && <DetailRow label="Campanha" value={selected.campaign.name} />}
              <DetailRow label="Formato" value={`${selected.type} (${selected.url.split(".").pop()?.toUpperCase()})`} />
              <DetailRow label="Versão" value={selected.version} />
              <DetailRow label="Reutilizado" value={`${selected.reuseCount}x`} />
            </dl>

            {parseList(selected.tags).length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1.5">
                {parseList(selected.tags).map((tag) => (
                  <span key={tag} className="rounded-full bg-hub-paper px-2 py-0.5 text-[10.5px] text-hub-ink/60">{tag}</span>
                ))}
              </div>
            )}

            <div className="mb-3 flex items-center gap-1.5 rounded-lg bg-hub-green/10 px-3 py-2 text-[11.5px] font-bold text-hub-green">
              <Check className="h-3.5 w-3.5" /> Aprovado
            </div>

            <div className="flex flex-col gap-2">
              <a href={selected.url} download className="flex items-center justify-center gap-2 rounded-full bg-hub-brown py-2.5 text-[12.5px] font-bold text-white hover:brightness-110">
                <Download className="h-4 w-4" /> Baixar
              </a>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.origin + selected.url);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-full border border-hub-line py-2.5 text-[12px] font-semibold text-hub-ink/70 hover:bg-hub-paper"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-hub-green" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copiado" : "Copiar link"}
                </button>
                <span className="flex items-center justify-center gap-1.5 rounded-full border border-hub-line py-2.5 text-[12px] font-semibold text-hub-ink/35" title="Integração com o Drive ainda não conectada">
                  <ExternalLink className="h-3.5 w-3.5" /> Drive
                </span>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function FilterPill({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition ${active ? "bg-hub-brown text-white" : "border border-hub-line bg-white text-hub-ink/60 hover:border-hub-gold/40"}`}
    >
      {label}
    </button>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-hub-ink/45">{label}</dt>
      <dd className="font-semibold text-hub-ink">{value}</dd>
    </div>
  );
}
