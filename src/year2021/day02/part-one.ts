import { readFileSync } from 'fs';
import { chain, constant, times } from 'lodash';
import { Instruction } from './instruction.enum';

const file = readFileSync(`${__dirname}/input.txt`);

const instructions = chain(file)
  .split('\n')
  .map((val) => val.split(' '))
  .map(([instruction, val]) => times(+val, constant(instruction)))
  .flatten()
  .countBy()
  .valueOf();

console.log(instructions[Instruction.F] * (instructions[Instruction.D] - instructions[Instruction.U]));
