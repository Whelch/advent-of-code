import { readFileSync } from 'fs';
import { sum } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);
const [towelLines, designLines]: string[] = file.toString().split('\n\n');

const towels = towelLines.split(',').map((towel) => {
  return towel.trim();
});
const designs = designLines.split('\n');

console.log(designs);

const memo: Record<string, number> = {};

function findDesign(design: string): number {
  if (memo[design] !== undefined) {
    return memo[design];
  }
  if (design === '') {
    return 1;
  }
  let foundIndex = towels.findIndex((towel) => design.startsWith(towel));

  let count = 0;
  while (foundIndex >= 0) {
    // console.log('foundIndex: ', foundIndex, design);
    const remainingDesign = design.slice(towels[foundIndex].length);
    const val = findDesign(remainingDesign);
    count += val;

    memo[remainingDesign] = val;

    foundIndex = towels.findIndex((towel, index) => {
      return index > foundIndex && design.startsWith(towel);
    });
  }

  return count;
}

const possibleDesigns = designs.map((design) => {
  console.log('finding design: ', design);
  return findDesign(design);
});

console.log(sum(possibleDesigns));
