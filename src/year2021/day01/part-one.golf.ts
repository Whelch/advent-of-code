import { readFileSync } from 'fs';
import { chain } from 'lodash';

console.log(
  chain(readFileSync(`${__dirname}/input.txt`))
    .split('\n')
    .map((v) => +v)
    .filter((v, i, l) => l[i] > l[i - 1])
    .size()
    .valueOf(),
);
