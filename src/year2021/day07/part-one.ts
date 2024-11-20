import { readFileSync } from 'fs';
import { chain, sum } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

const positions = chain(file)
  .split(',')
  .map((val) => +val)
  .valueOf();

const frequencyMap = chain(positions).countBy().valueOf();

const values = Object.keys(frequencyMap).map((val) => +val);
const counts = Object.values(frequencyMap);

let lastSum = chain(positions)
  .map((val) => val - values[0])
  .sum()
  .valueOf();

let nextSum = lastSum;
let index = 1;

while (nextSum <= lastSum) {
  lastSum = nextSum;

  const change = values[index] - values[index - 1];
  nextSum = lastSum + (sum(counts.slice(0, index)) - sum(counts.slice(index))) * change;

  index++;
}

console.log(lastSum);
