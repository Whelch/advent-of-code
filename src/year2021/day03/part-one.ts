import { readFileSync } from 'fs';
import { chain, sum } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

const answer = chain(file)
  .split('\n')
  .map((val) => val.split('').map((bit) => +bit || -1))
  .unzip()
  .map((bits) => sum(bits))
  .map((bit) => (bit > 0 ? ['1', '0'] : ['0', '1']))
  .unzip()
  .map((bitRay) => parseInt(bitRay.join(''), 2))
  .reduce((prev, curr) => prev * curr)
  .valueOf();

console.log(answer);
