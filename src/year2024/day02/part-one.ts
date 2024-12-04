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

const safeLines = lines.filter((line, index) => {
  const numbers = line.split(' ').map(Number);

  return isSafe(numbers);
});

console.log(safeLines.length); // 536
