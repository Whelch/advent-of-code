import { readFileSync } from 'fs';

const file = readFileSync(`${__dirname}/input.txt`);

const lines = file.toString().split('\n');

function isSafe(numbers: number[]) {
  const isDescending = numbers[0] > numbers[1];

  return numbers.slice(0, numbers.length - 1).every((number, index) => {
    if (Math.abs(numbers[index] - numbers[index + 1]) <= 3) {
      if (isDescending) {
        return number > numbers[index + 1];
      } else {
        return number < numbers[index + 1];
      }
    } else {
      return false;
    }
  });
}

const safeLines = lines.filter((line) => {
  const numbers = line.split(' ').map(Number);

  return numbers.some((number, index) => {
    return isSafe([...numbers.slice(0, index), ...numbers.slice(index + 1, numbers.length)]);
  });
});

console.log(safeLines.length);
