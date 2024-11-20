import { readFileSync } from 'fs';
import { chain } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

const answer = chain(file)
  .split('\n')
  .map((line) => line.split(' | ')[1])
  .map((outputs) => outputs.split(' '))
  .flatten()
  .map((digit) => digit.length)
  .without(0, 1, 5, 6, 8, 9)
  .size()
  .valueOf();

console.log(answer);
