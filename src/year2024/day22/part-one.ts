import { readFileSync } from 'fs';
import { sum } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);
const secretNumbers: number[] = file.toString().split('\n').map(Number);

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

const endSecretNumbers = secretNumbers.map((secretNumber) => {
  for (let i = 0; i < 2000; i++) {
    secretNumber = nextSecretNumber(secretNumber);
  }
  return secretNumber;
});

// console.log(endSecretNumbers, nextSecretNumber(123));

console.log(sum(endSecretNumbers));

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
