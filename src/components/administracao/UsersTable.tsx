"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { ROLES, initials, formatRelativeDate } from "@/lib/constants";
import { createUser, toggleUserStatus, deleteUser } from "@/app/(app)/administracao/actions";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastAccessAt: Date | null;
};

export function UsersTable({ users, currentUserId }: { users: AdminUser[]; currentUserId: string }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        const matchesSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = !roleFilter || u.role === roleFilter;
        return matchesSearch && matchesRole;
      }),
    [users, search, roleFilter],
  );

  const handleToggle = async (user: AdminUser) => {
    setBusyId(user.id);
    setError(null);
    const next = user.status === "ATIVO" ? "INATIVO" : "ATIVO";
    const result = await toggleUserStatus(user.id, next);
    if (!result.ok) setError(result.error);
    router.refresh();
    setBusyId(null);
  };

  const handleDelete = async (user: AdminUser) => {
    if (!confirm(`Remover ${user.name}? Essa ação não pode ser desfeita.`)) return;
    setBusyId(user.id);
    setError(null);
    const result = await deleteUser(user.id);
    if (!result.ok) setError(result.error);
    router.refresh();
    setBusyId(null);
  };

  return (
    <div className="rounded-2xl border border-hub-line bg-white p-6">
      <div className="mb-1 flex items-center justify-between">
        <div>
          <p className="text-[15px] font-bold text-hub-ink">Usuários do sistema</p>
          <p className="text-[12.5px] text-hub-ink/50">Gerencie os usuários, permissões e acessos ao Ouro de Minas Hub.</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-full bg-hub-brown px-4 py-2.5 text-[12.5px] font-bold text-white hover:brightness-110"
        >
          <Plus className="h-4 w-4" /> Novo usuário
        </button>
      </div>

      <div className="mb-4 mt-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-hub-ink/35" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar usuário..."
            className="w-full rounded-lg border border-hub-line bg-hub-paper/40 py-2 pl-9 pr-3 text-[13px] outline-none focus:border-hub-gold/60 focus:bg-white"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-hub-line bg-hub-paper/40 px-3 py-2 text-[13px] text-hub-ink/75 outline-none focus:border-hub-gold/60"
        >
          <option value="">Todos os cargos</option>
          {Object.entries(ROLES).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {error && <p className="mb-3 rounded-lg bg-hub-red/10 px-3.5 py-2.5 text-[12.5px] font-medium text-hub-red">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-hub-line text-[11px] font-bold uppercase tracking-wide text-hub-ink/40">
              <th className="py-2.5 pr-3">Nome</th>
              <th className="py-2.5 pr-3">E-mail</th>
              <th className="py-2.5 pr-3">Cargo</th>
              <th className="py-2.5 pr-3">Status</th>
              <th className="py-2.5 pr-3">Último acesso</th>
              <th className="py-2.5 pr-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-hub-line/60">
                <td className="py-3 pr-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-hub-paper text-[10.5px] font-bold text-hub-brown">{initials(user.name)}</span>
                    <span className="font-semibold text-hub-ink">{user.name}</span>
                    {user.id === currentUserId && <span className="rounded-full bg-hub-gold/15 px-2 py-0.5 text-[9.5px] font-bold text-hub-caramel">você</span>}
                  </div>
                </td>
                <td className="py-3 pr-3 text-hub-ink/60">{user.email}</td>
                <td className="py-3 pr-3">
                  <span className="rounded-full bg-hub-paper px-2.5 py-1 text-[11px] font-semibold text-hub-ink/70">{ROLES[user.role as keyof typeof ROLES] ?? user.role}</span>
                </td>
                <td className="py-3 pr-3">
                  <button
                    type="button"
                    disabled={busyId === user.id}
                    onClick={() => handleToggle(user)}
                    className={`flex items-center gap-1.5 text-[12px] font-semibold ${user.status === "ATIVO" ? "text-hub-green" : "text-hub-ink/40"}`}
                  >
                    <span className={`h-2 w-2 rounded-full ${user.status === "ATIVO" ? "bg-hub-green" : "bg-hub-ink/30"}`} />
                    {user.status === "ATIVO" ? "Ativo" : "Inativo"}
                  </button>
                </td>
                <td className="py-3 pr-3 text-hub-ink/50">{user.lastAccessAt ? formatRelativeDate(user.lastAccessAt) : "—"}</td>
                <td className="py-3 pr-3">
                  <div className="flex items-center justify-end gap-1.5">
                    {busyId === user.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-hub-ink/40" />
                    ) : (
                      <>
                        <span className="flex h-7 w-7 items-center justify-center rounded-full text-hub-ink/30" title="Edição completa em breve">
                          <Pencil className="h-3.5 w-3.5" />
                        </span>
                        <button type="button" onClick={() => handleDelete(user)} className="flex h-7 w-7 items-center justify-center rounded-full text-hub-ink/40 hover:bg-hub-red/10 hover:text-hub-red">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-hub-ink/40">Nenhum usuário encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && <NewUserModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}

function NewUserModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await createUser(new FormData(event.currentTarget));
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 hub-animate-in" onMouseDown={onClose}>
      <form onSubmit={handleSubmit} onMouseDown={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="mb-4 font-display text-xl font-semibold text-hub-brown">Novo usuário</h2>
        <div className="flex flex-col gap-3.5">
          <input name="name" required placeholder="Nome completo" className={inputClass} />
          <input name="email" type="email" required placeholder="email@ourominas.com.br" className={inputClass} />
          <select name="role" defaultValue="SOLICITANTE" className={inputClass}>
            {Object.entries(ROLES).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <input name="password" type="password" required minLength={6} placeholder="Senha provisória" className={inputClass} />
        </div>
        {error && <p className="mt-3 rounded-lg bg-hub-red/10 px-3 py-2 text-[12px] font-medium text-hub-red">{error}</p>}
        <div className="mt-5 flex justify-end gap-2.5">
          <button type="button" onClick={onClose} className="rounded-full border border-hub-line px-4 py-2 text-[12.5px] font-semibold text-hub-ink/70 hover:bg-hub-paper">
            Cancelar
          </button>
          <button type="submit" disabled={submitting} className="flex items-center gap-2 rounded-full bg-hub-brown px-4 py-2 text-[12.5px] font-bold text-white hover:brightness-110 disabled:opacity-60">
            {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Criar usuário
          </button>
        </div>
      </form>
    </div>
  );
}

const inputClass = "w-full rounded-lg border border-hub-line bg-hub-paper/40 px-3 py-2.5 text-[13px] outline-none focus:border-hub-gold/60 focus:bg-white";
