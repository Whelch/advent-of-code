import { readFileSync } from 'fs';
import { chain, constant, times } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

let fishies = times(9, constant(0));

const ages = chain(file)
  .split(',')
  .map((val) => +val)
  .valueOf();

ages.forEach((age) => fishies[age]++);

for (let i = 0; i < 80; i++) {
  fishies = [...fishies.slice(1), fishies[0]];
  fishies[6] += fishies[8];
}

const answer = chain(fishies).sum().valueOf();

console.log(answer);
