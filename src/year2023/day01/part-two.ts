import { readFileSync } from 'fs';
import { find, findLast, replace } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

const lines = file.toString().split('\n');
let total = 0;

lines.forEach((line) => {
  line = replace(line, /one/g, 'o1e');
  line = replace(line, /two/g, 't2o');
  line = replace(line, /three/g, 't3e');
  line = replace(line, /four/g, 'f4r');
  line = replace(line, /five/g, 'f5e');
  line = replace(line, /six/g, 's6x');
  line = replace(line, /seven/g, 's7n');
  line = replace(line, /eight/g, 'e8t');
  line = replace(line, /nine/g, 'n9e');
  const firstDigit = find(line as any, (char) => char.match(/\d/));
  const lastDigit = findLast(line as any, (char) => char.match(/\d/));

  console.log(line, firstDigit, lastDigit);

  total += +`${firstDigit}${lastDigit}`;
});

console.log(total); // 54885
