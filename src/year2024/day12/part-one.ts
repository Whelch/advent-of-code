import { readFileSync } from 'fs';
import { sum } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);
const grid: string[][] = file
  .toString()
  .split('\n')
  .map((line) => line.split(''));

interface Plot {
  area: number;
  perimeter: number;
}

const plots = [];

function scout(x: number, y: number, char: string, plot: Plot, visited: Record<number, number[]> = {}) {
  if (grid[x]?.[y] === char) {
    plot.area++;
    grid[x][y] = '-';

    visited[x] ??= [];
    visited[x].push(y);

    scout(x, y - 1, char, plot, visited);
    scout(x, y + 1, char, plot, visited);
    scout(x - 1, y, char, plot, visited);
    scout(x + 1, y, char, plot, visited);
  } else if (!visited[x]?.includes(y)) {
    plot.perimeter++;
  }
}

for (let x = 0; x < grid.length; x++) {
  for (let y = 0; y < grid[x].length; y++) {
    if (grid[x][y] !== '-') {
      const plot = {
        area: 0,
        perimeter: 0,
      };
      scout(x, y, grid[x][y], plot);
      plots.push(plot);
    }
  }
}

console.log(sum(plots.map((plot) => plot.area * plot.perimeter)));
