import { readFileSync } from 'fs';
import { chain } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

let grid = chain(file)
  .split('\n')
  .map((line) => line.split('').map((val) => +val))
  .valueOf();

function step1() {
  grid = grid.map((line) => line.map((cell) => Math.max(0, cell) + 1));
}

function findFlashers(): [number, number][] {
  const flashers: [number, number][] = [];
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      if (grid[x][y] > 9) {
        flashers.push([x, y]);
      }
    }
  }

  flashers.forEach(([x, y]) => (grid[x][y] -= 20));

  return flashers;
}

function flash([x, y]: [number, number]) {
  if (x > 0) {
    grid[x - 1][y]++;
    if (y > 0) {
      grid[x - 1][y - 1]++;
    }
    if (y < grid[x].length - 1) {
      grid[x - 1][y + 1]++;
    }
  }

  if (x < grid.length - 1) {
    grid[x + 1][y]++;
    if (y > 0) {
      grid[x + 1][y - 1]++;
    }
    if (y < grid[x].length - 1) {
      grid[x + 1][y + 1]++;
    }
  }

  if (y > 0) {
    grid[x][y - 1]++;
  }
  if (y < grid[x].length - 1) {
    grid[x][y + 1]++;
  }
}

let flashes = 0;

for (let i = 0; i < 100; i++) {
  step1();

  let flashers = [];
  do {
    flashers = findFlashers();
    flashers.forEach(flash);
    flashes += flashers.length;
  } while (flashers.length > 0);
}

console.log(flashes);
