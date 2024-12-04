import { readFileSync } from 'fs';
import { find, min } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

const [seedLine, ...mapStrings] = file.toString().split('\n\n');

const seeds = seedLine.split(': ')[1].split(' ').map(Number);
const maps = mapStrings.map((mapString) => {
  const [labelLine, ...rangeLines] = mapString.split('\n');
  const [source, destination] = labelLine.split(' map:')[0].split('-to-');
  return {
    source,
    destination,
    ranges: rangeLines.map((line) => {
      const [destinationStart, sourceStart, length] = line.split(' ').map(Number);
      return { destinationStart, sourceStart, length };
    }),
  };
});

const locations = seeds.map((seed, index) => {
  let sourceName = 'seed';
  let value = seed;

  while (sourceName !== 'location') {
    const map = find(maps, { source: sourceName });
    const range = map.ranges.find((range) => {
      return value >= range.sourceStart && value <= range.sourceStart + range.length;
    });
    if (range) {
      value = range.destinationStart + (value - range.sourceStart);
    }
    sourceName = map.destination;
  }

  return value;
});

console.log(min(locations));
