import { readFileSync } from 'fs';
import { sum } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);
const lines = file.toString().split('\n');

type Direction = 'u' | 'r' | 'd' | 'l';

interface Guard {
  x: number;
  y: number;
  direction: Direction;
}

let guard: Guard = {
  x: 0,
  y: 0,
  direction: 'u',
};

function duplicateGrid() {
  return grid.map((row) => [...row]);
}

const grid: ('.' | '#' | '^' | 'X')[][] = lines.map((line, lineIndex) => {
  if (line.includes('^')) {
    guard.x = lineIndex;
    guard.y = line.indexOf('^');
  }

  return line.split('') as ('.' | '#' | '^')[];
});

const mappedNewObstacles: Record<number, number[]> = {};

function createsLoop(frontX: number, frontY: number) {
  if (grid[frontX]?.[frontY] === '.' && !mappedNewObstacles[frontX]?.includes(frontY)) {
    let newGuard = { ...guard };
    const newGrid = duplicateGrid();
    newGrid[frontX][frontY] = '#';
    const traveledPositions: Record<number, Record<number, Direction[]>> = {};

    let iteration = 0;

    while (newGuard.x >= 0 && newGuard.y >= 0 && newGuard.x < newGrid.length && newGuard.y < newGrid[0].length) {
      if (iteration++ >= 200000) {
        return true;
      }

      switch (newGuard.direction) {
        case 'u':
          if (newGrid[newGuard.x - 1]?.[newGuard.y] === '#') {
            if (traveledPositions[newGuard.x]?.[newGuard.y]?.includes(newGuard.direction)) {
              return true;
            } else {
              traveledPositions[newGuard.x] ??= {};
              traveledPositions[newGuard.x][newGuard.y] ??= [];
              traveledPositions[newGuard.x][newGuard.y].push(newGuard.direction);
            }
            newGuard.direction = 'r';
          } else {
            newGuard.x--;
          }
          break;
        case 'r':
          if (newGrid[newGuard.x]?.[newGuard.y + 1] === '#') {
            if (traveledPositions[newGuard.x]?.[newGuard.y]?.includes(newGuard.direction)) {
              return true;
            } else {
              traveledPositions[newGuard.x] ??= {};
              traveledPositions[newGuard.x][newGuard.y] ??= [];
              traveledPositions[newGuard.x][newGuard.y].push(newGuard.direction);
            }
            newGuard.direction = 'd';
          } else {
            newGuard.y++;
          }
          break;
        case 'd':
          if (newGrid[newGuard.x + 1]?.[newGuard.y] === '#') {
            if (traveledPositions[newGuard.x]?.[newGuard.y]?.includes(newGuard.direction)) {
              return true;
            } else {
              traveledPositions[newGuard.x] ??= {};
              traveledPositions[newGuard.x][newGuard.y] ??= [];
              traveledPositions[newGuard.x][newGuard.y].push(newGuard.direction);
            }
            newGuard.direction = 'l';
          } else {
            newGuard.x++;
          }
          break;
        case 'l':
          if (newGrid[newGuard.x]?.[newGuard.y - 1] === '#') {
            if (traveledPositions[newGuard.x]?.[newGuard.y]?.includes(newGuard.direction)) {
              return true;
            } else {
              traveledPositions[newGuard.x] ??= {};
              traveledPositions[newGuard.x][newGuard.y] ??= [];
              traveledPositions[newGuard.x][newGuard.y].push(newGuard.direction);
            }
            newGuard.direction = 'u';
          } else {
            newGuard.y--;
          }
          break;
      }
    }
  }
}

while (guard.x >= 0 && guard.y >= 0 && guard.x < grid.length && guard.y < grid[0].length) {
  switch (guard.direction) {
    case 'u':
      if (grid[guard.x - 1]?.[guard.y] === '#') {
        guard.direction = 'r';
      } else {
        if (createsLoop(guard.x - 1, guard.y)) {
          mappedNewObstacles[guard.x - 1] ??= [];
          mappedNewObstacles[guard.x - 1].push(guard.y);
        }
        guard.x--;
        grid[guard.x][guard.y] = 'X';
      }
      break;
    case 'r':
      if (grid[guard.x]?.[guard.y + 1] === '#') {
        guard.direction = 'd';
      } else {
        if (createsLoop(guard.x, guard.y + 1)) {
          mappedNewObstacles[guard.x] ??= [];
          mappedNewObstacles[guard.x].push(guard.y + 1);
        }
        guard.y++;
        grid[guard.x][guard.y] = 'X';
      }
      break;
    case 'd':
      if (grid[guard.x + 1]?.[guard.y] === '#') {
        guard.direction = 'l';
      } else {
        if (createsLoop(guard.x + 1, guard.y)) {
          mappedNewObstacles[guard.x + 1] ??= [];
          mappedNewObstacles[guard.x + 1].push(guard.y);
        }
        guard.x++;
        grid[guard.x][guard.y] = 'X';
      }
      break;
    case 'l':
      if (grid[guard.x]?.[guard.y - 1] === '#') {
        guard.direction = 'u';
      } else {
        if (createsLoop(guard.x, guard.y - 1)) {
          mappedNewObstacles[guard.x] ??= [];
          mappedNewObstacles[guard.x].push(guard.y - 1);
        }
        guard.y--;
        grid[guard.x][guard.y] = 'X';
      }
      break;
  }
}

console.log(sum(Object.values(mappedNewObstacles).map((arr) => arr.length)));
