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

robots.forEach((robot) => {
  robot.position[0] += robot.velocity[0] * 100;
  robot.position[1] += robot.velocity[1] * 100;

  robot.position[0] %= 101;
  robot.position[1] %= 103;

  if (robot.position[0] < 0) {
    robot.position[0] += 101;
  }
  if (robot.position[1] < 0) {
    robot.position[1] += 103;
  }
});

const quadrants = robots.reduce(
  (acc, robot) => {
    if (robot.position[0] < 50 && robot.position[1] < 51) {
      acc.topLeft++;
    } else if (robot.position[0] > 50 && robot.position[1] < 51) {
      acc.topRight++;
    } else if (robot.position[0] < 50 && robot.position[1] > 51) {
      acc.bottomLeft++;
    } else if (robot.position[0] > 50 && robot.position[1] > 51) {
      acc.bottomRight++;
    }
    return acc;
  },
  {
    topLeft: 0,
    topRight: 0,
    bottomLeft: 0,
    bottomRight: 0,
  },
);

console.log(robots);

console.log(quadrants.bottomLeft * quadrants.bottomRight * quadrants.topLeft * quadrants.topRight);
