import { readFileSync } from 'fs';

const file = readFileSync(`${__dirname}/input.txt`);
const lines: [number, number][] = file
  .toString()
  .split('\n')
  .map((line) => line.split(',').map(Number) as [number, number]);

const grid: string[][] = [];

const gridMax = 70;
const startingBytes = 3000;

for (let i = 0; i <= gridMax; i++) {
  grid.push([]);
  for (let j = 0; j <= gridMax; j++) {
    grid[i].push('.');
  }
}

for (let i = 0; i < startingBytes; i++) {
  const [x, y] = lines[i];
  grid[y][x] = '#';
}

interface PotentialNode {
  cost: number;
  x: number;
  y: number;
}

for (let i = startingBytes; i < lines.length; i++) {
  const [x, y] = lines[i];
  grid[y][x] = '#';

  const gridCosts: number[][] = [];
  for (let i = 0; i <= gridMax; i++) {
    grid.push([]);
    gridCosts.push([]);
    for (let j = 0; j <= gridMax; j++) {
      grid[i].push('.');
      gridCosts[i].push(Infinity);
    }
  }

  const queue: PotentialNode[] = [
    {
      cost: 0,
      x: 0,
      y: 0,
    },
  ];

  while (queue.length > 0) {
    let checkPosition = queue.shift();
    if (checkPosition.x === gridMax && checkPosition.y === gridMax) {
      break;
    }

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
  }

  if (queue.length === 0) {
    console.log('No Path: ', i, lines[i]);
    break;
  }
}

// I SHOULD WRITE A LIBRARY FOR THIS PATHFINDING CRAP!
