import { readFileSync } from 'fs';
import { sum } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);
let stones: Record<number, number> = file
  .toString()
  .split(' ')
  .map(Number)
  .reduce<Record<number, number>>((agg, num) => {
    agg[num] ??= 0;
    agg[num]++;
    return agg;
  }, {});

for (let i = 0; i < 75; i++) {
  const newStones: Record<number, number> = [];
  Object.entries(stones).forEach(([numString, count]) => {
    const num = +numString;
    if (num === 0) {
      newStones[1] ??= 0;
      newStones[1] += count;
    } else if (numString.length % 2 === 0) {
      let left = numString.substring(0, numString.length / 2);
      newStones[+left] ??= 0;
      newStones[+left] += count;

      let right = numString.substring(numString.length / 2);
      newStones[+right] ??= 0;
      newStones[+right] += count;
    } else {
      newStones[num * 2024] ??= 0;
      newStones[num * 2024] += count;
    }
  });

  stones = newStones;
}

console.log(sum(Object.values(stones)));
