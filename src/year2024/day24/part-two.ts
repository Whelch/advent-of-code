import { readFileSync } from 'fs';

const file = readFileSync(`${__dirname}/input.txt`);
const [initialWiresLines, gateLines] = file.toString().split('\n\n');

const initialWireValues: Record<string, number> = initialWiresLines.split('\n').reduce((acc, line) => {
  const [wire, value] = line.split(': ');

  if (wire.startsWith('y')) {
    acc[wire] = 0;
  }
  if (wire.startsWith('x')) {
    acc[wire] = 1;
  }

  // acc[wire] = Number(value);
  return acc;
}, {});

interface GateLogic {
  inputs: [string, string];
  operation: 'OR' | 'AND' | 'XOR';
}

const initialGates: Record<string, GateLogic> = gateLines.split('\n').reduce((acc, line) => {
  const [inputs, output] = line.split(' -> ');
  const [input1, operation, input2] = inputs.split(' ') as [string, 'OR' | 'AND' | 'XOR', string];

  acc[output] = {
    inputs: [input1, input2],
    operation,
  };

  return acc;
}, {});

// swap vvf with z19
const vvf = initialGates['vvf'];
const z19 = initialGates['z19'];
initialGates['vvf'] = z19;
initialGates['z19'] = vvf;

// swap qdg with z12
const qdg = initialGates['qdg'];
const z12 = initialGates['z12'];
initialGates['qdg'] = z12;
initialGates['z12'] = qdg;

// swap nvh with z37
const nvh = initialGates['nvh'];
const z37 = initialGates['z37'];
initialGates['nvh'] = z37;
initialGates['z37'] = nvh;

// swap dck with fgn
const dck = initialGates['dck'];
const fgn = initialGates['fgn'];
initialGates['dck'] = fgn;
initialGates['fgn'] = dck;

function computeWires(initialWires: Record<string, number>, gates: Record<string, GateLogic>) {
  const wireValues: Record<string, number> = { ...initialWires };

  let abandonShip = false;

  function calculateGate([output, gate]: [string, GateLogic]) {
    if (!gate || abandonShip) {
      abandonShip = true;
      return;
    }
    let input1 = wireValues[gate.inputs[0]];
    if (input1 === undefined) {
      input1 = calculateGate([gate.inputs[0], gates[gate.inputs[0]]]);
      wireValues[gate.inputs[0]] = input1;
    }
    let input2 = wireValues[gate.inputs[1]];
    if (input2 === undefined) {
      input2 = calculateGate([gate.inputs[1], gates[gate.inputs[1]]]);
      wireValues[gate.inputs[1]] = input2;
    }

    let value = 0;

    switch (gate.operation) {
      case 'OR':
        value = input1 | input2;
        break;
      case 'AND':
        value = input1 & input2;
        break;
      case 'XOR':
        value = input1 ^ input2;
        break;
    }

    wireValues[output] = value;
    return value;
  }

  Object.entries(gates).forEach(calculateGate);

  return wireValues;
}

function calculateBits(wireValues: Record<string, number>, prefix: string) {
  const bits: number[] = [];

  for (let i = 0; wireValues[`${prefix}${i.toString().padStart(2, '0')}`] !== undefined; i++) {
    bits.push(wireValues[`${prefix}${i.toString().padStart(2, '0')}`]);
  }

  return bits.reverse();
}

const badZGates = ['z12', 'z19', 'z23', 'z37'];

function findAllCulprits(badOutputs: string[]): Set<string> {
  const culprits: Set<string> = new Set();

  function addGateInputs(gate: GateLogic) {
    gate.inputs.forEach((input) => {
      if (!culprits.has(input)) {
        findAllCulprits([input]).forEach((culprit) => {
          culprits.add(culprit);
        });
      }
    });
  }

  badOutputs.forEach((output) => {
    const gate = initialGates[output];

    if (gate) {
      culprits.add(output);
      addGateInputs(gate);
    }
  });

  return culprits;
}

const allBadGates = findAllCulprits(badZGates);

const wireValues = computeWires(initialWireValues, initialGates);

const xBits = calculateBits(wireValues, 'x');
const yBits = calculateBits(wireValues, 'y');
const zBits = calculateBits(wireValues, 'z');

// for (let i= 0; i < allBadGates.size; i++){
//   console.log('i iteration: ', i);
//   let bad1 = allBadGates[i];
//   for (var j= 0; j < allBadGates.size; j++){
//     let bad2 = allBadGates[j];
//     for (var k= 0; k < allBadGates.size; k++){
//       let bad3 = allBadGates[k];
//       let bad4 = 'z12';
//         const combo1 = [[bad1, bad2], [bad3, bad4]];
//         const combo2 = [[bad1, bad3], [bad2, bad4]];
//         const combo3 = [[bad1, bad4], [bad2, bad3]];
//
//         const combo1Gates = {
//           ...initialGates,
//           [combo1[0][0]]: initialGates[combo1[0][1]],
//           [combo1[0][1]]: initialGates[combo1[0][0]],
//           [combo1[1][0]]: initialGates[combo1[1][1]],
//           [combo1[1][1]]: initialGates[combo1[1][0]],
//         };
//
//         const combo2Gates = {
//           ...initialGates,
//           [combo2[0][0]]: initialGates[combo2[0][1]],
//           [combo2[0][1]]: initialGates[combo2[0][0]],
//           [combo2[1][0]]: initialGates[combo2[1][1]],
//           [combo2[1][1]]: initialGates[combo2[1][0]],
//         };
//
//         const combo3Gates = {
//           ...initialGates,
//           [combo3[0][0]]: initialGates[combo3[0][1]],
//           [combo3[0][1]]: initialGates[combo3[0][0]],
//           [combo3[1][0]]: initialGates[combo3[1][1]],
//           [combo3[1][1]]: initialGates[combo3[1][0]],
//         };
//
//         const combo1Bits = calculateBits(computeWires(initialWireValues, combo1Gates), 'z');
//         if (combo1Bits.filter((bit) => bit === 0).length === 1 && combo1Bits.length > 40) {
//           console.log('combo1', combo1);
//         }
//
//         const combo2Bits = calculateBits(computeWires(initialWireValues, combo2Gates), 'z');
//         if (combo2Bits.filter((bit) => bit === 0).length === 1 && combo2Bits.length > 40) {
//           console.log('combo2', combo2);
//         }
//
//         const combo3Bits = calculateBits(computeWires(initialWireValues, combo3Gates), 'z');
//         if (combo3Bits.filter((bit) => bit === 0).length === 1 && combo3Bits.length > 40) {
//           console.log('combo3', combo3);
//         }
//     }
//   }
// }

console.log('x: ', [0, ...xBits].join(''));
console.log('y: ', [0, ...yBits].join(''));
console.log('z: ', zBits.join(''));

/**
 * When x OR y is 1
 * z = 0111111110000000000000011110000000111111111111
 *
 *
 * when x AND y is 0
 * z = 0000000000000000000000000000000000000000000000
 *
 * when x AND y is 1
 * z = 1111111111111111111111011101111111111111111110
 *
 *
 * z = 0111111110000000000000011110000000111111111111
 * z = 0000000000000000000000000000000000000000000000
 * z = 1111111111111111111111011101111111111111111110
 *
 *
 * z = 1000000000000000000000011111111111111111111111
 */

// console.log(wireValues['x12'], wireValues['y12'], wireValues['z37']);

/**
 * EXAMPLE of GOOD: z02
 * z02 => qcs                                                  XOR gwm
 * z02 => qcs                                                  XOR (y02 XOR x02)
 * z02 => (gcq           OR dnc)                               XOR (y02 XOR x02)
 * z02 => (gcq           OR (wnt           AND gct))           XOR (y02 XOR x02)
 * z02 => ((x01 AND y01) OR ((y01 XOR x01) AND gct))           XOR (y02 XOR x02)
 * z02 => ((x01 AND y01) OR ((y01 XOR x01) AND (x00 AND y00))) XOR (y02 XOR x02)
 */

// swap vvf with z19
// swap qdg with z12
// swap nvh with z37
// swap dck with fgn

/**
 * z23 => fgn XOR shg
 * z23 => (y23 AND x23) XOR (ntn OR kjm)
 *
 * SHOULD BE
 * z23 => dck XOR ?
 *
 *
 * z24 => kvf                              XOR drc
 * z24 => (dck           OR fwj)           XOR (x24 XOR y24)
 * z24 => ((x23 XOR y23) OR (shg AND fgn)) XOR (x24 XOR y24)
 *
 * swap dck with fgn
 */

/**
 * z37 => ? XOR smb
 *
 * swap nvh with z37
 */
