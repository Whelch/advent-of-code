import { readFileSync } from 'fs';
import { sum } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);
const lines = file.toString().split('\n');

const productSums = lines.map((line) => {
  const matches = line.matchAll(/mul\(\d\d?\d?,\d\d?\d?\)/g);

  let total = 0;

  for (const match of matches) {
    const [left, right] = match[0]
      .replace('mul(', '')
      .replace(')', '')
      .split(',')
      .map((val) => parseInt(val, 10));
    total += left * right;
  }

  return total;
});

console.log(sum(productSums));
