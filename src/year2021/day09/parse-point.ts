export function parsePoint(point: string): [number, number] {
  return point.split(',').map((val) => +val) as [number, number];
}
