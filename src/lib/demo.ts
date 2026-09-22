// Pequenos números "vs mês anterior" que os cards de estatística mostram.
// O histórico real ainda não existe (dados de demonstração recém-semeados),
// então em vez de fingir uma comparação real, geramos um percentual
// determinístico a partir de uma semente — estável entre renders, mas
// claramente ilustrativo. Troque por uma comparação real assim que houver
// histórico de verdade (basta comparar snapshots por mês).
export function demoDelta(seed: string, min = 4, max = 45): { value: number; up: boolean } {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const value = min + (hash % (max - min + 1));
  const up = hash % 5 !== 0; // maioria positiva, ocasionalmente negativa
  return { value, up };
}
