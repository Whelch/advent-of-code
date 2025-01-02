import { readFileSync } from 'fs';
import { sum } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);
const connections: [string, string][] = file
  .toString()
  .split('\n')
  .map((line) => line.split('-') as [string, string]);

const nodeMap: Record<string, string[]> = {};

connections.forEach(([a, b]) => {
  nodeMap[a] ??= [];
  nodeMap[a].push(b);

  nodeMap[b] ??= [];
  nodeMap[b].push(a);
});

const dontCount: string[] = [];

const counts = Object.entries(nodeMap).map(([name, connectedTo]) => {
  if (name[0] !== 't') {
    return 0;
  }

  const localDontCount = [];

  const triplets = connectedTo.map((n) => {
    if (dontCount.includes(n)) {
      return 0;
    }
    const otherConnections = nodeMap[n];
    const triConnections = otherConnections.filter((c) => {
      return c !== n && !localDontCount.includes(c) && !dontCount.includes(c) && connectedTo.includes(c);
    });

    if (triConnections.length) {
      console.log(name, n, triConnections);
    }
    localDontCount.push(n);
    return triConnections.length;
  });

  dontCount.push(name);

  return sum(triplets);
});

console.log(sum(counts));
