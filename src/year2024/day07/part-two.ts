import { readFileSync } from 'fs';
import { sum } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);
const lines = file.toString().split('\n');

const equations = lines.map((line) => {
  const [value, numbers] = line.split(': ');
  return {
    value: Number(value),
    numbers: numbers.split(' ').map(Number),
  };
});

function recursion(currentTotal: number, numbers: number[], target: number): boolean {
  const nextNumber = numbers.shift();
  const nextAdd = currentTotal + nextNumber;
  const nextMult = currentTotal * nextNumber;
  const nextConcat = Number(`${currentTotal}${nextNumber}`);

  if (numbers.length > 0) {
    return (
      recursion(nextAdd, [...numbers], target) ||
      recursion(nextMult, [...numbers], target) ||
      recursion(nextConcat, [...numbers], target)
    );
  } else {
    return target === nextAdd || target === nextMult || target === nextConcat;
  }
}

const goodEquations = equations.filter((equation) => {
  return recursion(equation.numbers.shift(), equation.numbers, equation.value);
});

console.log(sum(goodEquations.map((equation) => equation.value)));
