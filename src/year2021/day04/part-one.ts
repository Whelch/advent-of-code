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

let winningBoard = undefined;
let i = -1;
while (!winningBoard) {
  i++;

  boards = chain(boards)
    .map((board) => board.map((row) => row.map((cell) => (cell === numbers[i] ? NaN : cell))))
    .valueOf();

  winningBoard = boards.find(isBoardWinner);
}

const answer = chain(winningBoard).flatten().reject(isNaN).sum().multiply(numbers[i]).valueOf();

console.log(answer);
