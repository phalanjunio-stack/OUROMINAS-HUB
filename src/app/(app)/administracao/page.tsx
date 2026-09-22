import Image from "next/image";
import {
  Users, Workflow, FolderTree, Link2, Bell, MapPin, ListChecks,
  DatabaseBackup, FileClock, ChevronRight, Pencil,
} from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UsersTable } from "@/components/administracao/UsersTable";

const ADMIN_CARDS = [
  { icon: Users, title: "Usuários e permissões", desc: "Gerencie usuários, cargos e níveis de acesso." },
  { icon: Workflow, title: "Fluxos e status", desc: "Personalize as etapas das demandas." },
  { icon: FolderTree, title: "Categorias de solicitação", desc: "Organize por áreas e tipos de conteúdo." },
  { icon: Link2, title: "Integrações", desc: "Google Drive, Calendar, WhatsApp e e-mail." },
  { icon: DatabaseBackup, title: "Backup automático", desc: "Ativo · último backup hoje, 02:00." },
  { icon: ListChecks, title: "Modelos e templates", desc: "Gerencie modelos de briefing e materiais." },
  { icon: Bell, title: "Notificações", desc: "Configure alertas e comunicações." },
  { icon: MapPin, title: "Unidades / Regionais", desc: "Cadastre regiões e representantes." },
  { icon: FileClock, title: "Logs de atividade", desc: "Acompanhe todas as ações do sistema." },
];

export default async function AdministracaoPage() {
  const session = await auth();
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, status: true, lastAccessAt: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6 p-6 lg:p-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-hub-brown">Administração do Sistema</h1>
        <p className="text-[13px] text-hub-ink/55">Centro de controle do Ouro de Minas Hub. Gerencie usuários, configurações e todo o ecossistema da plataforma.</p>
      </div>

      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 xl:grid-cols-5">
        {ADMIN_CARDS.map((card) => (
          <div key={card.title} className="group flex flex-col justify-between rounded-xl border border-hub-line bg-white p-4 transition hover:border-hub-gold/40 hover:shadow-sm">
            <div>
              <span className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg bg-hub-paper text-hub-caramel">
                <card.icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
              </span>
              <p className="text-[12.5px] font-bold leading-snug text-hub-ink">{card.title}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-hub-ink/45">{card.desc}</p>
            </div>
            <ChevronRight className="mt-2.5 h-3.5 w-3.5 text-hub-ink/25 transition group-hover:translate-x-0.5 group-hover:text-hub-caramel" />
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <UsersTable users={users} currentUserId={session?.user?.id ?? ""} />

        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-hub-line bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[13.5px] font-bold text-hub-ink">Regras de publicação</p>
              <span className="flex items-center gap-1 text-[11.5px] font-semibold text-hub-caramel">
                <Pencil className="h-3 w-3" /> Editar
              </span>
            </div>
            <p className="mb-4 text-[11.5px] text-hub-ink/50">Defina as regras e aprovações para publicação de conteúdos.</p>
            <ul className="flex flex-col gap-3.5 text-[12.5px]">
              <RuleRow label="Aprovação obrigatória para publicação" on />
              <RuleSelect label="Níveis de aprovação" value="2 níveis (Marketing + Diretoria)" />
              <RuleSelect label="Prazo padrão de aprovação" value="Até 2 dias úteis" />
              <RuleRow label="Permitir publicação direta (casos internos)" on={false} />
              <RuleRow label="Bloquear publicação fora do calendário" on />
              <RuleRow label="Exigir checklist de marca" on />
            </ul>
          </div>

          <div className="rounded-2xl border border-hub-line bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[13.5px] font-bold text-hub-ink">Personalização da marca</p>
              <span className="flex items-center gap-1 text-[11.5px] font-semibold text-hub-caramel">
                <Pencil className="h-3 w-3" /> Editar
              </span>
            </div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-hub-ink/40">Logo da plataforma</p>
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-dashed border-hub-line p-3">
              <div className="relative h-14 w-14 flex-none">
                <Image src="/images/logo-ouro-de-minas.png" alt="Logo Ouro de Minas" fill sizes="56px" className="object-contain" />
              </div>
              <div className="text-[11px] text-hub-ink/45">PNG ou SVG (máx. 2MB)</div>
            </div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-hub-ink/40">Cores principais</p>
            <div className="mb-4 flex gap-2">
              <Swatch color="#2A180F" label="Marrom" />
              <Swatch color="#D4A017" label="Dourado" />
              <Swatch color="#F7F1E6" label="Bege" border />
            </div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-hub-ink/40">Terminologia personalizada</p>
            <div className="flex flex-col gap-1.5 text-[12px]">
              <TermRow from="Demandas" to="Solicitações" />
              <TermRow from="Representantes" to="Consultores" />
              <TermRow from="Campanhas" to="Ações de Marketing" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RuleRow({ label, on }: { label: string; on: boolean }) {
  return (
    <li className="flex items-center justify-between gap-3">
      <span className="text-hub-ink/70">{label}</span>
      <span className={`relative h-5 w-9 flex-none rounded-full transition ${on ? "bg-hub-brown" : "bg-hub-line"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${on ? "left-4.5" : "left-0.5"}`} style={{ left: on ? "18px" : "2px" }} />
      </span>
    </li>
  );
}

function RuleSelect({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between gap-3">
      <span className="text-hub-ink/70">{label}</span>
      <span className="rounded-md border border-hub-line bg-hub-paper/50 px-2 py-1 text-[11px] font-semibold text-hub-ink/70">{value}</span>
    </li>
  );
}

function Swatch({ color, label, border }: { color: string; label: string; border?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`h-8 w-8 rounded-full ${border ? "border border-hub-line" : ""}`} style={{ background: color }} />
      <span className="text-[9.5px] text-hub-ink/45">{label}</span>
    </div>
  );
}

function TermRow({ from, to }: { from: string; to: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-hub-paper/50 px-2.5 py-1.5">
      <span className="text-hub-ink/50">{from}</span>
      <span className="font-semibold text-hub-ink">{to}</span>
    </div>
  );
}
