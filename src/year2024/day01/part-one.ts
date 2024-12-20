import { readFileSync } from 'fs';
import { sum } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

const lines = file.toString().split('\n');
const pairs = lines.map((line) => line.split(/\s+/));

const leftList = [];
const rightList = [];
pairs.forEach(([left, right]) => {
  leftList.push(left);
  rightList.push(right);
});

const leftSorted = leftList.toSorted((a, b) => a - b);
const rightSorted = rightList.toSorted((a, b) => a - b);

const diffs = leftSorted.map((left, index) => {
  return Math.abs(left - rightSorted[index]);
});

console.log(sum(diffs));
