import { readFileSync } from 'fs';
import { chain } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

const result = chain(file)
  .split('\n')
  .map((val) => +val)
  .filter((val, index, list) => list[index] > list[index - 1])
  .size()
  .valueOf();

console.log(result);
