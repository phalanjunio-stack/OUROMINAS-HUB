"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stringifyList } from "@/lib/json";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autenticado.");
  return session.user.id;
}

function nextDemandCode(lastCode: string | undefined): string {
  const year = new Date().getFullYear();
  const lastSeq = lastCode ? Number(lastCode.split("-").pop()) : 0;
  return `DOM-${year}-${String((Number.isFinite(lastSeq) ? lastSeq : 0) + 1).padStart(4, "0")}`;
}

export async function getDemandDetail(demandId: string) {
  await requireUserId();
  return prisma.demand.findUnique({
    where: { id: demandId },
    include: {
      requester: true,
      assignee: true,
      campaign: true,
      checklist: { orderBy: { position: "asc" } },
      comments: { include: { author: true }, orderBy: { createdAt: "asc" } },
      versions: { orderBy: { versionNumber: "desc" } },
      approvals: { include: { approver: true }, orderBy: { createdAt: "desc" } },
    },
  });
}

export async function moveDemand(demandId: string, newStatus: string, newPosition: number) {
  const userId = await requireUserId();
  const demand = await prisma.demand.findUnique({ where: { id: demandId } });
  if (!demand) return;

  await prisma.demand.update({ where: { id: demandId }, data: { status: newStatus, position: newPosition } });

  if (demand.status !== newStatus) {
    await prisma.activityLog.create({
      data: {
        userId,
        action: "DEMANDA_MOVIDA",
        entityType: "Demand",
        entityId: demandId,
        description: `Demanda ${demand.code} movida para ${newStatus.replaceAll("_", " ").toLowerCase()}.`,
      },
    });
  }
  revalidatePath("/demandas");
  revalidatePath("/dashboard");
}

export async function createDemand(formData: FormData) {
  const userId = await requireUserId();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Título é obrigatório.");

  const lastDemand = await prisma.demand.findFirst({ orderBy: { createdAt: "desc" }, select: { code: true } });
  const formats = formData.getAll("formats").map(String);
  const campaignId = String(formData.get("campaignId") ?? "") || null;
  const dueDateRaw = String(formData.get("dueDate") ?? "");

  const demand = await prisma.demand.create({
    data: {
      code: nextDemandCode(lastDemand?.code),
      title,
      description: String(formData.get("description") ?? "") || null,
      requesterId: userId,
      department: String(formData.get("department") ?? "") || null,
      priority: String(formData.get("priority") ?? "MEDIA"),
      dueDate: dueDateRaw ? new Date(dueDateRaw) : null,
      campaignId,
      materialType: String(formData.get("materialType") ?? "Outro"),
      formats: stringifyList(formats),
      region: String(formData.get("region") ?? "") || null,
      status: "NOVA",
    },
  });

  await prisma.activityLog.create({
    data: { userId, action: "DEMANDA_CRIADA", entityType: "Demand", entityId: demand.id, description: `Nova demanda criada — ${demand.title}` },
  });

  revalidatePath("/demandas");
  revalidatePath("/dashboard");
}

export async function toggleChecklistItem(itemId: string, done: boolean) {
  await requireUserId();
  await prisma.demandChecklistItem.update({ where: { id: itemId }, data: { done } });
  revalidatePath("/demandas");
}

export async function addDemandComment(demandId: string, text: string) {
  const userId = await requireUserId();
  if (!text.trim()) return;
  await prisma.demandComment.create({ data: { demandId, authorId: userId, text: text.trim() } });
  revalidatePath("/demandas");
}

export async function decideApproval(approvalId: string, status: "APROVADO" | "AJUSTES" | "REPROVADO", comment?: string) {
  const userId = await requireUserId();
  const approval = await prisma.approval.update({
    where: { id: approvalId },
    data: { status, comment: comment || null, decidedAt: new Date() },
    include: { demand: true },
  });

  const nextStatus = status === "APROVADO" ? "APROVADO" : status === "AJUSTES" ? "AJUSTES" : "AJUSTES";
  await prisma.demand.update({ where: { id: approval.demandId }, data: { status: nextStatus } });

  await prisma.activityLog.create({
    data: {
      userId,
      action: "APROVACAO_CONCLUIDA",
      entityType: "Demand",
      entityId: approval.demandId,
      description: `${approval.demand.code} — decisão registrada: ${status.toLowerCase()}.`,
    },
  });

  revalidatePath("/demandas");
  revalidatePath("/dashboard");
}
