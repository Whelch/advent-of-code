import { readFileSync } from 'fs';
import { sum } from 'lodash';
import { cardCharacterToValue, evaluateHandType, handComparator } from './utils';

const file = readFileSync(`${__dirname}/input.txt`);

const handLines = file.toString().split('\n');

const hands = handLines.map((line) => {
  const [cardsString, bidString] = line.split(' ');
  const cards = cardsString.split('').map((card) => cardCharacterToValue({ card }));
  const bid = parseInt(bidString);
  const type = evaluateHandType(cards);
  return { cards, bid, type };
});

const sortedHands = hands.toSorted(handComparator);
const totalValue = sum(sortedHands.map(({ bid }, index) => bid * (index + 1)));

const start = sortedHands.length - 15;
for (let i = start; i < start + 15; i++) {
  console.log(sortedHands[i]);
}

console.log(totalValue); // 250347426
