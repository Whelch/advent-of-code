import { readFileSync } from 'fs';
import { chain } from 'lodash';
import { pointsFromLine } from './points-from-line';

const file = readFileSync(`${__dirname}/input.txt`);

const answer = chain(file)
  .split('\n')
  .map((line) => line.split(' -> ').map((coord) => coord.split(',').map((val) => +val)))
  .reject(([[x0, y0], [x1, y1]]) => x0 !== x1 && y0 !== y1)
  .map(pointsFromLine)
  .flatten()
  .countBy()
  .values()
  .without(1)
  .size()
  .valueOf();

console.log(answer);
