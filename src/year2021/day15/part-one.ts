import { readFileSync } from 'fs';
import { chain, constant, last, sortedIndexBy, times } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

const grid: number[][] = chain(file)
  .split('\n')
  .map((line) => line.split('').map((val) => +val))
  .valueOf();

let costsGrid: number[][] = times(grid.length, () => times(grid[0].length, constant(Number.MAX_SAFE_INTEGER)));
costsGrid[0][0] = 0;

const checkPoints = [[0, 0]];

function getMoveCost(x: number, y: number): number {
  return grid[x][y];
}

function getPathCost([x, y]: [number, number]): number {
  return costsGrid[x][y];
}

while (checkPoints.length > 0) {
  const [x, y] = checkPoints.shift();
  const cost = getPathCost([x, y]);

  if (x > 0 && getPathCost([x - 1, y]) > cost + getMoveCost(x - 1, y)) {
    const moveCost = getMoveCost(x - 1, y);
    const newPoint = [x - 1, y];
    costsGrid[x - 1][y] = cost + moveCost;
    checkPoints.splice(sortedIndexBy(checkPoints, newPoint, getPathCost), 0, newPoint);
  }
  if (y > 0 && getPathCost([x, y - 1]) > cost + getMoveCost(x, y - 1)) {
    const moveCost = getMoveCost(x, y - 1);
    const newPoint = [x, y - 1];
    costsGrid[x][y - 1] = cost + moveCost;
    checkPoints.splice(sortedIndexBy(checkPoints, newPoint, getPathCost), 0, newPoint);
  }
  if (x < costsGrid.length - 1 && getPathCost([x + 1, y]) > cost + getMoveCost(x + 1, y)) {
    const moveCost = getMoveCost(x + 1, y);
    const newPoint = [x + 1, y];
    costsGrid[x + 1][y] = cost + moveCost;
    checkPoints.splice(sortedIndexBy(checkPoints, newPoint, getPathCost), 0, newPoint);
  }
  if (y < costsGrid[0].length && getPathCost([x, y + 1]) > cost + getMoveCost(x, y + 1)) {
    const moveCost = getMoveCost(x, y + 1);
    const newPoint = [x, y + 1];
    costsGrid[x][y + 1] = cost + moveCost;
    checkPoints.splice(sortedIndexBy(checkPoints, newPoint, getPathCost), 0, newPoint);
  }
}

console.log(last(last(costsGrid)));
