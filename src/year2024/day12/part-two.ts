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

function scout(x: number, y: number, char: string, plot: Plot) {
  const visitedChar = char.toLocaleLowerCase();
  if (grid[x]?.[y] === char) {
    plot.area++;
    grid[x][y] = visitedChar;

    scout(x, y - 1, char, plot);
    scout(x, y + 1, char, plot);
    scout(x - 1, y, char, plot);
    scout(x + 1, y, char, plot);

    const topInRegion = [char, visitedChar].includes(grid[x - 1]?.[y]);
    const rightInRegion = [char, visitedChar].includes(grid[x]?.[y + 1]);
    const bottomInRegion = [char, visitedChar].includes(grid[x + 1]?.[y]);
    const leftInRegion = [char, visitedChar].includes(grid[x]?.[y - 1]);

    const topRightInRegion = [char, visitedChar].includes(grid[x - 1]?.[y + 1]);
    const topLeftInRegion = [char, visitedChar].includes(grid[x - 1]?.[y - 1]);
    const bottomRightInRegion = [char, visitedChar].includes(grid[x + 1]?.[y + 1]);
    const bottomLeftInRegion = [char, visitedChar].includes(grid[x + 1]?.[y - 1]);

    // Inside corners
    if (!topInRegion) {
      if (!leftInRegion) {
        plot.perimeter++;
      }
      if (!rightInRegion) {
        plot.perimeter++;
      }
    }
    if (!bottomInRegion) {
      if (!leftInRegion) {
        plot.perimeter++;
      }
      if (!rightInRegion) {
        plot.perimeter++;
      }
    }

    // Outside corners
    if (topInRegion && leftInRegion && !topLeftInRegion) {
      plot.perimeter++;
    }
    if (topInRegion && rightInRegion && !topRightInRegion) {
      plot.perimeter++;
    }
    if (bottomInRegion && leftInRegion && !bottomLeftInRegion) {
      plot.perimeter++;
    }
    if (bottomInRegion && rightInRegion && !bottomRightInRegion) {
      plot.perimeter++;
    }
  }
}

for (let x = 0; x < grid.length; x++) {
  for (let y = 0; y < grid[x].length; y++) {
    if (grid[x][y] !== grid[x][y].toLocaleLowerCase()) {
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
