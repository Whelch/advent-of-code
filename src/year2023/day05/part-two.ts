import { readFileSync } from 'fs';
import { find, map, min } from 'lodash';
import { Range } from '../../types/range';
import { rangeOverlap } from '../../utilities/range-overlap';

const file = readFileSync(`${__dirname}/input.txt`);

const [seedLine, ...mapStrings] = file.toString().split('\n\n');

const seeds = seedLine.split(': ')[1].split(' ').map(Number);
let seedRanges: Range[] = [];
for (let i = 0; i < seeds.length; i += 2) {
  seedRanges.push({ start: seeds[i], end: seeds[i] + seeds[i + 1] - 1 });
}

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

const locationRanges = seedRanges.map((seedRange, index) => {
  let sourceName = 'seed';
  let currentRanges = [seedRange];

  while (sourceName !== 'location') {
    const nextRanges: Range[] = [];
    const map = find(maps, { source: sourceName });

    while (currentRanges.length) {
      let range = currentRanges.pop();
      let targetMap: (typeof map.ranges)[number];
      do {
        targetMap = map.ranges.find(({ sourceStart, length }) => {
          return !!rangeOverlap({
            sourceRange: range,
            targetRange: { start: sourceStart, end: sourceStart + length - 1 },
          }).overlapRange;
        });
        if (targetMap) {
          const { overlapRange, remainingSourceRange } = rangeOverlap({
            sourceRange: range,
            targetRange: { start: targetMap.sourceStart, end: targetMap.sourceStart + targetMap.length - 1 },
          });

          nextRanges.push({
            start: targetMap.destinationStart + overlapRange.start - targetMap.sourceStart,
            end: targetMap.destinationStart + overlapRange.end - targetMap.sourceStart,
          });

          range = remainingSourceRange[0];
          if (remainingSourceRange[1]) {
            currentRanges.push(remainingSourceRange[1]);
          }
        } else {
          nextRanges.push(range);
        }
      } while (targetMap && range);

      if (range) {
        nextRanges.push(range);
      }
    }
    sourceName = map.destination;
    currentRanges = nextRanges;
  }

  return currentRanges;
});

console.log(min(locationRanges.flatMap((ranges) => map(ranges, 'start'))));
