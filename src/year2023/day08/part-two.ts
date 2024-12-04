import { readFileSync } from 'fs';

interface MapNode {
  name: string;
  L: string;
  R: string;
}

const file = readFileSync(`${__dirname}/input.txt`);

const [instructions, mapLines] = file.toString().split('\n\n');

const map = mapLines.split('\n').reduce(
  (agg, line) => {
    const [name, LRString] = line.split(' = (');
    const [L, R] = LRString.replace(')', '').split(', ');

    agg[name] = { name, L, R };
    return agg;
  },
  {} as Record<string, MapNode>,
);

const starters = Object.keys(map).filter((key) => key[2] === 'A');

const cycles = starters.map((start) => {
  let step = 0;
  let current = start;
  while (current[2] !== 'Z') {
    current = map[current][instructions[step % instructions.length]];
    step++;
  }
  return step;
});

console.log(cycles); // calculate LCM of cycles
// 14,631,604,759,649
