import { readFileSync } from 'fs';
import { chain } from 'lodash';
import { isBoardWinner } from './is-board-winner';
import { parseBoard } from './parse-board';

const file = readFileSync(`${__dirname}/input.txt`);

const chunks = chain(file).split('\n\n').valueOf();

const numbers = chain(chunks)
  .shift()
  .split(',')
  .map((val) => +val)
  .valueOf();
let boards = chain(chunks).slice().map(parseBoard).valueOf();

let i = -1;
while (boards.length > 1 || !isBoardWinner(boards[0])) {
  i++;

  boards = chain(boards)
    .map((board) => board.map((row) => row.map((cell) => (cell === numbers[i] ? NaN : cell))))
    .valueOf();

  if (boards.length > 1) {
    boards = chain(boards).reject(isBoardWinner).valueOf();
  }
}

const answer = chain(boards[0]).flatten().reject(isNaN).sum().multiply(numbers[i]).valueOf();

console.log(answer);
