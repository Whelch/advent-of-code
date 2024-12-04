import { readFileSync } from 'fs';

const file = readFileSync(`${__dirname}/input.txt`);
const lines = file.toString().split('\n');

let count = 0;

for (let x = 1; x < lines.length - 1; x++) {
  for (let y = 1; y < lines[x].length - 1; y++) {
    if (lines[x][y] === 'A') {
      count += xmasCounts(x, y);
    }
  }
}

function xmasCounts(x: number, y: number): number {
  let count = 0;
  const stringX1 = `${lines[x - 1][y - 1]}${lines[x][y]}${lines[x + 1][y + 1]}`;
  const stringX2 = `${lines[x - 1][y + 1]}${lines[x][y]}${lines[x + 1][y - 1]}`;

  if ((stringX1 === 'MAS' || stringX1 === 'SAM') && (stringX2 === 'MAS' || stringX2 === 'SAM')) {
    count++;
  }

  return count;
}

console.log(count);
