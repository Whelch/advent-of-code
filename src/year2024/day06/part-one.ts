import { readFileSync } from 'fs';
import { sum } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);
const lines = file.toString().split('\n');

let pos = [0, 0];

const grid: ('.' | '#' | '^' | 'X')[][] = lines.map((line, lineIndex) => {
  if (line.includes('^')) {
    pos = [lineIndex, line.indexOf('^')];
  }

  return line.split('') as ('.' | '#' | '^')[];
});

let steps = 1;
let facing: 'r' | 'u' | 'd' | 'l' = 'u';

while (pos[0] >= 0 && pos[1] >= 0 && pos[1] < grid.length && pos[1] < grid[0].length) {
  grid[pos[0]][pos[1]] = 'X';

  switch (facing) {
    case 'u':
      if (grid[pos[0] - 1][pos[1]] === '#') {
        facing = 'r';
        steps--;
      } else {
        pos[0]--;
      }
      break;
    case 'r':
      if (grid[pos[0]][pos[1] + 1] === '#') {
        facing = 'd';
        steps--;
      } else {
        pos[1]++;
      }
      break;
    case 'd':
      if (grid[pos[0] + 1][pos[1]] === '#') {
        facing = 'l';
        steps--;
      } else {
        pos[0]++;
      }
      break;
    case 'l':
      if (grid[pos[0]][pos[1] - 1] === '#') {
        facing = 'u';
        steps--;
      } else {
        pos[1]--;
      }
      break;
  }

  steps++;
}

const Xs = grid.map((row) => row.filter((cell) => cell === 'X').length);

console.log(sum(Xs));
