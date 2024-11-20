import { readFileSync } from 'fs';
import { chain, sum, zip } from 'lodash';

type Vector = [number, number, number];
type VectorMatrix = [Vector, Vector, Vector];

const file = readFileSync(`${__dirname}/input.txt`);

let scanners = chain(file)
  .split('\n\n')
  .map((scanner) => scanner.split('\n').map((line) => line.split(',').map((val) => +val) as Vector))
  .valueOf();

const beaconMap: Vector[] = scanners.shift();

const scannerMap: Vector[] = [[0, 0, 0]];

function addVectors(...vectors: Vector[]): Vector {
  return zip(...vectors)
    .map(sum)
    .valueOf() as Vector;
}

function invertVector([x, y, z]: Vector): Vector {
  return [-x, -y, -z];
}

function addScannerToMap(scanner: Vector[]) {
  scanner.forEach((beacon) => {
    if (!beaconMap.some((vector) => equalVectors(vector, beacon))) {
      beaconMap.push(beacon);
    }
  });
}

function equalVectors([x1, y1, z1]: Vector, [x2, y2, z2]: Vector): boolean {
  return x1 === x2 && y1 === y2 && z1 === z2;
}

function scannerOverlaps(scanner: Vector[], transform: VectorMatrix, translation: Vector): boolean {
  let good = 0;

  for (let i = 0; i < scanner.length && good < 12; i++) {
    const normalizedBeacon = addVectors(vectorMatrixMult(transform, scanner[i]), translation);
    if (beaconMap.some((vector) => equalVectors(vector, normalizedBeacon))) {
      good++;
    } else if (
      Math.abs(normalizedBeacon[0]) <= 1000 &&
      Math.abs(normalizedBeacon[1]) <= 1000 &&
      Math.abs(normalizedBeacon[2]) <= 1000
    ) {
      return false;
    }
  }

  return good >= 12;
}

function squareMatrixMult(m1: VectorMatrix, m2: VectorMatrix): VectorMatrix {
  const newMatrix: VectorMatrix = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      newMatrix[x][y] = m1[x][0] * m2[0][y] + m1[x][1] * m2[1][y] + m1[x][2] * m2[2][y];
    }
  }

  return newMatrix;
}

function vectorMatrixMult(m: VectorMatrix, v: Vector): Vector {
  const newVector: Vector = [0, 0, 0];

  for (let x = 0; x < 3; x++) {
    newVector[x] = m[x][0] * v[0] + m[x][1] * v[1] + m[x][2] * v[2];
  }

  return newVector;
}

const BASE_TRANSFORM: VectorMatrix = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

const ROLL_MATRIX: VectorMatrix = [
  [1, 0, 0],
  [0, 0, 1],
  [0, -1, 0],
];
const TURN_MATRIX: VectorMatrix = [
  [0, -1, 0],
  [1, 0, 0],
  [0, 0, 1],
];

function manhattanDistance([x1, y1, z1]: Vector, [x2, y2, z2]: Vector): number {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2);
}

const stepMatrix = [];

stepMatrix[0] = squareMatrixMult(ROLL_MATRIX, BASE_TRANSFORM);
stepMatrix[1] = squareMatrixMult(TURN_MATRIX, stepMatrix[0]);
stepMatrix[2] = squareMatrixMult(TURN_MATRIX, stepMatrix[1]);
stepMatrix[3] = squareMatrixMult(TURN_MATRIX, stepMatrix[2]);
stepMatrix[4] = squareMatrixMult(ROLL_MATRIX, stepMatrix[3]);
stepMatrix[5] = squareMatrixMult(TURN_MATRIX, stepMatrix[4]);
stepMatrix[6] = squareMatrixMult(TURN_MATRIX, stepMatrix[5]);
stepMatrix[7] = squareMatrixMult(TURN_MATRIX, stepMatrix[6]);
stepMatrix[8] = squareMatrixMult(ROLL_MATRIX, stepMatrix[7]);
stepMatrix[9] = squareMatrixMult(TURN_MATRIX, stepMatrix[8]);
stepMatrix[10] = squareMatrixMult(TURN_MATRIX, stepMatrix[9]);
stepMatrix[11] = squareMatrixMult(TURN_MATRIX, stepMatrix[10]);
stepMatrix[12] = squareMatrixMult(
  ROLL_MATRIX,
  squareMatrixMult(ROLL_MATRIX, squareMatrixMult(TURN_MATRIX, squareMatrixMult(ROLL_MATRIX, stepMatrix[11]))),
);
stepMatrix[13] = squareMatrixMult(TURN_MATRIX, stepMatrix[12]);
stepMatrix[14] = squareMatrixMult(TURN_MATRIX, stepMatrix[13]);
stepMatrix[15] = squareMatrixMult(TURN_MATRIX, stepMatrix[14]);
stepMatrix[16] = squareMatrixMult(ROLL_MATRIX, stepMatrix[15]);
stepMatrix[17] = squareMatrixMult(TURN_MATRIX, stepMatrix[16]);
stepMatrix[18] = squareMatrixMult(TURN_MATRIX, stepMatrix[17]);
stepMatrix[19] = squareMatrixMult(TURN_MATRIX, stepMatrix[18]);
stepMatrix[20] = squareMatrixMult(ROLL_MATRIX, stepMatrix[19]);
stepMatrix[21] = squareMatrixMult(TURN_MATRIX, stepMatrix[20]);
stepMatrix[22] = squareMatrixMult(TURN_MATRIX, stepMatrix[21]);
stepMatrix[23] = squareMatrixMult(TURN_MATRIX, stepMatrix[22]);

while (scanners.length > 0) {
  console.log('scannersLeft: ', scanners.length);
  const scannersToRemove: number[] = [];

  for (let i = 0; i < scanners.length; i++) {
    let scanner = scanners[i];

    let alignment = false;

    for (let step = 0; step < 24 && !alignment; step++) {
      let transform = stepMatrix[step];

      let translation: Vector;
      let normalizedScanner: Vector[];

      for (let b = 0; b < scanner.length - 11 && !alignment; b++) {
        for (let m = 0; m < beaconMap.length - 11 && !alignment; m++) {
          const transformedBeacon = vectorMatrixMult(transform, scanner[b]);
          translation = addVectors(beaconMap[m], invertVector(transformedBeacon));

          alignment = scannerOverlaps(scanner, transform, translation);
        }
      }

      if (alignment) {
        normalizedScanner = scanner.map((beacon) => addVectors(vectorMatrixMult(transform, beacon), translation));
        addScannerToMap(normalizedScanner);
        scannersToRemove.push(i);
        scannerMap.push(translation);
        console.log(`alignment! ${scanners.length - scannersToRemove.length} left`);
      }
    }
  }

  scanners = scanners.filter((val, index) => !scannersToRemove.includes(index));
}

let maxDistance = 0;

for (let i = 0; i < scannerMap.length - 1; i++) {
  for (let l = i + 1; l < scannerMap.length; l++) {
    maxDistance = Math.max(maxDistance, manhattanDistance(scannerMap[i], scannerMap[l]));
  }
}

console.log(JSON.stringify(beaconMap));
console.log(maxDistance);

// 14682
// 5023
