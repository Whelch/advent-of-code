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

let step = 0;
let current = 'AAA';
while (current !== 'ZZZ') {
  current = map[current][instructions[step % instructions.length]];
  step++;
}

console.log(step);
