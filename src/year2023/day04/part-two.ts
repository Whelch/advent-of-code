import { readFileSync } from 'fs';
import { map, sum } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

const lines = file.toString().split('\n');
const cards = lines.map((line, cardIndex) => {
  const [, data] = line.split(': ');
  const [winnerSide, mySide] = data.split(/\s+\|\s+/);
  const winnerNumbers = winnerSide.split(/\s+/).map(Number);
  const myNumbers = mySide.split(/\s+/).map(Number);
  const numWinners = myNumbers.filter((num) => winnerNumbers.includes(num)).length;
  const cardValue = numWinners > 0 ? Math.pow(2, numWinners - 1) : 0;

  // Total copies is updated in reverseCards
  return { winnerNumbers, myNumbers, numWinners, cardValue, cardIndex, totalCopies: 1 };
});

const reverseCards = cards.toReversed().map((card, index) => {
  let copyCards = card.totalCopies;
  for (let copyIndex = card.cardIndex + 1; copyIndex <= card.cardIndex + card.numWinners; copyIndex++) {
    if (cards[copyIndex]) {
      copyCards += cards[copyIndex].totalCopies;
    }
  }
  card.totalCopies = copyCards;
  return card;
});

const total = sum(map(reverseCards, 'totalCopies'));

console.log(total);
