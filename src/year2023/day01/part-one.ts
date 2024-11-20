import { readFileSync } from 'fs';
import { find, findLast } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

const lines = file.toString().split('\n');
let total = 0;

lines.forEach((line) => {
  const firstDigit = find(line as any, (char) => char.match(/\d/));
  const lastDigit = findLast(line as any, (char) => char.match(/\d/));

  total += +`${firstDigit}${lastDigit}`;
});

console.log(total); // 54697
