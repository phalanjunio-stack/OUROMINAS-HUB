// Valores fixos usados no lugar de enum nativo (SQLite não suporta enum).
// Cada lista tem o valor salvo no banco + o rótulo em português + uma cor
// para badges/kanban. Ao trocar para Postgres, estes arrays viram a fonte
// da verdade para gerar os `enum` do schema.

export const ROLES = {
  ADMIN: "Administrador",
  DIRETORIA: "Diretoria",
  MARKETING: "Marketing",
  DESIGNER: "Designer",
  FINANCEIRO: "Financeiro",
  REPRESENTANTE: "Representante",
  SOLICITANTE: "Solicitante",
} as const;
export type Role = keyof typeof ROLES;

export const DEMAND_STATUSES = [
  { value: "NOVA", label: "Nova demanda", color: "#9b8b7a" },
  { value: "BRIEFING", label: "Briefing", color: "#8a6a4f" },
  { value: "EM_PRODUCAO", label: "Em produção", color: "#c97b2e" },
  { value: "PARA_APROVACAO", label: "Para aprovação", color: "#d4a017" },
  { value: "AJUSTES", label: "Ajustes", color: "#c0522f" },
  { value: "APROVADO", label: "Aprovado", color: "#3f8a4f" },
  { value: "AGENDADO", label: "Agendado", color: "#3c6e9b" },
  { value: "PUBLICADO", label: "Publicado", color: "#42130d" },
  { value: "ARQUIVADO", label: "Arquivado", color: "#a8a29a" },
] as const;
export type DemandStatus = (typeof DEMAND_STATUSES)[number]["value"];

export const PRIORITIES = [
  { value: "BAIXA", label: "Baixa", color: "#7c9c7c" },
  { value: "MEDIA", label: "Média", color: "#d4a017" },
  { value: "ALTA", label: "Alta", color: "#c97b2e" },
  { value: "URGENTE", label: "Urgente", color: "#b3392c" },
] as const;

export const MATERIAL_TYPES = [
  "Feed Instagram",
  "Story",
  "Reel",
  "Banner",
  "Outdoor",
  "Cartaz",
  "Folder",
  "Catálogo",
  "Embalagem",
  "Material PDV",
  "Vídeo",
  "Apresentação",
  "Material para representante",
  "Evento",
  "Outro",
] as const;

export const MATERIAL_FORMATS = [
  "Feed 1080x1350",
  "Story 1080x1920",
  "WhatsApp",
  "A4",
  "A3",
  "Banner",
  "Tela",
  "Impresso",
] as const;

export const APPROVAL_STATUSES = [
  { value: "PENDENTE", label: "Pendente", color: "#d4a017" },
  { value: "APROVADO", label: "Aprovado", color: "#3f8a4f" },
  { value: "AJUSTES", label: "Solicitar alteração", color: "#c97b2e" },
  { value: "REPROVADO", label: "Reprovado", color: "#b3392c" },
] as const;

export const PUBLICATION_CHANNELS = [
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "FACEBOOK", label: "Facebook" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "SITE", label: "Site" },
  { value: "IMPRESSO", label: "Impresso" },
  { value: "PDV", label: "PDV" },
  { value: "REPRESENTANTES", label: "Representantes" },
  { value: "EVENTOS", label: "Eventos" },
] as const;

export const MEDIA_CATEGORIES = [
  { value: "PRODUTOS", label: "Produtos" },
  { value: "CAMPANHAS", label: "Campanhas" },
  { value: "EVENTOS", label: "Eventos" },
  { value: "INSTITUCIONAL", label: "Institucional" },
  { value: "REPRESENTANTES", label: "Representantes" },
  { value: "FABRICA", label: "Fábrica" },
] as const;

export const MEDIA_TYPES = [
  { value: "FOTO", label: "Fotos" },
  { value: "VIDEO", label: "Vídeos" },
  { value: "ARTE", label: "Artes" },
  { value: "EDITAVEL", label: "Editáveis" },
] as const;

export const EXPENSE_CATEGORIES = [
  "Gráfica",
  "Mídia paga",
  "Eventos",
  "Brindes",
  "Fotografia",
  "Vídeo",
  "Influenciadores",
  "Impressos",
  "Materiais PDV",
  "Outros",
] as const;

export const SUPPLIER_CATEGORIES = [
  "Gráfica",
  "Fotografia",
  "Vídeo",
  "Eventos",
  "Brindes",
  "Impressão",
  "Comunicação Visual",
] as const;

export const CALENDAR_EVENT_TYPES = [
  { value: "CAMPANHA", label: "Campanha", color: "#c97b2e" },
  { value: "EVENTO", label: "Evento", color: "#3c6e9b" },
  { value: "DATA_COMEMORATIVA", label: "Data comemorativa", color: "#b3392c" },
  { value: "LANCAMENTO", label: "Lançamento", color: "#3f8a4f" },
  { value: "PUBLICACAO", label: "Publicação", color: "#8a6a4f" },
  { value: "TREINAMENTO", label: "Treinamento", color: "#6e407d" },
] as const;

export function statusMeta(value: string) {
  return DEMAND_STATUSES.find((s) => s.value === value) ?? DEMAND_STATUSES[0];
}

export function priorityMeta(value: string) {
  return PRIORITIES.find((p) => p.value === value) ?? PRIORITIES[1];
}

export function formatCurrencyBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatRelativeDate(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `há ${hours} hora${hours > 1 ? "s" : ""}`;
  const days = Math.round(hours / 24);
  if (days < 30) return `há ${days} dia${days > 1 ? "s" : ""}`;
  return date.toLocaleDateString("pt-BR");
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}
