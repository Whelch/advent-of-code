export function openingSymbol(symbol: string): boolean {
  return ['<', '{', '[', '('].includes(symbol);
}
