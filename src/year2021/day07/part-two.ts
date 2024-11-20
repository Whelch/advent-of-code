import { readFileSync } from 'fs';
import { chain } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

const positions = chain(file)
  .split(',')
  .map((val) => +val)
  .valueOf();

let min = chain(positions).min().valueOf();

const max = chain(positions).max().valueOf();

let costs: number[] = [];

while (min < max) {
  const test = chain(positions)
    .map((val) => {
      const dist = Math.abs(min - val);
      return (Math.pow(dist, 2) + dist) / 2;
    })
    .sum()
    .valueOf();

  costs.push(test);
  min++;
}

console.log(Math.min(...costs));
