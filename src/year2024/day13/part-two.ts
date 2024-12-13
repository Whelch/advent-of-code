import { readFileSync } from 'fs';
import { sum } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);
const games = file.toString().split('\n\n');

type Coord = [number, number];

function lineIntersect(a1: Coord, a2: Coord, b1: Coord, b2: Coord) {
  const denom = (b2[1] - b1[1]) * (a2[0] - a1[0]) - (b2[0] - b1[0]) * (a2[1] - a1[1]);
  if (denom == 0) {
    return null;
  }
  const ua = ((b2[0] - b1[0]) * (a1[1] - b1[1]) - (b2[1] - b1[1]) * (a1[0] - b1[0])) / denom;
  return {
    x: a1[0] + ua * (a2[0] - a1[0]),
    y: a1[1] + ua * (a2[1] - a1[1]),
  };
}

const results = games.map((gameLines) => {
  const [buttonA, buttonB, prizeString] = gameLines.split('\n');
  const a = buttonA
    .split(': ')[1]
    .split(', ')
    .map((coord) => Number(coord.substring(2))) as [number, number];
  const b = buttonB
    .split(': ')[1]
    .split(', ')
    .map((coord) => Number(coord.substring(2))) as [number, number];
  const prize = prizeString
    .split(': ')[1]
    .split(', ')
    .map((coord) => Number(coord.substring(2))) as [number, number];
  prize[0] += 10000000000000;
  prize[1] += 10000000000000;

  const costA = Math.max(Math.floor(prize[0] / a[0]) * 3, Math.floor(prize[1] / a[1]) * 3);
  const costB = Math.max(Math.floor(prize[0] / b[0]), Math.floor(prize[1] / b[1]));

  if (costA > costB) {
    const intercept = lineIntersect([0, 0], b, prize, [prize[0] - a[0], prize[1] - a[1]]);

    if (
      intercept &&
      intercept.x < prize[0] &&
      intercept.x > 0 &&
      intercept.x === Math.floor(intercept.x) &&
      intercept.y === Math.floor(intercept.y)
    ) {
      const cost = intercept.x / b[0] + ((prize[0] - intercept.x) / a[0]) * 3;
      if (cost !== Math.floor(cost)) {
        return 0;
      } else {
        return cost;
      }
    } else {
      return 0;
    }
  } else {
    const intercept = lineIntersect([0, 0], a, prize, [prize[0] - b[0], prize[1] - b[1]]);

    if (
      intercept &&
      intercept.x < prize[0] &&
      intercept.x > 0 &&
      intercept.x === Math.floor(intercept.x) &&
      intercept.y === Math.floor(intercept.y)
    ) {
      const cost = (intercept.x / a[0]) * 3 + (prize[0] - intercept.x) / b[0];
      if (cost !== Math.floor(cost)) {
        return 0;
      } else {
        return cost;
      }
    } else {
      return 0;
    }
  }
});

console.log(sum(results));
