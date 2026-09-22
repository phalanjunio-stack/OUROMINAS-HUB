"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type ActionResult = { ok: true } | { ok: false; error: string };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autenticado.");
  return session.user.id;
}

export async function createUser(formData: FormData): Promise<ActionResult> {
  const actorId = await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "SOLICITANTE");
  const password = String(formData.get("password") ?? "");
  if (!name || !email || password.length < 6) {
    return { ok: false, error: "Preencha nome, e-mail e uma senha com ao menos 6 caracteres." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { ok: false, error: "Já existe um usuário com esse e-mail." };

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, passwordHash, role, jobTitle: role, status: "ATIVO" } });

  await prisma.activityLog.create({
    data: { userId: actorId, action: "USUARIO_CRIADO", entityType: "User", entityId: user.id, description: `Novo usuário criado — ${user.name}` },
  });

  revalidatePath("/administracao");
  return { ok: true };
}

export async function toggleUserStatus(userId: string, status: "ATIVO" | "INATIVO"): Promise<ActionResult> {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { status } });
  revalidatePath("/administracao");
  return { ok: true };
}

export async function deleteUser(userId: string): Promise<ActionResult> {
  const actorId = await requireAdmin();
  if (userId === actorId) return { ok: false, error: "Você não pode remover o próprio usuário." };

  try {
    await prisma.user.delete({ where: { id: userId } });
  } catch {
    // Violação de chave estrangeira: o usuário tem demandas, comentários ou
    // logs vinculados. Manter o histórico é mais correto do que apagar em
    // cascata, então orientamos a desativar em vez de remover.
    return { ok: false, error: "Este usuário tem registros vinculados (demandas, comentários, histórico). Desative-o em vez de remover." };
  }

  revalidatePath("/administracao");
  return { ok: true };
}
