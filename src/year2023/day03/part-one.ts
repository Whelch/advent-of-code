import { readFileSync } from 'fs';

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

grid.forEach((line, rowIndex) => {
  let next = line.search(/\d/);
  while (next >= 0) {
    const number = parseInt(line.slice(next));
    const len = number.toString().length;

    for (let i = 0; i < len; i++) {
      if (symbolAroundCoord(next + i, rowIndex)) {
        total += number;
        break;
      }
    }

    const newNext = line.slice(next + len).search(/\d/);

    if (newNext >= 0) {
      next += len + newNext;
    } else {
      break;
    }
  }
});

console.log(total); // 520019
