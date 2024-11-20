import { readFileSync } from 'fs';
import { chain } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

let [polymer, allPairs] = chain(file).split('\n\n').valueOf();

const [inputs, outputs] = chain(allPairs)
  .split('\n')
  .map((line) => line.split(' -> ') as [string, string])
  .unzip()
  .valueOf();

let nextPolymer = '';

for (let cycle = 0; cycle < 10; cycle++) {
  nextPolymer = polymer[0];
  for (let i = 0; i < polymer.length - 1; i++) {
    const subString = polymer.slice(i, i + 2);
    const insertionString = outputs[inputs.indexOf(subString)] ?? '';
    nextPolymer += insertionString + subString[1];
  }

  polymer = nextPolymer;
}

const answer = chain(polymer).countBy().values().sortBy().valueOf();

console.log(answer[answer.length - 1] - answer[0]);
