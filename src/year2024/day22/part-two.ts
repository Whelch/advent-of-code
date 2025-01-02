import { readFileSync } from 'fs';
import { sum } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);
const secretNumbers: number[] = file.toString().split('\n').map(Number);

type AlphabetMap = Record<number, Record<number, Record<number, Record<number, number>>>>;
type ChangeSequence = [number, number, number, number];

function shiftRight(num: number, shift: number): number {
  return Math.floor(num / Math.pow(2, shift));
}

function shiftLeft(num: number, shift: number): number {
  return num * Math.pow(2, shift);
}

function bitwiseXor(num1: number, num2: number): number {
  const arr1 = num1.toString(2).split('').toReversed();
  const arr2 = num2.toString(2).split('').toReversed();

  const result = [];

  for (let i = 0; i < Math.max(arr1.length, arr2.length); i++) {
    const bit1 = arr1[i] || '0';
    const bit2 = arr2[i] || '0';
    result.push(bit1 === bit2 ? 0 : 1);
  }

  return parseInt(result.toReversed().join(''), 2);
}

function nextSecretNumber(previous: number): number {
  let newSecretNumber = previous;
  newSecretNumber = bitwiseXor(newSecretNumber, shiftLeft(newSecretNumber, 6)) % 16777216;
  newSecretNumber = bitwiseXor(newSecretNumber, shiftRight(newSecretNumber, 5)) % 16777216;
  newSecretNumber = bitwiseXor(newSecretNumber, shiftLeft(newSecretNumber, 11)) % 16777216;
  return newSecretNumber;
}

function addChangesToMap(map: AlphabetMap, changes: ChangeSequence, value: number) {
  map[changes[0]] ??= {};
  map[changes[0]][changes[1]] ??= {};
  map[changes[0]][changes[1]][changes[2]] ??= {};
  map[changes[0]][changes[1]][changes[2]][changes[3]] ??= value;
}

function getLast4Changes(secretSequence: number[]): ChangeSequence {
  return [
    (secretSequence[secretSequence.length - 4] % 10) - (secretSequence[secretSequence.length - 5] % 10),
    (secretSequence[secretSequence.length - 3] % 10) - (secretSequence[secretSequence.length - 4] % 10),
    (secretSequence[secretSequence.length - 2] % 10) - (secretSequence[secretSequence.length - 3] % 10),
    (secretSequence[secretSequence.length - 1] % 10) - (secretSequence[secretSequence.length - 2] % 10),
  ];
}

function generateAlphabetMap(startNumber: number, index: number): AlphabetMap {
  console.log('starting alphabetMap: ', index);
  const secretSequence: number[] = [startNumber];
  const map: AlphabetMap = {};

  for (let i = 0; i < 2000; i++) {
    secretSequence.push(nextSecretNumber(secretSequence[secretSequence.length - 1]));
    if (i >= 3) {
      addChangesToMap(map, getLast4Changes(secretSequence), secretSequence[secretSequence.length - 1] % 10);
    }
  }

  return map;
}

// const endSecretNumbers = secretNumbers.map((secretNumber) => {
//   for (let i = 0; i < 2000; i++) {
//     secretNumber = nextSecretNumber(secretNumber);
//   }
//   return secretNumber
// });

function recurse(sequence: number[], allMaps: AlphabetMap[]): number {
  if (sequence.length < 4) {
    let result = 0;
    for (let i = -9; i < 10; i++) {
      if (sequence.length === 0) {
        console.log('sequence starting with: ', i);
      }
      result = Math.max(result, recurse([...sequence, i], allMaps));
    }
    return result;
  } else {
    const sellerValue = allMaps.map((map) => {
      return map[sequence[0]]?.[sequence[1]]?.[sequence[2]]?.[sequence[3]] ?? 0;
    });

    return sum(sellerValue);
  }
}

const alphabetMap = secretNumbers.map(generateAlphabetMap);

// console.log(alphabetMap);

console.log(recurse([], alphabetMap));

// console.log(alphabetMap.length);

/**
 * 123
 *
 * 15887950
 * 16495136
 * 527345
 * 704524
 * 1553684
 * 12683156
 * 11100544
 * 12249484
 * 7753432
 * 5908254
 */

/**
 * 1: 8685429
 * 10: 4700978
 * 100: 15273692
 * 2024: 8667524
 */
