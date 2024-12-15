import { readFileSync } from 'fs';

const file = readFileSync(`${__dirname}/input.txt`);
const [gridInput, instructionInput] = file.toString().split('\n\n');

const grid = gridInput.split('\n').map((line) => line.split(''));
const instructions = instructionInput.split('\n').join('').split('') as Direction[];

enum Direction {
  Up = '^',
  Down = 'v',
  Left = '<',
  Right = '>',
}

function directionChange(direction: Direction): [number, number] {
  switch (direction) {
    case Direction.Up:
      return [-1, 0];
    case Direction.Down:
      return [1, 0];
    case Direction.Left:
      return [0, -1];
    case Direction.Right:
      return [0, 1];
  }
}

function move(x: number, y: number, direction: Direction): boolean {
  const [directionX, directionY] = directionChange(direction);

  switch (grid[x]?.[y]) {
    case '.':
      return true;
    case '@':
      if (move(x + directionX, y + directionY, direction)) {
        grid[x][y] = '.';
        grid[x + directionX][y + directionY] = '@';
        return true;
      }
      return false;
    case '#':
      return false;
    case 'O':
      if (move(x + directionX, y + directionY, direction)) {
        grid[x][y] = '.';
        grid[x + directionX][y + directionY] = 'O';
        return true;
      } else {
        return false;
      }
    default:
      return false;
  }
}

let xPos = -1;
let yPos = -1;

for (let i = 0; i < grid.length; i++) {
  yPos = grid[i].findIndex((cell) => cell === '@');
  if (yPos !== -1) {
    xPos = i;
    break;
  }
}

instructions.forEach((direction) => {
  if (move(xPos, yPos, direction)) {
    const [directionX, directionY] = directionChange(direction);
    xPos += directionX;
    yPos += directionY;
  }
});

let sum = 0;

for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[i].length; j++) {
    if (grid[i][j] === 'O') {
      sum += 100 * i + j;
    }
  }
}

console.log(sum);
