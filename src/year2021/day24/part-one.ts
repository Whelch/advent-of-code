import { readFileSync } from 'fs';
import { chain, forEach, size } from 'lodash';

enum Address {
  W = 'w',
  X = 'x',
  Y = 'y',
  Z = 'z',
}

type Memory = [number, number, number, number];

enum Operation {
  Input = 'inp',
  Add = 'add',
  Multiply = 'mul',
  Divide = 'div',
  Modulo = 'mod',
  Equal = 'eql',
}

type Instruction = [Operation.Input, Address] | [Exclude<Operation, Operation.Input>, Address, number | Address];

type DigitInstructions = Instruction[];

function addrIndex(address: Address): number {
  switch (address) {
    case Address.W:
      return 0;
    case Address.X:
      return 1;
    case Address.Y:
      return 2;
    case Address.Z:
      return 3;
  }
}

function roundToZero(val: number) {
  return val > 0 ? Math.floor(val) : Math.ceil(val);
}

function add(mem: Memory, to: Address, from: number | Address) {
  const toIndex = addrIndex(to);
  if (typeof from === 'string') {
    mem[toIndex] += mem[addrIndex(from)];
  } else {
    mem[toIndex] += from;
  }
}

function multiply(mem: Memory, to: Address, from: number | Address) {
  const toIndex = addrIndex(to);
  if (typeof from === 'string') {
    mem[toIndex] *= mem[addrIndex(from)];
  } else {
    mem[toIndex] *= from;
  }
}

function divide(mem: Memory, to: Address, from: number | Address): boolean {
  const toIndex = addrIndex(to);
  if (typeof from === 'string') {
    const fromIndex = addrIndex(from);
    if (mem[fromIndex] === 0) {
      return true;
    } else {
      mem[toIndex] = roundToZero(mem[toIndex] / mem[fromIndex]);
    }
  } else {
    mem[toIndex] = roundToZero(mem[toIndex] / from);
  }
}

function modulo(mem: Memory, to: Address, from: number | Address): boolean {
  const toIndex = addrIndex(to);
  if (mem[toIndex] < 0) {
    return true;
  }
  if (typeof from === 'string') {
    const fromIndex = addrIndex(from);
    if (mem[fromIndex] <= 0) {
      return true;
    } else {
      mem[toIndex] %= mem[fromIndex];
    }
  } else {
    mem[toIndex] %= from;
  }
}

function equal(mem: Memory, to: Address, from: number | Address) {
  const toIndex = addrIndex(to as Address);
  if (typeof from === 'string') {
    mem[toIndex] = mem[toIndex] === mem[addrIndex(from)] ? 1 : 0;
  } else {
    mem[toIndex] = mem[toIndex] === from ? 1 : 0;
  }
}

const file = readFileSync(`${__dirname}/input.txt`);

const operations: DigitInstructions[] = chain(file)
  .split('\n\n')
  .map((digitChunk) => {
    return digitChunk.split('\n').map((line) => {
      return line.split(' ').map((char) => (isNaN(+char) ? char : +char)) as Instruction;
    });
  })
  .valueOf();

let universes: Record<number, number> = {
  0: 0,
};

for (let i = 0; i < 14; i++) {
  console.log(`Searching for digit: ${i}`);

  const newUniverses: Record<number, number> = {};
  for (let newDigit = 9; newDigit >= 1; newDigit--) {
    forEach(universes, (model, mem3) => {
      let failed = false;
      const mem: Memory = [newDigit, 0, 0, +mem3];
      for (let j = 0; j < operations[i].length && !failed; j++) {
        const instruction = operations[i][j];
        switch (instruction[0]) {
          case Operation.Add:
            add(mem, instruction[1], instruction[2]);
            break;
          case Operation.Multiply:
            multiply(mem, instruction[1], instruction[2]);
            break;
          case Operation.Divide:
            failed = divide(mem, instruction[1], instruction[2]);
            break;
          case Operation.Modulo:
            failed = modulo(mem, instruction[1], instruction[2]);
            break;
          case Operation.Equal:
            equal(mem, instruction[1], instruction[2]);
            break;
        }
      }

      if (!failed) {
        const existingModel = newUniverses[mem[3]] ?? 0;
        const newModel = model * 10 + newDigit;
        if (existingModel < newModel) {
          newUniverses[mem[3]] = newModel;
        }
      }
    });
  }

  if (i >= 8) {
    universes = {};
    const maxMem3 = Math.pow(26, 13 - i);
    forEach(newUniverses, (model, mem3) => {
      if (+mem3 <= maxMem3) {
        universes[+mem3] = model;
      }
    });
  } else {
    universes = newUniverses;
  }
}

console.log(universes);
console.log(size(universes));
