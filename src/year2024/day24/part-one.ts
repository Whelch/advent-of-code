import { readFileSync } from 'fs';

const file = readFileSync(`${__dirname}/input.txt`);
const [initialWiresLines, gateLines] = file.toString().split('\n\n');

const wireValues: Record<string, number> = initialWiresLines.split('\n').reduce((acc, line) => {
  const [wire, value] = line.split(': ');

  acc[wire] = Number(value);
  return acc;
}, {});

console.log(wireValues['y20']);

interface GateLogic {
  inputs: [string, string];
  operation: 'OR' | 'AND' | 'XOR';
  output: string;
}

const gates: Record<string, GateLogic> = gateLines.split('\n').reduce((acc, line) => {
  const [inputs, output] = line.split(' -> ');
  const [input1, operation, input2] = inputs.split(' ') as [string, 'OR' | 'AND' | 'XOR', string];

  acc[output] = {
    inputs: [input1, input2],
    operation,
    output,
  };

  return acc;
}, {});

function calculateGate(gate: GateLogic) {
  // console.log(gate);
  let input1 = wireValues[gate.inputs[0]];
  if (input1 === undefined) {
    console.log('looking for gate that outputs: ', gate.inputs[0]);
    input1 = calculateGate(gates[gate.inputs[0]]);
    wireValues[gate.inputs[0]] = input1;
  }
  let input2 = wireValues[gate.inputs[1]];
  if (input2 === undefined) {
    console.log('looking for gate that outputs: ', gate.inputs[1]);
    input2 = calculateGate(gates[gate.inputs[1]]);
    wireValues[gate.inputs[1]] = input2;
  }

  let value = 0;

  switch (gate.operation) {
    case 'OR':
      value = input1 | input2;
      console.log(`${input1} | ${input2} = ${value}`);
      break;
    case 'AND':
      value = input1 & input2;
      console.log(`${input1} & ${input2} = ${value}`);
      break;
    case 'XOR':
      value = input1 ^ input2;
      console.log(`${input1} XOR ${input2} = ${value}`);
      break;
  }

  wireValues[gate.output] = value;
  return value;
}

Object.values(gates).forEach(calculateGate);

const bits: number[] = [];

for (let i = 0; wireValues[`z${i.toString().padStart(2, '0')}`] !== undefined; i++) {
  bits.push(wireValues[`z${i.toString().padStart(2, '0')}`]);
}

console.log(bits);
console.log(parseInt(bits.reverse().join(''), 2));

// 70231160520703 is wrong
