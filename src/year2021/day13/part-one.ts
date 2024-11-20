import { readFileSync } from 'fs';
import { chain, isArray } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

let [coordStrings, instructions] = chain(file)
  .split('\n\n')
  .map((line) => line.split('\n'))
  .valueOf();

const coords: [number, number][] = coordStrings.map((coord) => coord.split(',').map((val) => +val) as [number, number]);
const folds: [string, string][] = chain(instructions)
  .map((line) => line.split(' ')[2])
  .map((foldLine) => foldLine.split('=') as [string, string])
  .valueOf();

let grid: boolean[][] = [];

function addDot([x, y]: [number, number]) {
  if (!grid[x]) {
    grid[x] = [];
  }
  grid[x][y] = true;
}

coords.forEach(addDot);

function xFold(fold: number) {
  for (let x = fold + 1; x < grid.length; x++) {
    if (isArray(grid[x])) {
      grid[x].forEach((val, y) => {
        if (val) {
          addDot([2 * fold - x, y]);
        }
      });
    }
  }

  grid = grid.slice(0, fold);
}

function yFold(fold: number) {
  for (let x = 0; x < grid.length; x++) {
    if (isArray(grid[x])) {
      for (let y = fold + 1; y < grid[x].length; y++) {
        if (grid[x][y]) {
          addDot([x, 2 * fold - y]);
        }
      }

      grid[x] = grid[x].slice(0, fold);
    }
  }
}

function fold([direction, line]: [string, string]) {
  switch (direction) {
    case 'x':
      xFold(+line);
      break;
    case 'y':
      yFold(+line);
      break;
  }
}

fold(folds[0]);

const answer = chain(grid)
  .flatten()
  .filter((val) => val)
  .size()
  .valueOf();

console.log(answer);
