import { readFileSync } from 'fs';

const file = readFileSync(`${__dirname}/input.txt`);

const games = file
  .toString()
  .split('\n')
  .map((val) => val.split(': ')[1].split(';'));

let total = 0;

games.forEach((game, index) => {
  let red = 0;
  let green = 0;
  let blue = 0;

  game.forEach((round) => {
    const pulls = round.split(', ');
    pulls.forEach((pull) => {
      if (pull.includes('red')) {
        red = Math.max(red, parseInt(pull));
      } else if (pull.includes('green')) {
        green = Math.max(green, parseInt(pull));
      } else if (pull.includes('blue')) {
        blue = Math.max(blue, parseInt(pull));
      }
    });
  });

  total += red * green * blue;
});

console.log(total); // 63981
