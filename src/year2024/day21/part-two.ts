import { readFileSync } from 'fs';
import { sum } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);
const codes: string[] = file.toString().split('\n');

const robotDepth = 25;

enum NumpadChar {
  One = '1',
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Zero = '0',
  A = 'A',
}

enum DirectionChar {
  Left = '<',
  Right = '>',
  Up = '^',
  Down = 'V',
  A = 'A',
}

function recursiveProduct(arr: string[][]): string[] {
  if (arr.length === 0) {
    return [''];
  } else {
    const variants = arr[0];
    const products: string[] = [];

    const nextVariants = recursiveProduct(arr.slice(1));

    variants.forEach((variant) => {
      nextVariants.forEach((nextVariant) => {
        products.push(`${variant}${nextVariant}`);
      });
    });

    return products;
  }
}

function numPadSolve(from: NumpadChar, to: NumpadChar, noCheck = false): string {
  const ogFrom = from;
  const ogTo = to;

  const verticalSequence: DirectionChar[] = [];
  const horizontalSequence: DirectionChar[] = [];

  if (from === to) {
    return '';
  }

  if (from === NumpadChar.Zero) {
    if (to === NumpadChar.A) {
      return '>';
    } else {
      verticalSequence.push(DirectionChar.Up);
      from = NumpadChar.Two;
    }
  } else if (from === NumpadChar.A) {
    if (to === NumpadChar.Zero) {
      return '<';
    } else {
      verticalSequence.push(DirectionChar.Up);
      from = NumpadChar.Three;
    }
  }
  if (to === NumpadChar.Zero) {
    verticalSequence.push(DirectionChar.Down);
    to = NumpadChar.Two;
  } else if (to === NumpadChar.A) {
    verticalSequence.push(DirectionChar.Down);
    to = NumpadChar.Three;
  }

  // vertical
  switch (from) {
    case NumpadChar.One:
    case NumpadChar.Two:
    case NumpadChar.Three:
      switch (to) {
        case NumpadChar.Seven:
        case NumpadChar.Eight:
        case NumpadChar.Nine:
          verticalSequence.push(DirectionChar.Up);
        case NumpadChar.Four:
        case NumpadChar.Five:
        case NumpadChar.Six:
          verticalSequence.push(DirectionChar.Up);
      }
      break;
    case NumpadChar.Four:
    case NumpadChar.Five:
    case NumpadChar.Six:
      switch (to) {
        case NumpadChar.Seven:
        case NumpadChar.Eight:
        case NumpadChar.Nine:
          verticalSequence.push(DirectionChar.Up);
          break;
        case NumpadChar.One:
        case NumpadChar.Two:
        case NumpadChar.Three:
          verticalSequence.push(DirectionChar.Down);
      }
      break;
    case NumpadChar.Seven:
    case NumpadChar.Eight:
    case NumpadChar.Nine:
      switch (to) {
        case NumpadChar.One:
        case NumpadChar.Two:
        case NumpadChar.Three:
          verticalSequence.push(DirectionChar.Down);
        case NumpadChar.Four:
        case NumpadChar.Five:
        case NumpadChar.Six:
          verticalSequence.push(DirectionChar.Down);
      }
  }

  // Horizontal
  switch (from) {
    case NumpadChar.One:
    case NumpadChar.Four:
    case NumpadChar.Seven:
      switch (to) {
        case NumpadChar.Three:
        case NumpadChar.Six:
        case NumpadChar.Nine:
          horizontalSequence.push(DirectionChar.Right);
        case NumpadChar.Two:
        case NumpadChar.Five:
        case NumpadChar.Eight:
          horizontalSequence.push(DirectionChar.Right);
      }
      break;
    case NumpadChar.Two:
    case NumpadChar.Five:
    case NumpadChar.Eight:
      switch (to) {
        case NumpadChar.Three:
        case NumpadChar.Six:
        case NumpadChar.Nine:
          horizontalSequence.push(DirectionChar.Right);
          break;
        case NumpadChar.One:
        case NumpadChar.Four:
        case NumpadChar.Seven:
          horizontalSequence.push(DirectionChar.Left);
      }
      break;
    case NumpadChar.Three:
    case NumpadChar.Six:
    case NumpadChar.Nine:
      switch (to) {
        case NumpadChar.One:
        case NumpadChar.Four:
        case NumpadChar.Seven:
          horizontalSequence.push(DirectionChar.Left);
        case NumpadChar.Two:
        case NumpadChar.Five:
        case NumpadChar.Eight:
          horizontalSequence.push(DirectionChar.Left);
      }
  }

  if (
    [NumpadChar.A, NumpadChar.Zero].includes(ogFrom) &&
    [NumpadChar.One, NumpadChar.Four, NumpadChar.Seven].includes(ogTo)
  ) {
    return [...verticalSequence, ...horizontalSequence].join('');
  } else if (
    [NumpadChar.A, NumpadChar.Zero].includes(ogTo) &&
    [NumpadChar.One, NumpadChar.Four, NumpadChar.Seven].includes(ogFrom)
  ) {
    return [...horizontalSequence, ...verticalSequence].join('');
  } else if (verticalSequence.length > 0 && horizontalSequence.length > 0) {
    if (horizontalSequence.includes(DirectionChar.Right)) {
      return [...verticalSequence, ...horizontalSequence].join('');
    } else {
      return [...horizontalSequence, ...verticalSequence].join('');
    }
  } else {
    return [...verticalSequence, ...horizontalSequence].join('');
  }
}

function directionPadSolution(line: DirectionChar[]): string {
  let lineString = '';

  for (let i = 0; i < line.length; i++) {
    if (i === 0) {
      lineString += directionPadSolve(DirectionChar.A, line[i], true);
    } else {
      lineString += directionPadSolve(line[i - 1], line[i], true);
    }
  }

  return lineString;
}

function directionPadSolve(from: DirectionChar, to: DirectionChar, noCheck = false): string {
  const verticalSequence: DirectionChar[] = [];
  const horizontalSequence: DirectionChar[] = [];

  if (from === to) {
    return '';
  }

  // Horizontal
  switch (from) {
    case DirectionChar.Left:
      horizontalSequence.push(DirectionChar.Right);
    case DirectionChar.Up:
    case DirectionChar.Down:
      switch (to) {
        case DirectionChar.Right:
        case DirectionChar.A:
          horizontalSequence.push(DirectionChar.Right);
          break;
        case DirectionChar.Left:
          horizontalSequence.push(DirectionChar.Left);
          break;
      }
      break;
    case DirectionChar.Right:
    case DirectionChar.A:
      switch (to) {
        case DirectionChar.Left:
          horizontalSequence.push(DirectionChar.Left);
        case DirectionChar.Up:
        case DirectionChar.Down:
          horizontalSequence.push(DirectionChar.Left);
          break;
      }
      break;
  }

  // Horizontal
  switch (from) {
    case DirectionChar.Up:
    case DirectionChar.A:
      switch (to) {
        case DirectionChar.Left:
        case DirectionChar.Down:
        case DirectionChar.Right:
          verticalSequence.push(DirectionChar.Down);
          break;
      }
      break;
    case DirectionChar.Left:
    case DirectionChar.Down:
    case DirectionChar.Right:
      switch (to) {
        case DirectionChar.Up:
        case DirectionChar.A:
          verticalSequence.push(DirectionChar.Up);
          break;
      }
      break;
  }

  if (from === DirectionChar.Left) {
    return [...horizontalSequence, ...verticalSequence].join('');
  } else if (to === DirectionChar.Left) {
    return [...verticalSequence, ...horizontalSequence].join('');
  } else if (horizontalSequence.length > 0 && verticalSequence.length > 0) {
    if (horizontalSequence.includes(DirectionChar.Right)) {
      return [...verticalSequence, ...horizontalSequence].join('');
    } else {
      return [...horizontalSequence, ...verticalSequence].join('');
    }
  } else {
    return [...verticalSequence, ...horizontalSequence].join('');
  }
}

const sequences = codes.map((code) => {
  const line = code.split('') as NumpadChar[];

  let robotInputMap = line.reduce((agg, char, index) => {
    let solution = '';
    if (index === 0) {
      solution = `${numPadSolve(NumpadChar.A, char)}A`;
    } else {
      solution = `${numPadSolve(line[index - 1], char)}A`;
    }
    agg[solution] ??= 0;
    agg[solution]++;
    return agg;
  }, {});

  for (let i = 0; i < robotDepth; i++) {
    robotInputMap = Object.entries(robotInputMap).reduce((agg, [sequence, count]) => {
      const line = sequence.split('') as DirectionChar[];

      return line.reduce((agg, char, index) => {
        let solution = '';
        if (index === 0) {
          solution = `${directionPadSolve(DirectionChar.A, char)}A`;
        } else {
          solution = `${directionPadSolve(line[index - 1], char)}A`;
        }
        agg[solution] ??= 0;
        agg[solution] += count;
        return agg;
      }, agg);
    }, {});
  }

  return sum(
    Object.entries(robotInputMap).map(([sequence, count]) => {
      return sequence.length * (count as number);
    }),
  );
});

const products = sequences.map((sequence, index) => {
  return sequence * parseInt(codes[index]);
});

console.log(sum(products));
