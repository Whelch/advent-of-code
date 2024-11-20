export function pointsFromLine([[x0, y0], [x1, y1]]: number[][]): string[] {
  const points = [`${x0},${y0}`];
  while (x0 !== x1 || y0 !== y1) {
    x0 += Math.sign(x1 - x0);
    y0 += Math.sign(y1 - y0);
    points.push(`${x0},${y0}`);
  }
  return points;
}
