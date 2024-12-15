import { readFileSync } from 'fs';

interface Robot {
  position: [number, number];
  velocity: [number, number];
}

const file = readFileSync(`${__dirname}/input.txt`);
const robots = file
  .toString()
  .split('\n')
  .map((line) => {
    const [p, v] = line.split(' v=');
    const position = p
      .substring(2)
      .split(',')
      .map((n) => Number(n));
    const velocity = v.split(',').map((n) => Number(n));
    return { position, velocity } as Robot;
  });

let i = 0;
let allUnique = true;

do {
  i++;
  const positions = [];
  allUnique = true;

  robots.forEach((robot) => {
    robot.position[0] += robot.velocity[0];
    robot.position[1] += robot.velocity[1];

    robot.position[0] %= 101;
    robot.position[1] %= 103;

    if (robot.position[0] < 0) {
      robot.position[0] += 101;
    }
    if (robot.position[1] < 0) {
      robot.position[1] += 103;
    }

    if (allUnique && positions[robot.position[0]]?.[robot.position[1]]) {
      allUnique = false;
    }

    if (allUnique) {
      positions[robot.position[0]] ??= [];
      positions[robot.position[0]][robot.position[1]] = true;
    }
  });
} while (!allUnique);

const grid = [];
for (let x = 0; x < 101; x++) {
  grid[x] = [];
  for (let y = 0; y < 103; y++) {
    grid[x][y] = ' ';
  }
}

robots.forEach((robot) => {
  grid[robot.position[0]][robot.position[1]] = '#';
});

for (let x = 0; x < 101; x++) {
  console.log(grid[x].join(''));
}

console.log(i);
