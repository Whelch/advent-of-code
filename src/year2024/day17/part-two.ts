import { readFileSync } from 'fs';

const file = readFileSync(`${__dirname}/input.txt`);
const [, programLine]: string[] = file.toString().split('\n\n');

const program = programLine.split(': ')[1].split(',').map(Number);
const reverseProgram = program.toReversed();

function combo(operand: number, state: ProgramState): number {
  switch (operand) {
    case 0:
    case 1:
    case 2:
    case 3:
      return operand;
    case 4:
      return state.registers[0];
    case 5:
      return state.registers[1];
    case 6:
      return state.registers[2];
    case 7: // illegal operand
      return NaN;
  }
}

interface ProgramState {
  pointer: number;
  registers: [number, number, number];
  outputs: number[];
}

function shiftRight(num: number, shift: number) {
  return Math.floor(num / Math.pow(2, shift));
}

function shiftLeft(num: number, shift: number) {
  return num * Math.pow(2, shift);
}

function performOperation(state: ProgramState) {
  const operation = program[state.pointer];
  const operand = program[state.pointer + 1];

  switch (operation) {
    case 0: // adv
      state.registers[0] = shiftRight(state.registers[0], combo(operand, state));
      break;
    case 1: // bst
      state.registers[1] ^= operand;
      break;
    case 2: // bst
      state.registers[1] = combo(operand, state) % 8;
      break;
    case 3: // jzn
      if (state.registers[0] !== 0) {
        state.pointer = operand;
        return;
      }
      break;
    case 4: // bxc
      state.registers[1] ^= state.registers[2];
      break;
    case 5: // out
      state.outputs.push(combo(operand, state) % 8);
      break;
    case 6: // bdv
      state.registers[1] = shiftRight(state.registers[0], combo(operand, state)) % 8; // adding % 8 because higher bits are irrelevant
      break;
    case 7: // cdv
      state.registers[2] = shiftRight(state.registers[0], combo(operand, state)) % 8; // adding % 8 because higher bits are irrelevant
      break;
  }

  state.pointer += 2;
}

function validateOutput(state: ProgramState) {
  const reversedOutputs = state.outputs.toReversed();
  for (let i = 0; i < reversedOutputs.length; i++) {
    if (reversedOutputs[i] !== reverseProgram[i]) {
      return false;
    }
  }
  return true;
}

function newProgram(testBits: number, currentOutput: string[]): ProgramState {
  const outputNumber = parseInt(currentOutput.join(''), 2) || 0;

  return {
    pointer: 0,
    registers: [shiftLeft(outputNumber, 3) + testBits, 0, 0],
    outputs: [],
  };
}

function runProgram(state: ProgramState) {
  while (state.pointer < program.length) {
    performOperation(state);
  }
}

function recursion(testBits: number, outputs: string[]): string[] {
  if (testBits === 8 || outputs.length === program.length) {
    return outputs;
  }

  const programState = newProgram(testBits, outputs);
  runProgram(programState);

  if (validateOutput(programState)) {
    const result = recursion(0, [...outputs, testBits.toString(2).padStart(3, '0')]);
    if (result.length === program.length) {
      return result;
    }
  }

  return recursion(testBits + 1, outputs);
}

console.log(parseInt(recursion(0, []).join(''), 2));
