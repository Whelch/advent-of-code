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

const goodEquations = equations.filter((equation) => {
  let numMultipliers = 0;

  let operations = equation.numbers.map(() => '+').slice(1);

  let last = true;

  while (operations.includes('+') || last) {
    if (!operations.includes('+')) {
      last = false;
    }

    let val = equation.numbers[0];
    for (let i = 0; i < operations.length; i++) {
      if (operations[i] === '+') {
        val += equation.numbers[i + 1];
      } else if (operations[i] === '*') {
        val *= equation.numbers[i + 1];
      }
    }

    if (val === equation.value) {
      return true;
    } else {
      let temp = operations.toReversed().join('');
      if (temp.substring(0, numMultipliers).includes('+')) {
        if (temp[0] === '*') {
          const endingMults = temp.split('+')[0].length;
          const firstPlus = temp.indexOf('+');
          const nextMult = temp.indexOf('*', firstPlus);
          const arrTemp = temp.split('');
          arrTemp[nextMult] = '+';
          arrTemp[nextMult - 1] = '*';
          for (let i = 0; i < nextMult; i++) {
            if (i < nextMult - (endingMults + 1)) {
              arrTemp[i] = '+';
            } else {
              arrTemp[i] = '*';
            }
          }

          operations = arrTemp.toReversed();
        } else {
          const firstMult = temp.indexOf('*');
          const arrTemp = temp.split('');
          arrTemp[firstMult] = '+';
          arrTemp[firstMult - 1] = '*';

          operations = arrTemp.toReversed();
        }
      } else {
        numMultipliers++;
        operations = [];
        for (let i = 0; i + 1 < equation.numbers.length; i++) {
          if (i < numMultipliers) {
            operations.push('*');
          } else {
            operations.push('+');
          }
        }
      }
    }
  }

  return false;
});

console.log(sum(goodEquations.map((equation) => equation.value)));
