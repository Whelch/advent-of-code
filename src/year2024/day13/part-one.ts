import { readFileSync } from 'fs';
import { sum } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);
const games = file.toString().split('\n\n');

/**
 * First move using the expensive button until the cheap button can be used
 * then finish remaining presses with cheap button
 */
function getCost(expensive: [number, number], cheap: [number, number], prize: [number, number], cost: 1 | 3) {
  let totalCost = 0;
  while (
    (prize[0] % cheap[0] !== 0 ||
      prize[1] % cheap[1] !== 0 ||
      Math.floor(prize[0] / cheap[0]) !== Math.floor(prize[1] / cheap[1])) &&
    prize[0] > 0 &&
    prize[1] > 0
  ) {
    totalCost += cost;
    prize[0] -= expensive[0];
    prize[1] -= expensive[1];
  }

  if (
    prize[0] % cheap[0] === 0 &&
    prize[1] % cheap[1] === 0 &&
    Math.floor(prize[0] / cheap[0]) === Math.floor(prize[1] / cheap[1])
  ) {
    if (cost === 3) {
      totalCost += prize[0] / cheap[0];
    } else {
      totalCost += (prize[0] / cheap[0]) * 3;
    }
    return totalCost;
  } else {
    return 0;
  }
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

  const costA = Math.max(Math.floor(prize[0] / a[0]) * 3, Math.floor(prize[1] / a[1]) * 3);
  const costB = Math.max(Math.floor(prize[0] / b[0]), Math.floor(prize[1] / b[1]));

  if (costA > costB) {
    return getCost(a, b, prize, 3);
  } else {
    return getCost(b, a, prize, 1);
  }
});

console.log(sum(results));
