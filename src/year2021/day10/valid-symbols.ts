export function validSymbols(open: string, close: string): boolean {
  switch (`${open}${close}`) {
    case '<>':
    case '()':
    case '{}':
    case '[]':
      return true;
    default:
      return false;
  }
}
