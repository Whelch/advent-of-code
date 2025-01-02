import { readFileSync } from 'fs';

const file = readFileSync(`${__dirname}/input.txt`);
const baseGrid: string[][] = file
  .toString()
  .split('\n')
  .map((line) => line.split(''));

const baseStartPos = findPosition('S');

interface Position {
  x: number;
  y: number;
}

interface CheckPosition {
  x: number;
  y: number;
  cost: number;
  cheat: CheckPosition;
}

const cheatSheet: number[][] = [];

for (let x = 0; x < baseGrid.length; x++) {
  cheatSheet[x] = [];
  for (let y = 0; y < baseGrid[x].length; y++) {
    cheatSheet[x][y] = Infinity;
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

function solve(grid: string[][], cheats: boolean): CheckPosition {
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
    cheat: undefined,
  });

  let current: CheckPosition;
  while (queue.length > 0) {
    current = queue.shift();
    gridCosts[current.x][current.y] = current.cost;

    if (current.x === endPos[0] && current.y === endPos[1]) {
      break;
    }

    if (current.cheat) {
      if (cheatSheet[current.x][current.y] !== Infinity) {
        current.cost = current.cost + cheatSheet[current.x][current.y];
        current.x = endPos[0];
        current.y = endPos[1];
        queue.push(current);
        queue.sort((a, b) => a.cost - b.cost);
        continue;
      }
    }

    if (grid[current.x][current.y] === '#') {
      current.cheat = current;
    }

    if (
      !['#', 'X'].includes(grid[current.x + 1]?.[current.y]) &&
      gridCosts[current.x + 1]?.[current.y] > current.cost
    ) {
      queue.push({ x: current.x + 1, y: current.y, cost: current.cost + 1, cheat: current.cheat });
    }
    if (
      !['#', 'X'].includes(grid[current.x - 1]?.[current.y]) &&
      gridCosts[current.x - 1]?.[current.y] > current.cost
    ) {
      queue.push({ x: current.x - 1, y: current.y, cost: current.cost + 1, cheat: current.cheat });
    }
    if (
      !['#', 'X'].includes(grid[current.x]?.[current.y + 1]) &&
      gridCosts[current.x]?.[current.y + 1] > current.cost
    ) {
      queue.push({ x: current.x, y: current.y + 1, cost: current.cost + 1, cheat: current.cheat });
    }
    if (
      !['#', 'X'].includes(grid[current.x]?.[current.y - 1]) &&
      gridCosts[current.x]?.[current.y - 1] > current.cost
    ) {
      queue.push({ x: current.x, y: current.y - 1, cost: current.cost + 1, cheat: current.cheat });
    }

    if (cheats && !current.cheat) {
      if (grid[current.x + 1]?.[current.y] === '#' && gridCosts[current.x + 1]?.[current.y] > current.cost) {
        queue.push({ x: current.x + 1, y: current.y, cost: current.cost + 1, cheat: current.cheat });
      }
      if (grid[current.x - 1]?.[current.y] === '#' && gridCosts[current.x - 1]?.[current.y] > current.cost) {
        queue.push({ x: current.x - 1, y: current.y, cost: current.cost + 1, cheat: current.cheat });
      }
      if (grid[current.x]?.[current.y + 1] === '#' && gridCosts[current.x]?.[current.y + 1] > current.cost) {
        queue.push({ x: current.x, y: current.y + 1, cost: current.cost + 1, cheat: current.cheat });
      }
      if (grid[current.x]?.[current.y - 1] === '#' && gridCosts[current.x]?.[current.y - 1] > current.cost) {
        queue.push({ x: current.x, y: current.y - 1, cost: current.cost + 1, cheat: current.cheat });
      }
    }

    queue.sort((a, b) => a.cost - b.cost);
  }

  if (current.x !== endPos[0] || current.y !== endPos[1]) {
    return null;
  } else {
    return current;
  }
}

baseGrid[baseStartPos[0]][baseStartPos[1]] = '.';
for (let i = 0; i < baseGrid.length; i++) {
  for (let j = 0; j < baseGrid[i].length; j++) {
    if (baseGrid[i][j] === '.') {
      baseGrid[i][j] = 'S';
      const solution = solve(baseGrid, false);
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

let baseCost = solve(baseGrid, false);

let cheatCost = solve(baseGrid, true);

let cheatPaths = 0;

while (cheatCost && cheatCost.cost < baseCost.cost) {
  if (cheatCost.cost <= baseCost.cost - 100) {
    cheatPaths++;
    console.log(cheatPaths);
  } else {
    console.log('bad path');
  }

  baseGrid[cheatCost.cheat.x][cheatCost.cheat.y] = 'X';

  cheatCost = solve(baseGrid, true);
}

console.log(baseCost, cheatPaths);

// for (let i = 0; i < cheatSheet.length; i++) {
//   console.log(cheatSheet[i].map(i => i === 999999999 ? 'X' : i).join(','));
// }

// 7971
// 7042 - too high
// 19
