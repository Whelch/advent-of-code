import { readFileSync } from 'fs';

const file = readFileSync(`${__dirname}/input.txt`);
const baseGrid: string[][] = file
  .toString()
  .split('\n')
  .map((line) => line.split(''));

function findPosition(char: string) {
  for (let x = 0; x < baseGrid.length; x++) {
    for (let y = 0; y < baseGrid[x].length; y++) {
      if (baseGrid[x][y] === char) {
        return [x, y];
      }
    }
  }
}

const baseStartPos = findPosition('S');
const baseEndPos = findPosition('E');

const costModifier = 100;
const cheatTime = 20;

interface Position {
  x: number;
  y: number;
}

interface CheckPosition {
  position: Position;
  cost: number;
}

const cheatSheet: number[][] = [];

for (let x = 0; x < baseGrid.length; x++) {
  cheatSheet[x] = [];
  for (let y = 0; y < baseGrid[x].length; y++) {
    cheatSheet[x][y] = Infinity;
  }
}

function inBounds(x: number, y: number) {
  return x >= 0 && y >= 0 && x < baseGrid.length && y < baseGrid[x].length;
}

function travel(position: Position, operation?: Function): number {
  let previousPosition = position;
  let steps = 0;
  while (baseGrid[position.x]?.[position.y] !== 'E') {
    operation?.(position, steps);

    if (position.x + 1 !== previousPosition.x && baseGrid[position.x + 1][position.y] !== '#') {
      previousPosition = position;
      position = { x: position.x + 1, y: position.y };
      steps++;
    } else if (position.x - 1 !== previousPosition.x && baseGrid[position.x - 1][position.y] !== '#') {
      previousPosition = position;
      position = { x: position.x - 1, y: position.y };
      steps++;
    } else if (position.y + 1 !== previousPosition.y && baseGrid[position.x][position.y + 1] !== '#') {
      previousPosition = position;
      position = { x: position.x, y: position.y + 1 };
      steps++;
    } else if (position.y - 1 !== previousPosition.y && baseGrid[position.x][position.y - 1] !== '#') {
      previousPosition = position;
      position = { x: position.x, y: position.y - 1 };
      steps++;
    }
  }

  operation?.(position, steps);

  return steps;
}

const baseCost = travel({ x: baseStartPos[0], y: baseStartPos[1] });

travel({ x: baseStartPos[0], y: baseStartPos[1] }, (position: Position, steps) => {
  cheatSheet[position.x][position.y] = baseCost - steps;
});

function countCheats(position: Position, steps: number): number {
  const visited: Record<number, Record<number, boolean>> = {};
  const queue: CheckPosition[] = [
    {
      position,
      cost: steps,
    },
  ];
  let cheatCount = 0;

  while (queue.length) {
    const current = queue.shift();

    if (current.cost > steps + cheatTime) {
      break;
    }

    if (inBounds(current.position.x, current.position.y)) {
      if (cheatSheet[current.position.x][current.position.y] + current.cost <= baseCost - costModifier) {
        cheatCount++;
      }

      if (
        inBounds(current.position.x + 1, current.position.y) &&
        !visited[current.position.x + 1]?.[current.position.y]
      ) {
        visited[current.position.x + 1] ??= {};
        visited[current.position.x + 1][current.position.y] = true;
        queue.push({
          position: { x: current.position.x + 1, y: current.position.y },
          cost: current.cost + 1,
        });
      }
      if (
        inBounds(current.position.x - 1, current.position.y) &&
        !visited[current.position.x - 1]?.[current.position.y]
      ) {
        visited[current.position.x - 1] ??= {};
        visited[current.position.x - 1][current.position.y] = true;
        queue.push({
          position: { x: current.position.x - 1, y: current.position.y },
          cost: current.cost + 1,
        });
      }
      if (
        inBounds(current.position.x, current.position.y + 1) &&
        !visited[current.position.x]?.[current.position.y + 1]
      ) {
        visited[current.position.x] ??= {};
        visited[current.position.x][current.position.y + 1] = true;
        queue.push({
          position: { x: current.position.x, y: current.position.y + 1 },
          cost: current.cost + 1,
        });
      }
      if (
        inBounds(current.position.x, current.position.y - 1) &&
        !visited[current.position.x]?.[current.position.y - 1]
      ) {
        visited[current.position.x] ??= {};
        visited[current.position.x][current.position.y - 1] = true;
        queue.push({
          position: { x: current.position.x, y: current.position.y - 1 },
          cost: current.cost + 1,
        });
      }

      queue.sort((a, b) => a.cost - b.cost);
    }
  }

  return cheatCount;
}

let numShortcuts = 0;

travel({ x: baseStartPos[0], y: baseStartPos[1] }, (position: Position, steps) => {
  console.log(position, steps);
  numShortcuts += countCheats(position, steps);
});

console.log(numShortcuts);
