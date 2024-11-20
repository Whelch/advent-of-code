import { readFileSync } from 'fs';
import { chain, difference, without } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

function parseLine(line: string): string[][][] {
  return chain(line)
    .split(' | ')
    .map((digits) => digits.split(' ').map((digit) => digit.split('').sort()))
    .valueOf();
}

function decodeLine([digits, display]: string[][][]): number {
  const decoded: string[][] = [];

  const _069 = digits.filter((digit) => digit.length === 6);
  const _235 = digits.filter((digit) => digit.length === 5);

  decoded[1] = digits.find((digit) => digit.length === 2);
  decoded[4] = digits.find((digit) => digit.length === 4);
  decoded[7] = digits.find((digit) => digit.length === 3);
  decoded[8] = digits.find((digit) => digit.length === 7);

  decoded[6] = _069.find((digit) => difference(decoded[1], digit).length === 1);
  decoded[9] = without(_069, decoded[6]).find((digit) => difference(decoded[4], digit).length === 0);
  decoded[0] = without(_069, decoded[6], decoded[9])[0];

  decoded[3] = _235.find((digit) => difference(decoded[1], digit).length === 0);
  decoded[2] = _235.find((digit) => difference(decoded[4], digit).length === 2);
  decoded[5] = without(_235, decoded[2], decoded[3])[0];

  return +chain(display)
    .map((digit) => decoded.findIndex((decode) => decode.join('') === digit.join('')))
    .join('')
    .valueOf();
}

const answer = chain(file).split('\n').map(parseLine).map(decodeLine).sum().valueOf();

console.log(answer);
