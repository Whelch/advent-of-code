import { readFileSync } from 'fs';

const file = readFileSync(`${__dirname}/input.txt`);
const grid = file
  .toString()
  .split('\n')
  .map((line) => line.split('').map(Number));

let sum = 0;

function recursion(x: number, y: number, height: number) {
  if (x < 0 || y < 0 || x >= grid.length || y >= grid[x].length || grid[x][y] !== height) {
    return 0;
  }

  if (height === 9) {
    return 1;
  } else {
    return (
      recursion(x + 1, y, height + 1) +
      recursion(x, y + 1, height + 1) +
      recursion(x - 1, y, height + 1) +
      recursion(x, y - 1, height + 1)
    );
  }
}

for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[i].length; j++) {
    if (grid[i][j] === 0) {
      sum += recursion(i, j, 0);
    }
  }
}

console.log(sum);
