import { prisma } from "@/lib/prisma";
import { KanbanBoard } from "@/components/demandas/KanbanBoard";

export default async function DemandasPage() {
  const [demands, campaigns] = await Promise.all([
    prisma.demand.findMany({
      include: {
        requester: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
        campaign: { select: { id: true, name: true, color: true } },
        _count: { select: { comments: true, versions: true, checklist: true } },
      },
      orderBy: { position: "asc" },
    }),
    prisma.campaign.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="h-full">
      <KanbanBoard demands={demands} options={{ campaigns }} />
    </div>
  );
}
