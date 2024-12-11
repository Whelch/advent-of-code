import { readFileSync } from 'fs';

const file = readFileSync(`${__dirname}/input.txt`);
let stones = file.toString().split(' ').map(Number);

for (let i = 0; i < 25; i++) {
  const newStones: number[] = [];
  stones.forEach((stone) => {
    if (stone === 0) {
      newStones.push(1);
    } else if (stone.toString().length % 2 === 0) {
      const stoneString = stone.toString();
      newStones.push(Number(stoneString.substring(0, stoneString.length / 2)));
      newStones.push(Number(stoneString.substring(stoneString.length / 2)));
    } else {
      newStones.push(stone * 2024);
    }
  });

  stones = newStones;
}

console.log(stones.length);
