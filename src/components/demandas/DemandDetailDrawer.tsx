"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Loader2, Send, ThumbsUp, ThumbsDown, MessageCircleWarning } from "lucide-react";
import { getDemandDetail, toggleChecklistItem, addDemandComment, decideApproval } from "@/app/(app)/demandas/actions";
import { statusMeta, priorityMeta, initials, formatRelativeDate } from "@/lib/constants";
import { parseList } from "@/lib/json";
import type { DemandCardData } from "./types";

type DemandDetail = Awaited<ReturnType<typeof getDemandDetail>>;

export function DemandDetailDrawer({ demandId, summary, onClose }: { demandId: string; summary: DemandCardData; onClose: () => void }) {
  const router = useRouter();
  const [detail, setDetail] = useState<DemandDetail | null>(null);
  const [commentText, setCommentText] = useState("");
  const [, startTransition] = useTransition();

  useEffect(() => {
    let active = true;
    getDemandDetail(demandId).then((data) => {
      if (active) setDetail(data);
    });
    return () => {
      active = false;
    };
  }, [demandId]);

  const status = statusMeta(summary.status);
  const priority = priorityMeta(summary.priority);
  const pendingApproval = detail?.approvals.find((a) => a.status === "PENDENTE");

  const refresh = () => getDemandDetail(demandId).then(setDetail);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/45 hub-animate-in" onMouseDown={onClose}>
      <div className="flex h-full w-full max-w-[560px] flex-col bg-white shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between border-b border-hub-line px-6 py-5">
          <div>
            <p className="font-mono text-[11px] font-bold text-hub-ink/40">{summary.code}</p>
            <h2 className="font-display text-2xl font-semibold text-hub-brown">{summary.title}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge color={status.color}>{status.label}</Badge>
              <Badge color={priority.color}>{priority.label}</Badge>
              {detail?.campaign && <Badge color={detail.campaign.color ?? "#a8632f"}>{detail.campaign.name}</Badge>}
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar" className="text-hub-ink/40 hover:text-hub-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!detail ? (
          <div className="flex flex-1 items-center justify-center text-hub-ink/40">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {detail.description && <p className="mb-5 text-[13.5px] leading-relaxed text-hub-ink/70">{detail.description}</p>}

            <dl className="mb-6 grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-hub-line bg-hub-paper/40 p-4 text-[12.5px]">
              <Info label="Solicitante" value={detail.requester.name} />
              <Info label="Responsável" value={detail.assignee?.name ?? "Não atribuído"} />
              <Info label="Tipo de material" value={detail.materialType} />
              <Info label="Departamento" value={detail.department ?? "—"} />
              <Info label="Prazo" value={detail.dueDate ? new Date(detail.dueDate).toLocaleDateString("pt-BR") : "—"} />
              <Info label="Região" value={detail.region ?? "—"} />
            </dl>

            {parseList(detail.formats).length > 0 && (
              <div className="mb-6 flex flex-wrap gap-1.5">
                {parseList(detail.formats).map((f) => (
                  <span key={f} className="rounded-full border border-hub-line px-2.5 py-1 text-[10.5px] font-medium text-hub-ink/60">{f}</span>
                ))}
              </div>
            )}

            {pendingApproval && (
              <div className="mb-6 rounded-xl border border-hub-gold/40 bg-hub-gold/[0.07] p-4">
                <p className="mb-3 text-[12.5px] font-bold text-hub-ink">Aprovação pendente — {pendingApproval.approver.name}</p>
                <div className="flex gap-2">
                  <ApprovalButton
                    icon={ThumbsUp}
                    label="Aprovar"
                    tone="approve"
                    onClick={() => startTransition(() => decideApproval(pendingApproval.id, "APROVADO").then(() => { refresh(); router.refresh(); }))}
                  />
                  <ApprovalButton
                    icon={MessageCircleWarning}
                    label="Ajustes"
                    tone="warn"
                    onClick={() => startTransition(() => decideApproval(pendingApproval.id, "AJUSTES").then(() => { refresh(); router.refresh(); }))}
                  />
                  <ApprovalButton
                    icon={ThumbsDown}
                    label="Reprovar"
                    tone="reject"
                    onClick={() => startTransition(() => decideApproval(pendingApproval.id, "REPROVADO").then(() => { refresh(); router.refresh(); }))}
                  />
                </div>
              </div>
            )}

            {detail.checklist.length > 0 && (
              <div className="mb-6">
                <p className="mb-2.5 text-[11.5px] font-bold uppercase tracking-wide text-hub-ink/45">Checklist</p>
                <ul className="flex flex-col gap-2">
                  {detail.checklist.map((item) => (
                    <li key={item.id}>
                      <label className="flex items-center gap-2.5 text-[13px] text-hub-ink/75">
                        <input
                          type="checkbox"
                          defaultChecked={item.done}
                          onChange={(e) => startTransition(() => toggleChecklistItem(item.id, e.target.checked).then(refresh))}
                          className="h-4 w-4 rounded border-hub-line accent-hub-brown"
                        />
                        <span className={item.done ? "text-hub-ink/40 line-through" : ""}>{item.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {detail.versions.length > 0 && (
              <div className="mb-6">
                <p className="mb-2.5 text-[11.5px] font-bold uppercase tracking-wide text-hub-ink/45">Versões</p>
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {detail.versions.map((v) => (
                    <div key={v.id} className="flex w-24 flex-none flex-col items-center gap-1.5">
                      <div className="relative h-20 w-24 overflow-hidden rounded-lg border border-hub-line bg-hub-paper">
                        <Image src={v.fileUrl} alt={v.label} fill sizes="96px" className="object-cover" />
                      </div>
                      <span className={`text-[10.5px] font-bold ${v.isFinal ? "text-hub-green" : "text-hub-ink/55"}`}>{v.isFinal ? "FINAL" : v.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="mb-2.5 text-[11.5px] font-bold uppercase tracking-wide text-hub-ink/45">Comentários</p>
              <ul className="flex flex-col gap-3.5">
                {detail.comments.map((c) => (
                  <li key={c.id} className="flex gap-2.5">
                    <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-hub-paper text-[10px] font-bold text-hub-brown">{initials(c.author.name)}</span>
                    <div className="min-w-0 rounded-xl bg-hub-paper/60 px-3 py-2">
                      <p className="text-[12px] font-bold text-hub-ink">{c.author.name} <span className="ml-1 font-normal text-hub-ink/40">{formatRelativeDate(c.createdAt)}</span></p>
                      <p className="text-[13px] text-hub-ink/75">{c.text}</p>
                    </div>
                  </li>
                ))}
                {detail.comments.length === 0 && <p className="text-[12px] text-hub-ink/40">Nenhum comentário ainda.</p>}
              </ul>
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!commentText.trim()) return;
            startTransition(() => addDemandComment(demandId, commentText).then(() => { setCommentText(""); refresh(); }));
          }}
          className="flex items-center gap-2.5 border-t border-hub-line px-5 py-3.5"
        >
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Escreva um comentário..."
            className="flex-1 rounded-full border border-hub-line bg-hub-paper/40 px-4 py-2.5 text-[13px] outline-none focus:border-hub-gold/60 focus:bg-white"
          />
          <button type="submit" className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-hub-brown text-white hover:brightness-110">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className="rounded-full px-2.5 py-1 text-[10.5px] font-bold" style={{ background: `${color}1a`, color }}>
      {children}
    </span>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10.5px] font-bold uppercase tracking-wide text-hub-ink/40">{label}</dt>
      <dd className="text-hub-ink/80">{value}</dd>
    </div>
  );
}

function ApprovalButton({
  icon: Icon,
  label,
  tone,
  onClick,
}: {
  icon: typeof ThumbsUp;
  label: string;
  tone: "approve" | "warn" | "reject";
  onClick: () => void;
}) {
  const toneClass =
    tone === "approve"
      ? "bg-hub-green text-white hover:brightness-110"
      : tone === "warn"
        ? "bg-white text-hub-ink border border-hub-line hover:bg-hub-paper"
        : "bg-white text-hub-red border border-hub-red/30 hover:bg-hub-red/5";
  return (
    <button type="button" onClick={onClick} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-bold transition ${toneClass}`}>
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}
