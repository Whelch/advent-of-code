import { readFileSync } from 'fs';
import { sum } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);
const lines = file.toString().split('\n');

let enabled = true;
const productSums = lines.map((line) => {
  const matches = line.matchAll(/mul\(\d\d?\d?,\d\d?\d?\)|do\(\)|don't\(\)/g);

  let total = 0;

  for (const match of matches) {
    if (match[0] === 'do()') {
      enabled = true;
    } else if (match[0] === "don't()") {
      enabled = false;
    } else {
      const [left, right] = match[0]
        .replace('mul(', '')
        .replace(')', '')
        .split(',')
        .map((val) => parseInt(val, 10));
      if (enabled) {
        total += left * right;
      }
    }
  }

  return total;
});

console.log(sum(productSums));
