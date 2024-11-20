import { readFileSync } from 'fs';
import { chain, forEach, get, setWith } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

enum Space {
  East = '>',
  South = 'v',
  Empty = '.',
}

const grid: Space[][] = chain(file)
  .split('\n')
  .map((line) => line.split('') as Space[])
  .valueOf();

const maxY = grid.length;
const maxX = grid[0].length;

function printMap(map: Record<string, Record<string, Space>>) {
  for (let y = 0; y <= maxY; y++) {
    let str = '';
    for (let x = 0; x < maxX; x++) {
      str += get(map, [x, y], Space.Empty);
    }
    console.log(str);
  }
  console.log('\n');
}

/**
 * {
 *   xCoord: {
 *     yCoord: Space // '>' 'v' '.'
 *   }
 * }
 */
let map: Record<string, Record<string, Space>> = {};

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] !== Space.Empty) {
      setWith(map, [x, y], grid[y][x], Object);
    }
  }
}

printMap(map);

let didSomething = true;

let iteration = 0;

while (didSomething) {
  iteration++;
  didSomething = false;

  if (iteration % 1000 === 0) {
    console.log(`Iteration ${iteration}`);
    printMap(map);
  }

  let newMap: Record<string, Record<string, Space>> = {};
  forEach(map, (yCoords, x) => {
    forEach(yCoords, (space, y) => {
      if (space === Space.East) {
        const nextX = (+x + 1) % maxX;

        if (get(map, [nextX, y], Space.Empty) === Space.Empty) {
          setWith(newMap, [nextX, y], space, Object);
          didSomething = true;
        } else {
          setWith(newMap, [x, y], space, Object);
        }
      } else {
        setWith(newMap, [x, y], space, Object);
      }
    });
  });

  map = newMap;
  newMap = {};

  forEach(map, (yCoords, x) => {
    forEach(yCoords, (space, y) => {
      if (space === Space.South) {
        const nextY = (+y + 1) % maxY;

        if (get(map, [x, nextY], Space.Empty) === Space.Empty) {
          setWith(newMap, [x, nextY], space, Object);
          didSomething = true;
        } else {
          setWith(newMap, [x, y], space, Object);
        }
      } else {
        setWith(newMap, [x, y], space, Object);
      }
    });
  });

  map = newMap;
}

console.log(iteration);
