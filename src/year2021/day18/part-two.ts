import { readFileSync } from 'fs';
import { chain, cloneDeep } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

type Pair = [number | Pair, number | Pair];

function addToLeftmostValue(pair: Pair, value: number) {
  if (typeof pair[0] === 'number') {
    pair[0] += value;
  } else {
    addToLeftmostValue(pair[0], value);
  }
}

function addToRightmostValue(pair: Pair, value: number) {
  if (typeof pair[1] === 'number') {
    pair[1] += value;
  } else {
    addToRightmostValue(pair[1], value);
  }
}

function splitValueIntoPair(value: number): Pair {
  return [Math.floor(value / 2), Math.ceil(value / 2)];
}

type TryToExplodeResponse = {
  exploding: boolean;
  addLeft?: number;
  addRight?: number;
};

function tryToExplode(pair: Pair, depth = 0): TryToExplodeResponse {
  let exploding = false;
  let addLeft = 0;
  let addRight = 0;
  if (depth >= 4) {
    return {
      exploding: true,
      addLeft: pair[0] as number,
      addRight: pair[1] as number,
    };
  }

  if (typeof pair[0] !== 'number') {
    const response = tryToExplode(pair[0], depth + 1);
    if (response.exploding) {
      if (depth === 3) {
        pair[0] = 0;
      }
      if (typeof pair[1] === 'number') {
        pair[1] += response.addRight ?? 0;
        return {
          exploding: true,
          addLeft: response.addLeft,
        };
      } else if (response.addRight) {
        addToLeftmostValue(pair[1], response.addRight);
      }
      return {
        exploding: true,
        addLeft: response.addLeft,
      };
    }
  }

  if (typeof pair[1] !== 'number') {
    const response = tryToExplode(pair[1], depth + 1);
    if (response.exploding) {
      if (depth === 3) {
        pair[1] = 0;
      }
      if (typeof pair[0] === 'number') {
        pair[0] += response.addLeft ?? 0;
        return {
          exploding: true,
          addRight: response.addRight,
        };
      } else if (response.addLeft) {
        addToRightmostValue(pair[0], response.addLeft);
      }
      exploding = true;
      addRight = response.addRight;
    }
  }

  return {
    exploding,
    addLeft,
    addRight,
  };
}

function tryToSplit(pair: Pair): boolean {
  if (pair[0] >= 10) {
    pair[0] = splitValueIntoPair(pair[0] as number);
    return true;
  } else if (typeof pair[0] !== 'number' && tryToSplit(pair[0])) {
    return true;
  } else if (pair[1] >= 10) {
    pair[1] = splitValueIntoPair(pair[1] as number);
    return true;
  } else if (typeof pair[1] !== 'number' && tryToSplit(pair[1])) {
    return true;
  }
}

function magnitude(pair: Pair): number {
  const left = typeof pair[0] === 'number' ? pair[0] : magnitude(pair[0]);
  const right = typeof pair[1] === 'number' ? pair[1] : magnitude(pair[1]);
  return left * 3 + right * 2;
}

let input: Pair[] = chain(file)
  .split('\n')
  .map((line) => JSON.parse(line) as Pair)
  .valueOf();

let maxMagnitude = 0;

for (let i = 0; i < input.length - 1; i++) {
  for (let t = 1; t < input.length && i !== t; t++) {
    let pair: Pair = [cloneDeep(input[i]), cloneDeep(input[t])];
    let exploded = true;
    let split = false;

    while (exploded || split) {
      let explodeResponse = tryToExplode(pair);
      exploded = explodeResponse.exploding;
      if (!exploded) {
        split = tryToSplit(pair);
      }
    }

    maxMagnitude = Math.max(magnitude(pair), maxMagnitude);

    exploded = true;
    pair = [cloneDeep(input[t]), cloneDeep(input[i])];

    while (exploded || split) {
      let explodeResponse = tryToExplode(pair);
      exploded = explodeResponse.exploding;
      if (!exploded) {
        split = tryToSplit(pair);
      }
    }

    maxMagnitude = Math.max(magnitude(pair), maxMagnitude);
  }
}

console.log(maxMagnitude);
