import { readFileSync } from 'fs';

const file = readFileSync(`${__dirname}/input.txt`);
const baseGrid: string[][] = file
  .toString()
  .split('\n')
  .map((line) => line.split(''));

const baseStartPos = findPosition('S');

const costModifier = 50;

interface CheckPosition {
  x: number;
  y: number;
  cost: number;
}

const cheatSheet: number[][] = [];
const wallCheatSheet: number[][][] = [];

for (let x = 0; x < baseGrid.length; x++) {
  cheatSheet[x] = [];
  wallCheatSheet[x] = [];
  for (let y = 0; y < baseGrid[x].length; y++) {
    cheatSheet[x][y] = Infinity;
    wallCheatSheet[x][y] = [];
  }
}

function findPosition(char: string) {
  for (let x = 0; x < baseGrid.length; x++) {
    for (let y = 0; y < baseGrid[x].length; y++) {
      if (baseGrid[x][y] === char) {
        return [x, y];
      }
    }
  }
}

function solve(grid: string[][]): CheckPosition {
  const gridCosts: number[][] = [];

  for (let x = 0; x < baseGrid.length; x++) {
    gridCosts[x] = [];
    for (let y = 0; y < baseGrid[x].length; y++) {
      gridCosts[x][y] = Infinity;
    }
  }
  const startPos = findPosition('S');
  const endPos = findPosition('E');

  const queue: CheckPosition[] = [];

  queue.push({
    cost: 0,
    x: startPos[0],
    y: startPos[1],
  });

  let current: CheckPosition;
  while (queue.length > 0) {
    current = queue.shift();
    gridCosts[current.x][current.y] = current.cost;

    if (current.x === endPos[0] && current.y === endPos[1]) {
      break;
    }

    if (
      !['#', 'X'].includes(grid[current.x + 1]?.[current.y]) &&
      gridCosts[current.x + 1]?.[current.y] > current.cost
    ) {
      queue.push({ x: current.x + 1, y: current.y, cost: current.cost + 1 });
    }
    if (
      !['#', 'X'].includes(grid[current.x - 1]?.[current.y]) &&
      gridCosts[current.x - 1]?.[current.y] > current.cost
    ) {
      queue.push({ x: current.x - 1, y: current.y, cost: current.cost + 1 });
    }
    if (
      !['#', 'X'].includes(grid[current.x]?.[current.y + 1]) &&
      gridCosts[current.x]?.[current.y + 1] > current.cost
    ) {
      queue.push({ x: current.x, y: current.y + 1, cost: current.cost + 1 });
    }
    if (
      !['#', 'X'].includes(grid[current.x]?.[current.y - 1]) &&
      gridCosts[current.x]?.[current.y - 1] > current.cost
    ) {
      queue.push({ x: current.x, y: current.y - 1, cost: current.cost + 1 });
    }

    queue.sort((a, b) => a.cost - b.cost);
  }

  if (current.x !== endPos[0] || current.y !== endPos[1]) {
    return null;
  } else {
    return current;
  }
}
let baseCost = solve(baseGrid);

baseGrid[baseStartPos[0]][baseStartPos[1]] = '.';
for (let i = 0; i < baseGrid.length; i++) {
  for (let j = 0; j < baseGrid[i].length; j++) {
    if (baseGrid[i][j] === '.') {
      baseGrid[i][j] = 'S';
      const solution = solve(baseGrid);
      baseGrid[i][j] = '.';
      cheatSheet[i][j] = solution.cost;
    } else if (baseGrid[i][j] === 'E') {
      cheatSheet[i][j] = 0;
    } else {
      cheatSheet[i][j] = 999999999;
    }
  }
}
baseGrid[baseStartPos[0]][baseStartPos[1]] = 'S';

function wallFloodFill(
  x: number,
  y: number,
  steps: number,
  costMap: Record<number, Record<number, number>>,
  visited: Record<number, Record<number, boolean>> = {},
) {
  if (visited[x]?.[y] || x < 0 || y < 0 || x >= baseGrid.length || y >= baseGrid[x].length || steps > 20) {
    return;
  }

  visited[x] ??= {};
  visited[x][y] = true;

  if (baseGrid[x][y] === '.' || baseGrid[x][y] === 'E' || baseGrid[x][y] === 'S') {
    costMap[x] ??= {};
    costMap[x][y] = !!costMap[x][y] ? Math.min(costMap[x][y], cheatSheet[x][y] + steps) : steps;
    return;
  }

  if (!visited[x + 1]?.[y]) {
    wallFloodFill(x + 1, y, steps + 1, costMap, visited);
  }
  if (!visited[x - 1]?.[y]) {
    wallFloodFill(x - 1, y, steps + 1, costMap, visited);
  }
  if (!visited[x]?.[y + 1]) {
    wallFloodFill(x, y + 1, steps + 1, costMap, visited);
  }
  if (!visited[x]?.[y - 1]) {
    wallFloodFill(x, y - 1, steps + 1, costMap, visited);
  }
}

function inBounds(x: number, y: number) {
  return x >= 0 && y >= 0 && x < baseGrid.length && y < baseGrid[x].length;
}

function cheatMode(startPosition: CheckPosition): number {
  const gridCosts: number[][] = [];

  for (let x = 0; x < baseGrid.length; x++) {
    gridCosts[x] = [];
    for (let y = 0; y < baseGrid[x].length; y++) {
      gridCosts[x][y] = 999999;
    }
  }

  const queue: CheckPosition[] = [];

  queue.push({
    cost: 0,
    x: startPosition.x,
    y: startPosition.y,
  });

  let totalCheats = 0;

  let current: CheckPosition;
  while (queue.length > 0) {
    current = queue.shift();

    if (current.cost > startPosition.cost + 20) {
      break;
    }

    if (inBounds(current.x, current.y)) {
      // gridCosts[current.x][current.y] = current.cost;

      // console.log(current.cost);

      if (inBounds(current.x + 1, current.y) && gridCosts[current.x + 1][current.y] > current.cost + 1) {
        gridCosts[current.x + 1][current.y] = current.cost;
        queue.push({ x: current.x + 1, y: current.y, cost: current.cost + 1 });
      }
      if (inBounds(current.x - 1, current.y) && gridCosts[current.x - 1][current.y] > current.cost + 1) {
        gridCosts[current.x - 1][current.y] = current.cost;
        queue.push({ x: current.x - 1, y: current.y, cost: current.cost + 1 });
      }
      if (inBounds(current.x, current.y + 1) && gridCosts[current.x][current.y + 1] > current.cost + 1) {
        gridCosts[current.x][current.y + 1] = current.cost;
        queue.push({ x: current.x, y: current.y + 1, cost: current.cost + 1 });
      }
      if (inBounds(current.x, current.y - 1) && gridCosts[current.x][current.y - 1] > current.cost + 1) {
        gridCosts[current.x][current.y - 1] = current.cost;
        queue.push({ x: current.x, y: current.y - 1, cost: current.cost + 1 });
      }

      if (['.', 'E'].includes(baseGrid[current.x][current.y])) {
        // if (startPosition.x === 3 && startPosition.y === 1) {
        //   console.log('found cheats', cheatSheet[current.x][current.y], current.cost, startPosition.cost, baseCost.cost, costModifier);
        // }
        if (cheatSheet[current.x][current.y] + current.cost + startPosition.cost <= baseCost.cost - costModifier) {
          totalCheats++;
        }
      }

      queue.sort((a, b) => a.cost - b.cost);
    }
  }

  return totalCheats;
}

console.log('begin floodFilling');

for (let i = 0; i < baseGrid.length; i++) {
  for (let j = 0; j < baseGrid[i].length; j++) {
    if (baseGrid[i][j] === '#') {
      const floodMap: Record<number, Record<number, number>> = {};
      wallFloodFill(i, j, 1, floodMap);

      wallCheatSheet[i][j] = Object.values(floodMap).flatMap((costsMap) => {
        return Object.values(costsMap);
      });
    }
  }
}

console.log('done floodFilling');

const gridCosts: number[][] = [];

for (let x = 0; x < baseGrid.length; x++) {
  gridCosts[x] = [];
  for (let y = 0; y < baseGrid[x].length; y++) {
    gridCosts[x][y] = Infinity;
  }
}
const startPos = findPosition('S');
const endPos = findPosition('E');

const queue: CheckPosition[] = [];

queue.push({
  cost: 0,
  x: startPos[0],
  y: startPos[1],
});

let wallCheats = 0;

let current: CheckPosition;
let totalCheats = 0;
while (queue.length > 0) {
  current = queue.shift();
  gridCosts[current.x][current.y] = current.cost;

  if (current.x === endPos[0] && current.y === endPos[1]) {
    break;
  }

  // console.log('start cheating');

  totalCheats += cheatMode(current);

  console.log('cheats found', totalCheats);

  if (
    !['#', 'X'].includes(baseGrid[current.x + 1]?.[current.y]) &&
    gridCosts[current.x + 1]?.[current.y] > current.cost
  ) {
    queue.push({ x: current.x + 1, y: current.y, cost: current.cost + 1 });
  }
  if (
    !['#', 'X'].includes(baseGrid[current.x - 1]?.[current.y]) &&
    gridCosts[current.x - 1]?.[current.y] > current.cost
  ) {
    queue.push({ x: current.x - 1, y: current.y, cost: current.cost + 1 });
  }
  if (
    !['#', 'X'].includes(baseGrid[current.x]?.[current.y + 1]) &&
    gridCosts[current.x]?.[current.y + 1] > current.cost
  ) {
    queue.push({ x: current.x, y: current.y + 1, cost: current.cost + 1 });
  }
  if (
    !['#', 'X'].includes(baseGrid[current.x]?.[current.y - 1]) &&
    gridCosts[current.x]?.[current.y - 1] > current.cost
  ) {
    queue.push({ x: current.x, y: current.y - 1, cost: current.cost + 1 });
  }

  queue.sort((a, b) => a.cost - b.cost);
}

console.log(totalCheats);

// 872617 -- too low
// 42875729 -- too high
// 1006850

// let baseCost = solve(baseGrid, false);
//
// let cheatCost = solve(baseGrid, true);
//
// let cheatPaths = 0;
//
// while (cheatCost && cheatCost.cost < baseCost.cost) {
//   if (cheatCost.cost <= baseCost.cost-100) {
//     cheatPaths++;
//     console.log(cheatPaths);
//   } else {
//     console.log('bad path');
//   }
//
//   baseGrid[cheatCost.cheat.x][cheatCost.cheat.y] = 'X';
//
//   cheatCost = solve(baseGrid, true);
// }
//
// console.log(baseCost, cheatPaths);

// for (let i = 0; i < cheatSheet.length; i++) {
//   console.log(cheatSheet[i].map(i => i === 999999999 ? 'X' : i).join(','));
// }

// 7971
// 7042 - too high
// 19
