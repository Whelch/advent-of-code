import { readFileSync } from 'fs';
import { chain } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

const grid = chain(file)
  .split('\n')
  .map((line) => line.split('').map((val) => +val))
  .valueOf();

let count = 0;

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
      count += 1 + checkHeight;
    }
  }
}

console.log(count);
