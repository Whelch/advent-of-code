import { readFileSync } from 'fs';
import { chain, forEach } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

let [initialPolymer, allPairs] = chain(file).split('\n\n').valueOf();

const [inputs, outputs] = chain(allPairs)
  .split('\n')
  .map((line) => line.split(' -> ') as [string, string])
  .unzip()
  .valueOf();

/**
 * Example:
 * {
 *   NA: 0,
 *   KK: 0,
 *   TV: 0,
 * }
 */
let polymerCounts: Record<string, number> = chain(inputs)
  .reduce(
    (agg, curr) => ({
      ...agg,
      [curr]: 0,
    }),
    {},
  )
  .valueOf();

/**
 * Example:
 * {
 *   NA: 'A',
 *   KK: 'T',
 *   TV: 'S',
 * }
 */
const polymerMaps: Record<string, string> = chain(inputs)
  .reduce(
    (agg, curr, index) => ({
      ...agg,
      [curr]: outputs[index],
    }),
    {},
  )
  .valueOf();

for (let i = 0; i < initialPolymer.length - 1; i++) {
  const subString: string = initialPolymer.slice(i, i + 2);
  if (!polymerCounts[subString]) {
    polymerCounts[subString] = 0;
  }
  polymerCounts[subString]++;
}

for (let cycle = 0; cycle < 40; cycle++) {
  const nextIteration = {
    ...polymerCounts,
  };

  forEach(polymerCounts, (count: number, polymer: string) => {
    if (polymerMaps[polymer]) {
      const polymer1 = polymer[0] + polymerMaps[polymer];
      const polymer2 = polymerMaps[polymer] + polymer[1];

      nextIteration[polymer1] += count;
      nextIteration[polymer2] += count;
      nextIteration[polymer] -= count;
    }
  });

  polymerCounts = nextIteration;
}

const counts = chain(polymerCounts)
  .reduce(
    (agg, count, polymer) => ({
      ...agg,
      [polymer[1]]: count + agg[polymer[1]],
    }),
    { [initialPolymer[0]]: 1 },
  )
  .values()
  .sortBy()
  .valueOf();

console.log(counts[counts.length - 1] - counts[0]);
