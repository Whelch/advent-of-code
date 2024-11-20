import { readFileSync } from 'fs';

const file = readFileSync(`${__dirname}/input.txt`);

const games = file
  .toString()
  .split('\n')
  .map((val) => val.split(': ')[1].split(';'));

let total = 0;

games.forEach((game, index) => {
  let includeGame = true;

  game.forEach((round) => {
    const pulls = round.split(', ');
    pulls.forEach((pull) => {
      if (pull.includes('red') && parseInt(pull) > 12) {
        includeGame = false;
      } else if (pull.includes('green') && parseInt(pull) > 13) {
        includeGame = false;
      } else if (pull.includes('blue') && parseInt(pull) > 14) {
        includeGame = false;
      }
    });
  });

  if (includeGame) {
    total += index + 1;
  }
});

console.log(total); // 2449
