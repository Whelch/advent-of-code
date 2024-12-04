import { readFileSync } from 'fs';

const file = readFileSync(`${__dirname}/input.txt`);
const lines = file.toString().split('\n');

let count = 0;

for (let x = 0; x < lines.length; x++) {
  for (let y = 0; y < lines[x].length; y++) {
    if (lines[x][y] === 'X') {
      count += xmasCounts(x, y);
    }
  }
}

function xmasCounts(x: number, y: number): number {
  let count = 0;
  if (x >= 3) {
    if (lines[x - 1][y] === 'M' && lines[x - 2][y] === 'A' && lines[x - 3][y] === 'S') {
      count++;
    }
    if (y >= 3) {
      if (lines[x - 1][y - 1] === 'M' && lines[x - 2][y - 2] === 'A' && lines[x - 3][y - 3] === 'S') {
        count++;
      }
    }
    if (y + 3 < lines[x].length) {
      if (lines[x - 1][y + 1] === 'M' && lines[x - 2][y + 2] === 'A' && lines[x - 3][y + 3] === 'S') {
        count++;
      }
    }
  }
  if (x + 3 < lines.length) {
    if (lines[x + 1][y] === 'M' && lines[x + 2][y] === 'A' && lines[x + 3][y] === 'S') {
      count++;
    }
    if (y >= 3) {
      if (lines[x + 1][y - 1] === 'M' && lines[x + 2][y - 2] === 'A' && lines[x + 3][y - 3] === 'S') {
        count++;
      }
    }
    if (y + 3 < lines[x].length) {
      if (lines[x + 1][y + 1] === 'M' && lines[x + 2][y + 2] === 'A' && lines[x + 3][y + 3] === 'S') {
        count++;
      }
    }
  }
  if (y >= 3) {
    if (lines[x][y - 1] === 'M' && lines[x][y - 2] === 'A' && lines[x][y - 3] === 'S') {
      count++;
    }
  }
  if (y + 3 < lines[x].length) {
    if (lines[x][y + 1] === 'M' && lines[x][y + 2] === 'A' && lines[x][y + 3] === 'S') {
      count++;
    }
  }
  return count;
}

console.log(count);
