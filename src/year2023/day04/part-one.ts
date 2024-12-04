import { readFileSync } from 'fs';
import { map, sum } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

const lines = file.toString().split('\n');
const cards = lines.map((line) => {
  const [, data] = line.split(': ');
  const [winnerSide, mySide] = data.split(/\s+\|\s+/);
  const winnerNumbers = winnerSide.split(/\s+/).map(Number);
  const myNumbers = mySide.split(/\s+/).map(Number);
  const numWinners = myNumbers.filter((num) => winnerNumbers.includes(num)).length;
  const cardValue = numWinners > 0 ? Math.pow(2, numWinners - 1) : 0;

  console.log(numWinners, cardValue);

  return { winnerNumbers, myNumbers, numWinners, cardValue };
});

console.log(cards[198]);

const total = sum(map(cards, 'cardValue'));

console.log(total);
