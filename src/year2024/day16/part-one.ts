import { readFileSync } from 'fs';

const file = readFileSync(`${__dirname}/input.txt`);
const grid: string[][] = file
  .toString()
  .split('\n')
  .map((line) => line.split(''));

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

function directionRight(direction: Direction): [number, number] {
  switch (direction) {
    case Direction.Up:
      return [0, 1];
    case Direction.Down:
      return [0, -1];
    case Direction.Left:
      return [-1, 0];
    case Direction.Right:
      return [1, 0];
  }
}

function directionLeft(direction: Direction): [number, number] {
  switch (direction) {
    case Direction.Up:
      return [0, -1];
    case Direction.Down:
      return [0, 1];
    case Direction.Left:
      return [1, 0];
    case Direction.Right:
      return [-1, 0];
  }
}

function rotateLeft(direction: Direction): Direction {
  switch (direction) {
    case Direction.Up:
      return Direction.Left;
    case Direction.Down:
      return Direction.Right;
    case Direction.Left:
      return Direction.Down;
    case Direction.Right:
      return Direction.Up;
  }
}

function rotateRight(direction: Direction): Direction {
  switch (direction) {
    case Direction.Up:
      return Direction.Right;
    case Direction.Down:
      return Direction.Left;
    case Direction.Left:
      return Direction.Up;
    case Direction.Right:
      return Direction.Down;
  }
}

interface PotentialNode {
  currentCost: number;
  direction: Direction;
  position: [number, number];
}

const potentialNodes: PotentialNode[] = [];

for (let posX = 0; posX < grid.length; posX++) {
  let posY = grid[posX].indexOf('S');
  if (posY !== -1) {
    potentialNodes.push({
      currentCost: 0,
      direction: Direction.Right,
      position: [posX, posY],
    });
    break;
  }
}

let endPosX = -1;
let endPosY = -1;
for (let posX = 0; posX < grid.length; posX++) {
  let posY = grid[posX].indexOf('E');
  if (posY !== -1) {
    endPosX = posX;
    endPosY = posY;
    break;
  }
}

const visited: number[][] = [];

while (potentialNodes.length > 0) {
  const currentNode = potentialNodes.shift();

  visited[currentNode.position[0]] ??= [];
  visited[currentNode.position[0]][currentNode.position[1]] = currentNode.currentCost;

  const [directionX, directionY] = directionChange(currentNode.direction);
  const [rightX, rightY] = directionRight(currentNode.direction);
  const [leftX, leftY] = directionLeft(currentNode.direction);

  if (currentNode.position[0] === endPosX && currentNode.position[1] === endPosY) {
    console.log('TOTAL COST: ', currentNode.currentCost);
    break;
  }

  if (
    grid[currentNode.position[0] + directionX][currentNode.position[1] + directionY] !== '#' &&
    (!visited[currentNode.position[0] + directionX]?.[currentNode.position[1] + directionY] ||
      visited[currentNode.position[0] + directionX][currentNode.position[1] + directionY] > currentNode.currentCost + 1)
  ) {
    potentialNodes.push({
      currentCost: currentNode.currentCost + 1,
      direction: currentNode.direction,
      position: [currentNode.position[0] + directionX, currentNode.position[1] + directionY],
    });
  }

  if (
    grid[currentNode.position[0] + rightX][currentNode.position[1] + rightY] !== '#' &&
    (!visited[currentNode.position[0] + rightX]?.[currentNode.position[1] + rightY] ||
      visited[currentNode.position[0] + rightX][currentNode.position[1] + rightY] > currentNode.currentCost + 1001)
  ) {
    potentialNodes.push({
      currentCost: currentNode.currentCost + 1001,
      direction: rotateRight(currentNode.direction),
      position: [currentNode.position[0] + rightX, currentNode.position[1] + rightY],
    });
  }

  if (
    grid[currentNode.position[0] + leftX][currentNode.position[1] + leftY] !== '#' &&
    (!visited[currentNode.position[0] + leftX]?.[currentNode.position[1] + leftY] ||
      visited[currentNode.position[0] + leftX][currentNode.position[1] + leftY] > currentNode.currentCost + 1001)
  ) {
    potentialNodes.push({
      currentCost: currentNode.currentCost + 1001,
      direction: rotateLeft(currentNode.direction),
      position: [currentNode.position[0] + leftX, currentNode.position[1] + leftY],
    });
  }

  potentialNodes.sort((a, b) => a.currentCost - b.currentCost);
}
