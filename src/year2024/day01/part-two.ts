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

const occurrences = leftSorted.map((left) => rightList.filter((right) => right === left).length);

const val = leftSorted.map((left, index) => left * occurrences[index]);

console.log(sum(val));
