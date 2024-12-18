import { readFileSync } from 'fs';

const file = readFileSync(`${__dirname}/input.txt`);
const lines: [number, number][] = file
  .toString()
  .split('\n')
  .map((line) => line.split(',').map(Number) as [number, number]);

const grid: string[][] = [];
const gridCosts: number[][] = [];

const gridMax = 70;
const fallenBytes = 1024;

for (let i = 0; i <= gridMax; i++) {
  grid.push([]);
  gridCosts.push([]);
  for (let j = 0; j <= gridMax; j++) {
    grid[i].push('.');
    gridCosts[i].push(Infinity);
  }
}

for (let i = 0; i < fallenBytes; i++) {
  const [x, y] = lines[i];
  grid[y][x] = '#';
}

interface PotentialNode {
  cost: number;
  x: number;
  y: number;
}

const queue: PotentialNode[] = [
  {
    cost: 0,
    x: 0,
    y: 0,
  },
];

let checkPosition = queue.shift();

while (checkPosition.x !== gridMax || checkPosition.y !== gridMax) {
  if (
    grid[checkPosition.y - 1]?.[checkPosition.x] === '.' &&
    gridCosts[checkPosition.y - 1][checkPosition.x] > checkPosition.cost + 1
  ) {
    gridCosts[checkPosition.y - 1][checkPosition.x] = checkPosition.cost + 1;
    queue.push({
      cost: checkPosition.cost + 1,
      x: checkPosition.x,
      y: checkPosition.y - 1,
    });
  }
  if (
    grid[checkPosition.y + 1]?.[checkPosition.x] === '.' &&
    gridCosts[checkPosition.y + 1][checkPosition.x] > checkPosition.cost + 1
  ) {
    gridCosts[checkPosition.y + 1][checkPosition.x] = checkPosition.cost + 1;
    queue.push({
      cost: checkPosition.cost + 1,
      x: checkPosition.x,
      y: checkPosition.y + 1,
    });
  }
  if (
    grid[checkPosition.y]?.[checkPosition.x - 1] === '.' &&
    gridCosts[checkPosition.y][checkPosition.x - 1] > checkPosition.cost + 1
  ) {
    gridCosts[checkPosition.y][checkPosition.x - 1] = checkPosition.cost + 1;
    queue.push({
      cost: checkPosition.cost + 1,
      x: checkPosition.x - 1,
      y: checkPosition.y,
    });
  }
  if (
    grid[checkPosition.y]?.[checkPosition.x + 1] === '.' &&
    gridCosts[checkPosition.y][checkPosition.x + 1] > checkPosition.cost + 1
  ) {
    gridCosts[checkPosition.y][checkPosition.x + 1] = checkPosition.cost + 1;
    queue.push({
      cost: checkPosition.cost + 1,
      x: checkPosition.x + 1,
      y: checkPosition.y,
    });
  }

  queue.sort((a, b) => a.cost - b.cost);
  checkPosition = queue.shift();
}

console.log(checkPosition.cost);
