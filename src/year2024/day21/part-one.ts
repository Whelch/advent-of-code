import { readFileSync } from 'fs';
import { sum } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);
const codes: string[] = file.toString().split('\n');

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

function numPadSolve(from: NumpadChar, to: NumpadChar): string[] {
  const ogFrom = from;
  const ogTo = to;

  const verticalSequence: DirectionChar[] = [];
  const horizontalSequence: DirectionChar[] = [];

  if (from === to) {
    return [''];
  }

  if (from === NumpadChar.Zero) {
    if (to === NumpadChar.A) {
      return ['>'];
    } else {
      verticalSequence.push(DirectionChar.Up);
      from = NumpadChar.Two;
    }
  } else if (from === NumpadChar.A) {
    if (to === NumpadChar.Zero) {
      return ['<'];
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
    return [[...verticalSequence, ...horizontalSequence].join('')];
  } else if (
    [NumpadChar.A, NumpadChar.Zero].includes(ogTo) &&
    [NumpadChar.One, NumpadChar.Four, NumpadChar.Seven].includes(ogFrom)
  ) {
    return [[...horizontalSequence, ...verticalSequence].join('')];
  } else if (verticalSequence.length > 0 && horizontalSequence.length > 0) {
    return [
      [...verticalSequence, ...horizontalSequence].join(''),
      [...horizontalSequence, ...verticalSequence].join(''),
    ];
  } else {
    return [[...verticalSequence, ...horizontalSequence].join('')];
  }
}

function directionPadSolve(from: DirectionChar, to: DirectionChar): string[] {
  const verticalSequence: DirectionChar[] = [];
  const horizontalSequence: DirectionChar[] = [];

  if (from === to) {
    return [''];
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
    return [[...horizontalSequence, ...verticalSequence].join('')];
  } else if (to === DirectionChar.Left) {
    return [[...verticalSequence, ...horizontalSequence].join('')];
  } else if (horizontalSequence.length > 0 && verticalSequence.length > 0) {
    return [
      [...verticalSequence, ...horizontalSequence].join(''),
      [...horizontalSequence, ...verticalSequence].join(''),
    ];
  } else {
    return [[...verticalSequence, ...horizontalSequence].join('')];
  }
}

const sequences = codes.map((code) => {
  const line = code.split('') as NumpadChar[];

  const r1 = line.map((char, index) => {
    if (index === 0) {
      return numPadSolve(NumpadChar.A, char).map((sol) => `${sol}A`);
    } else {
      return numPadSolve(line[index - 1], char).map((sol) => `${sol}A`);
    }
  }) as DirectionChar[][];

  const r1Products = recursiveProduct(r1).map((p) => p.split('') as DirectionChar[]);
  // console.log(r1Products.map(p => p.join('')));

  const r2Options = r1Products.map((r1Product) => {
    return r1Product.map((char, index) => {
      if (index === 0) {
        return directionPadSolve(DirectionChar.A, char).map((sol) => `${sol}A`);
      } else {
        return directionPadSolve(r1Product[index - 1], char).map((sol) => `${sol}A`);
      }
    });
  });

  const r2Products = r2Options.flatMap((options) =>
    recursiveProduct(options).map((p) => p.split('') as DirectionChar[]),
  );
  // console.log(r2Products.map(p => p.join('')));

  const r3Options = r2Products.map((r2Product) => {
    return r2Product.map((char, index) => {
      if (index === 0) {
        return directionPadSolve(DirectionChar.A, char).map((sol) => `${sol}A`);
      } else {
        return directionPadSolve(r2Product[index - 1], char).map((sol) => `${sol}A`);
      }
    });
  });

  const r3Products = r3Options.flatMap((options) =>
    recursiveProduct(options).map((p) => p.split('') as DirectionChar[]),
  );

  return r3Products.map((p) => p.length).sort((a, b) => a - b)[0];
  // console.log(r3Products.map(p => p.join('').length).sort());

  // const r2 = r1.map((char, index) => {
  //   if (index === 0) {
  //     return directionPadSolve(DirectionChar.A, char).map(sol => `${sol}A`);
  //   } else {
  //     console.log('Chars: ', r1[index - 1], char, directionPadSolve(r1[index - 1], char) + 'A');
  //     return directionPadSolve(r1[index - 1], char).map(sol => `${sol}A`);
  //   }
  // }).join('').split('') as DirectionChar[];
  //
  // const r3 = r2.map((char, index) => {
  //   if (index === 0) {
  //     return directionPadSolve(DirectionChar.A, char).map(sol => `${sol}A`);
  //   } else {
  //     return directionPadSolve(r2[index - 1], char).map(sol => `${sol}A`);
  //   }
  // }).join('').split('') as DirectionChar[];
  //
  // return r3;
});

console.log(sequences);
console.log(codes.map((c) => parseInt(c)));

const products = sequences.map((sequence, index) => {
  return sequence * parseInt(codes[index]);
});

console.log(sum(products));

// 145648 - too high
// 136100 - too low

// answer: <v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A
// A r2:   <A>AV<<AA>^AA>AVAA^A<VAAA>^A
// A r1:   ^A<<^^A>>AVVVA
// A code:

// mine:   V<<A>>^AVA^AV<<A>>^AAV<A<A>>^AAVAA<^A>AV<A>^AA<A>AV<A<A>>^AAAVA<^A>A
// r2:     <A>A<AAV<AA>>^AVAA^AV<AAA>^A
// r1:     ^A^^<<A>>AVVVA
// code:   379A
/**
 *
 * +---+---+---+
 * | 7 | 8 | 9 |
 * +---+---+---+
 * | 4 | 5 | 6 |
 * +---+---+---+
 * | 1 | 2 | 3 |
 * +---+---+---+
 *     | 0 | A |
 *     +---+---+
 *
 *     +---+---+
 *     | ^ | A |
 * +---+---+---+
 * | < | v | > |
 * +---+---+---+
 *
 *
 * 129
 * R1: ^<<A>A^^>AVVVA
 * R2: <AV<AA>>^AVA^A<AAV>A^AV<AAA>^A
 * R3: V<<A>>^AV<A<A>>^AAVAA^<A>AV<A>^A<A>AV<<A>>^AAV<A>A^A<A>AV<A<A>>^AAAVA^<A>A
 * R4: V<A<AA>>^AVAA<^A>AV<A<A>>^AV<<A>>^AVAA^<A>AAV<A>^AA
 *
 * R1: ^<<A>A>^^AVVVA
 * R2: <AV<AA>>^AVA^AVA<^AA>AV<AAA>^A
 */

// v<<A>>^A<A>AvA<^AA>A<vAAA>^A
