import { readFileSync } from 'fs';
import { chain, difference } from 'lodash';
import { parsePoint } from './parse-point';
import { stringifyPoint } from './stringify-point';

const file = readFileSync(`${__dirname}/input.txt`);

const grid = chain(file)
  .split('\n')
  .map((line) => line.split('').map((val) => +val))
  .valueOf();

const lowPoints: [number, number][] = [];
const basinSizes: number[] = [];

function getHeight(x: number, y: number): number {
  return grid[x] && grid[x][y];
}

for (let x = 0; x < grid.length; x++) {
  for (let y = 0; y < grid[x].length; y++) {
    const checkHeight = getHeight(x, y);

    let lowerAdjacentPoints = chain([
      getHeight(x + 1, y),
      getHeight(x, y + 1),
      getHeight(x - 1, y),
      getHeight(x, y - 1),
    ])
      .filter((height) => height <= checkHeight)
      .size()
      .valueOf();

    if (lowerAdjacentPoints === 0) {
      lowPoints.push([x, y]);
    }
  }
}

function flood(x: number, y: number): string[] {
  const points = [];
  if (getHeight(x + 1, y) < 9) {
    points.push(stringifyPoint(x + 1, y));
  }
  if (getHeight(x, y + 1) < 9) {
    points.push(stringifyPoint(x, y + 1));
  }
  if (getHeight(x - 1, y) < 9) {
    points.push(stringifyPoint(x - 1, y));
  }
  if (getHeight(x, y - 1) < 9) {
    points.push(stringifyPoint(x, y - 1));
  }
  return points;
}

lowPoints.forEach(([x, y], index) => {
  const uncheckedPoints = [stringifyPoint(x, y)];
  const foundPoints: string[] = [...uncheckedPoints];

  while (uncheckedPoints.length > 0) {
    const newPoints = difference(flood(...parsePoint(uncheckedPoints.pop())), foundPoints);

    foundPoints.push(...newPoints);
    uncheckedPoints.push(...newPoints);
  }

  basinSizes.push(foundPoints.length);
});

const answer = chain(basinSizes)
  .sortBy()
  .slice(basinSizes.length - 3)
  .reduce((prev, curr) => prev * curr)
  .valueOf();

console.log(answer);
