function overshot([x, y]: [number, number]): boolean {
  return x > 240 || y < -126;
}

function inTarget([x, y]: [number, number]): boolean {
  return x >= 217 && x <= 240 && y >= -126 && y <= -69;
}

function validVelocity(velocity: [number, number]): boolean {
  const position: [number, number] = [0, 0];
  while (!overshot(position)) {
    if (inTarget(position)) {
      return true;
    }
    position[0] += velocity[0];
    position[1] += velocity[1];

    velocity[0] -= Math.sign(velocity[0]);
    velocity[1]--;
  }
  return false;
}

let validShots = 0;

for (let x = 21; x <= 240; x++) {
  for (let y = -126; y <= 125; y++) {
    if (validVelocity([x, y])) {
      validShots++;
    }
  }
}

console.log(validShots);
