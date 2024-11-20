import { readFileSync } from 'fs';
import { chain } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

const inputs = chain(file)
  .split('\n')
  .map((val) => val.split('').map((val) => +val || -1))
  .valueOf();

let mostFrequent = inputs;
let index = 0;
while (mostFrequent.length > 1) {
  const frequency =
    chain(mostFrequent)
      .map((bits) => bits[index])
      .sum()
      .valueOf() || 1;

  mostFrequent = chain(mostFrequent)
    .filter((val) => Math.sign(val[index]) === Math.sign(frequency))
    .valueOf();
  index++;
}

let leastFrequent = inputs;
index = 0;
while (leastFrequent.length > 1) {
  const frequency =
    chain(leastFrequent)
      .map((bits) => bits[index])
      .sum()
      .valueOf() || 1;

  const newLeastFrequent = chain(leastFrequent)
    .filter((val) => Math.sign(val[index]) !== Math.sign(frequency))
    .valueOf();

  if (newLeastFrequent.length) {
    leastFrequent = newLeastFrequent;
  }

  index++;
}

const ogr = parseInt(
  chain(mostFrequent)
    .flatten()
    .map((bit) => (bit > 0 ? '1' : '0'))
    .join('')
    .valueOf(),
  2,
);

const co2sr = parseInt(
  chain(leastFrequent)
    .flatten()
    .map((bit) => (bit > 0 ? '1' : '0'))
    .join('')
    .valueOf(),
  2,
);

console.log(ogr, co2sr, mostFrequent, leastFrequent);

console.log(ogr * co2sr);

// 3846106
