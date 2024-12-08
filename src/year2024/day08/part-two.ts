import { readFileSync } from 'fs';
import { sum } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);
const lines = file.toString().split('\n');

interface Node {
  x: number;
  y: number;
  freq: string;
}

const map: Record<string, Node[]> = {};

lines.forEach((line, x) => {
  for (let y = 0; y < line.length; y++) {
    if (line[y] !== '.') {
      const node: Node = {
        x,
        y,
        freq: line[y],
      };
      map[line[y]] ??= [];
      map[line[y]].push(node);
    }
  }
});

const antiNodes: number[][] = [];
for (let i = 0; i < lines.length; i++) {
  antiNodes[i] = [];
  for (let j = 0; j < lines[i].length; j++) {
    antiNodes[i][j] = 0;
  }
}

function recursion(node: Node, pairNodes: Node[]) {
  pairNodes.forEach((pairNode) => {
    let distX = node.x - pairNode.x;
    let distY = node.y - pairNode.y;

    antiNodes[node.x][node.y] = 1;
    antiNodes[pairNode.x][pairNode.y] = 1;

    let addedNewNode = true;

    while (addedNewNode) {
      const newX1 = node.x + distX;
      const newY1 = node.y + distY;

      const newX2 = pairNode.x - distX;
      const newY2 = pairNode.y - distY;

      addedNewNode = false;
      if (newX1 >= 0 && newX1 < lines.length && newY1 >= 0 && newY1 < lines[0].length) {
        antiNodes[newX1][newY1] = 1;
        addedNewNode = true;
      }
      if (newX2 >= 0 && newX2 < lines.length && newY2 >= 0 && newY2 < lines[0].length) {
        antiNodes[newX2][newY2] = 1;
        addedNewNode = true;
      }

      distX += node.x - pairNode.x;
      distY += node.y - pairNode.y;
    }
  });

  if (pairNodes.length > 1) {
    const newNode = pairNodes.shift();
    recursion(newNode, [...pairNodes]);
  }
}

Object.entries(map).forEach(([key, nodes]) => {
  recursion(nodes.shift(), [...nodes]);
});

console.log(sum(antiNodes.map((line) => sum(line))));
