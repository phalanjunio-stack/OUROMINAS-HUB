// SQLite (e o schema Postgres-ready que herda dele) guarda listas e objetos
// como texto JSON em vez de colunas nativas. Estes helpers centralizam o
// parse/stringify para não espalhar try/catch pelo app inteiro.

export function parseList(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function stringifyList(items: string[]): string {
  return JSON.stringify(items ?? []);
}

export function parseObject<T extends Record<string, unknown>>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "object" && parsed !== null ? { ...fallback, ...parsed } : fallback;
  } catch {
    return fallback;
  }
}
