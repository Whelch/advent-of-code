import { readFileSync } from 'fs';
import { chain } from 'lodash';
import { openingSymbol } from './opening-symbol';
import { validSymbols } from './valid-symbols';

const file = readFileSync(`${__dirname}/input.txt`);

const lines = chain(file).split('\n').valueOf();

function symbolCost(symbol: string): number {
  switch (symbol) {
    case ')':
      return 3;
    case ']':
      return 57;
    case '}':
      return 1197;
    case '>':
      return 25137;
  }
}

let costs = 0;

lines.forEach((line: string) => {
  const buildup: string[] = [];

  for (let l = 0; l < line.length; l++) {
    if (openingSymbol(line[l])) {
      buildup.push(line[l]);
    } else if (!validSymbols(buildup.pop(), line[l])) {
      costs += symbolCost(line[l]);
      break;
    }
  }
});

console.log(costs);
