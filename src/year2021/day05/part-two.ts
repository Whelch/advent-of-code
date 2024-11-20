import { readFileSync } from 'fs';
import { chain } from 'lodash';
import { pointsFromLine } from './points-from-line';

const file = readFileSync(`${__dirname}/input.txt`);

const answer = chain(file)
  .split('\n')
  .map((line) => line.split(' -> ').map((coord) => coord.split(',').map((val) => +val)))
  .map(pointsFromLine)
  .flatten()
  .countBy()
  .values()
  .without(1)
  .size()
  .valueOf();

console.log(answer);
