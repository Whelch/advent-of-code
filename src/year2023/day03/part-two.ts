import { readFileSync } from 'fs';
import { compact, uniq } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

const grid = file.toString().split('\n');

let total = 0;

function symbolAroundCoord(x: number, y: number) {
  if (
    (x - 1 >= 0 && !grid[y][x - 1].match(/\d|\./)) ||
    (x + 1 < grid[y].length && !grid[y][x + 1].match(/\d|\./)) ||
    (y - 1 >= 0 && !grid[y - 1][x].match(/\d|\./)) ||
    (y + 1 < grid.length && !grid[y + 1][x].match(/\d|\./)) ||
    (x - 1 >= 0 && y - 1 >= 0 && !grid[y - 1][x - 1].match(/\d|\./)) ||
    (x - 1 >= 0 && y + 1 < grid.length && !grid[y + 1][x - 1].match(/\d|\./)) ||
    (x + 1 < grid[y].length && y - 1 >= 0 && !grid[y - 1][x + 1].match(/\d|\./)) ||
    (x + 1 < grid[y].length && y + 1 < grid.length && !grid[y + 1][x + 1].match(/\d|\./))
  ) {
    return true;
  }
}

/**
 * If a digit is found at this coordinate, move left until we find
 * its begining and return the whole number
 */
function getNumberAt(x: number, y: number): number {
  if (x < 0 || y < 0 || y >= grid.length || x >= grid[y].length) {
    return undefined;
  }

  if (grid[y][x].match(/\d/)) {
    let number = '';
    while (x > 0 && grid[y][x - 1].match(/\d/)) {
      x--;
    }

    return parseInt(grid[y].slice(x));
  }
}

grid.forEach((line, rowIndex) => {
  let next = line.search(/\*/);
  while (next >= 0) {
    const allNumbers = [];

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        allNumbers.push(getNumberAt(next + x, rowIndex + y));
      }
    }

    const reducedAllNumbers = uniq(compact(allNumbers));

    if (reducedAllNumbers.length === 2) {
      total += reducedAllNumbers[0] * reducedAllNumbers[1];
    }

    const newNext = line.slice(next + 1).search(/\*/);

    if (newNext >= 0) {
      next += newNext + 1;
    } else {
      break;
    }
  }
});

console.log(total); // 75519888
