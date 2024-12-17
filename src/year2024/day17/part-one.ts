import { readFileSync } from 'fs';

const file = readFileSync(`${__dirname}/input.txt`);
const [registerLines, programLine]: string[] = file.toString().split('\n\n');

const registers: number[] = registerLines.split('\n').map((line) => Number(line.split(': ')[1]));
const program: number[] = programLine.split(': ')[1].split(',').map(Number);

const outputs = [];
let pointer = 0;

function combo(operand: number): number {
  switch (operand) {
    case 0:
    case 1:
    case 2:
    case 3:
      return operand;
    case 4:
      return registers[0];
    case 5:
      return registers[1];
    case 6:
      return registers[2];
    case 7: // illegal operand
      return NaN;
  }
}

function performOperation(operation: number, operand: number) {
  switch (operation) {
    case 0: // adv
      registers[0] = registers[0] >> combo(operand);
      break;
    case 1: // bst
      registers[1] ^= operand;
      break;
    case 2: // bst
      registers[1] = combo(operand) % 8;
      break;
    case 3: // jzn
      if (registers[0] !== 0) {
        pointer = operand;
        return;
      }
      break;
    case 4: // bxc
      registers[1] ^= registers[2];
      break;
    case 5: // out
      outputs.push(combo(operand) % 8);
      break;
    case 6: // bdv
      registers[1] = registers[0] >> combo(operand);
      break;
    case 7: // cdv
      registers[2] = registers[0] >> combo(operand);
      break;
  }

  pointer += 2;
}

while (pointer < program.length) {
  performOperation(program[pointer], program[pointer + 1]);
}

console.log(outputs.join(','));
