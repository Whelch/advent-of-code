import { readFileSync } from 'fs';
import { chain, forEach, setWith, unzip } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

type Vector = [number, number, number];

function parseLine(line: string): [boolean, Vector, Vector] {
  let [instruction, coordinates] = line.split(' ') as ['on' | 'off', string];

  coordinates = coordinates.replace(/x=/, '').replace(/y=/, '').replace(/z=/, '');

  const ranges = coordinates.split(',').map((coord) => coord.split('..').map((val) => +val));

  return [instruction === 'on', ...(unzip(ranges) as [Vector, Vector])];
}

let procedures = chain(file).split('\n').map(parseLine).valueOf();

const cuboid: Record<string, Record<string, Record<string, boolean>>> = {};

procedures.forEach(([on, [x0, y0, z0], [x1, y1, z1]]) => {
  for (let x = x0; x <= x1; x++) {
    for (let y = y0; y <= y1; y++) {
      for (let z = z0; z <= z1; z++) {
        setWith(cuboid, [x, y, z], on, Object);
      }
    }
  }
});

let answer = 0;

forEach(cuboid, (yPositions) => {
  forEach(yPositions, (zPositions) => {
    forEach(zPositions, (on) => {
      if (on) {
        answer++;
      }
    });
  });
});

console.log(answer);
