import Image from "next/image";
import Link from "next/link";
import { FileText, Clock3, Send, Coins, BookOpen, Megaphone, MonitorPlay, LifeBuoy, ArrowRight } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrencyBRL, formatRelativeDate } from "@/lib/constants";
import { demoDelta } from "@/lib/demo";
import { StatCard } from "@/components/dashboard/StatCard";
import { PerformanceChart, type PerformancePoint } from "@/components/dashboard/PerformanceChart";
import { UpcomingCalendar, type CalEvent } from "@/components/dashboard/UpcomingCalendar";
import { CALENDAR_EVENT_TYPES } from "@/lib/constants";

const MONTH_LABELS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const QUOTES = [
  "Doce é transformar o simples em momentos especiais.",
  "Tradição é o ingrediente que não aparece na embalagem.",
  "Cada pote carrega uma história de Minas.",
];

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "";
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [demandsActive, pendingApprovals, publishedThisMonth, expensesThisMonth, recentActivity, calendarEvents, publicationsRecent] = await Promise.all([
    prisma.demand.count({ where: { status: { notIn: ["PUBLICADO", "ARQUIVADO"] } } }),
    prisma.approval.count({ where: { status: "PENDENTE" } }),
    prisma.publication.count({ where: { publishedAt: { gte: startOfMonth } } }),
    prisma.expense.aggregate({ _sum: { amount: true }, where: { createdAt: { gte: startOfMonth } } }),
    prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { user: true } }),
    prisma.calendarEvent.findMany({ orderBy: { date: "asc" } }),
    prisma.publication.findMany({ select: { publishedAt: true, engagement: true } }),
  ]);

  const chartData: PerformancePoint[] = Array.from({ length: 6 }, (_, i) => {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 1);
    const inMonth = publicationsRecent.filter((p) => p.publishedAt >= monthDate && p.publishedAt < monthEnd);
    const engajamento = inMonth.reduce((sum, p) => sum + (p.engagement ?? 0), 0) / 1000;
    return { label: MONTH_LABELS[monthDate.getMonth()], publicacoes: inMonth.length, engajamento: Math.round(engajamento * 10) / 10 };
  });

  const calEvents: CalEvent[] = calendarEvents.map((e) => ({
    id: e.id,
    title: e.title,
    date: e.date,
    color: e.color,
    typeLabel: CALENDAR_EVENT_TYPES.find((t) => t.value === e.type)?.label ?? e.type,
  }));

  const activeDelta = demoDelta("demandas-ativas");
  const approvalDelta = demoDelta("aguardando-aprovacao");
  const publishedDelta = demoDelta("publicados-mes");
  const spendDelta = demoDelta("gastos-marketing", 3, 15);
  const quote = QUOTES[now.getDate() % QUOTES.length];

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6 p-6 lg:p-8">
      <section className="relative overflow-hidden rounded-2xl border border-hub-line bg-white">
        <div className="grid gap-6 p-7 lg:grid-cols-[1.4fr_1fr] lg:p-9">
          <div>
            <h1 className="font-display text-[32px] font-semibold leading-tight text-hub-brown">Bem-vinda, {firstName}!</h1>
            <p className="mt-1 text-[15px] text-hub-ink/60">Aqui é onde grandes ideias viram resultados. 🍯</p>
          </div>
          <div className="flex flex-col justify-center border-hub-line lg:border-l lg:pl-8">
            <p className="font-display text-lg italic leading-snug text-hub-ink/75">&ldquo;{quote}&rdquo;</p>
            <span className="mt-2 h-[3px] w-9 rounded-full bg-hub-gold" />
          </div>
        </div>
        <div className="absolute inset-y-0 right-0 hidden w-[260px] xl:block">
          <Image src="/images/campanhas/pingo-bel-corte.png" alt="" fill sizes="260px" className="object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white" />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FileText} iconBg="#f7e9d8" iconColor="#a8632f" label="Demandas ativas" value={String(demandsActive)} deltaValue={activeDelta.value} deltaUp={activeDelta.up} />
        <StatCard icon={Clock3} iconBg="#fbeecb" iconColor="#c48a11" label="Aguardando aprovação" value={String(pendingApprovals)} deltaValue={approvalDelta.value} deltaUp={approvalDelta.up} />
        <StatCard icon={Send} iconBg="#f3e3d6" iconColor="#8a4e2b" label="Publicados no mês" value={String(publishedThisMonth)} deltaValue={publishedDelta.value} deltaUp={publishedDelta.up} />
        <StatCard icon={Coins} iconBg="#efe6d6" iconColor="#8a6a1f" label="Gastos de marketing" value={formatCurrencyBRL(expensesThisMonth._sum.amount ?? 0)} deltaValue={spendDelta.value} deltaUp={spendDelta.up} deltaSuffix="vs. mês anterior · abaixo do previsto" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_1fr_1fr]">
        <div className="rounded-2xl border border-hub-line bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-bold text-hub-ink">Desempenho de publicações</p>
            <span className="rounded-full border border-hub-line px-2.5 py-1 text-[11px] font-medium text-hub-ink/55">Últimos 6 meses</span>
          </div>
          <PerformanceChart data={chartData} />
        </div>

        <div className="rounded-2xl border border-hub-line bg-white p-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold text-hub-ink">Atividades recentes</p>
            <Link href="/relatorios" className="flex items-center gap-1 text-[12px] font-semibold text-hub-caramel hover:underline">
              Ver todas <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <ul className="flex flex-col gap-3.5">
            {recentActivity.map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-hub-ink">{activityHeadline(a.action)}</p>
                  <p className="truncate text-[12px] text-hub-ink/55">{a.description}</p>
                </div>
                <span className="flex-none whitespace-nowrap text-[11px] text-hub-ink/40">{formatRelativeDate(a.createdAt)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-hub-line bg-white p-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold text-hub-ink">Próximas campanhas</p>
            <Link href="/calendario" className="flex items-center gap-1 text-[12px] font-semibold text-hub-caramel hover:underline">
              Ver todas <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <UpcomingCalendar events={calEvents} />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div className="rounded-2xl border border-hub-line bg-white p-6">
          <p className="text-sm font-bold text-hub-ink">Apoio aos representantes</p>
          <p className="mt-1 text-[13px] leading-relaxed text-hub-ink/60">Materiais, treinamentos e tudo o que seu representante precisa, em um só lugar.</p>
          <ul className="mt-4 flex flex-col gap-2.5 text-[13px] text-hub-ink/75">
            <li className="flex items-center gap-2.5">
              <BookOpen className="h-4 w-4 text-hub-caramel" strokeWidth={1.8} /> Catálogo de produtos
            </li>
            <li className="flex items-center gap-2.5">
              <Megaphone className="h-4 w-4 text-hub-caramel" strokeWidth={1.8} /> Materiais de vendas
            </li>
            <li className="flex items-center gap-2.5">
              <MonitorPlay className="h-4 w-4 text-hub-caramel" strokeWidth={1.8} /> Treinamentos online
            </li>
            <li className="flex items-center gap-2.5">
              <LifeBuoy className="h-4 w-4 text-hub-caramel" strokeWidth={1.8} /> Suporte em campanhas
            </li>
          </ul>
          <Link href="/representantes" className="mt-5 inline-flex items-center gap-2 rounded-full bg-hub-brown px-5 py-2.5 text-[13px] font-bold text-white transition hover:brightness-110">
            Acessar central <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-hub-line">
          <Image src="/images/campanhas/pote-pingo-bel.webp" alt="" fill sizes="400px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <p className="absolute bottom-5 left-5 right-5 font-display text-lg italic leading-snug text-white">
            &ldquo;Juntos, levamos o sabor de Minas mais longe.&rdquo;
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-hub-line bg-hub-brown-950">
          <Image src="/images/campanhas/pingo-bel-corte.png" alt="" fill sizes="400px" className="object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-hub-brown-950 via-hub-brown-950/40 to-transparent" />
          <p className="absolute left-5 top-6 font-display text-2xl font-semibold uppercase leading-[1.15] text-hub-gold-light">
            Tradição
            <br />
            inspira novos
            <br />
            horizontes
          </p>
        </div>
      </section>
    </div>
  );
}

function activityHeadline(action: string): string {
  const map: Record<string, string> = {
    DEMANDA_CRIADA: "Nova demanda criada",
    APROVACAO_CONCLUIDA: "Aprovação concluída",
    ARQUIVO_ADICIONADO: "Arquivo adicionado no Drive",
    CAMPANHA_PUBLICADA: "Campanha publicada",
    REPRESENTANTE_CADASTRADO: "Novo representante cadastrado",
    DESPESA_PAGA: "Despesa marcada como paga",
  };
  return map[action] ?? action;
}
