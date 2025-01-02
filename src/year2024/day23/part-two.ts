import { readFileSync } from 'fs';

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

function findLargestCluster(graph: Record<string, string[]>): { size: number; nodes: string[] } {
  let largestCluster: string[] = [];

  function bronKerbosch(r: Set<string>, p: Set<string>, x: Set<string>): void {
    if (p.size === 0 && x.size === 0) {
      // Found a maximal clique
      if (r.size > largestCluster.length) {
        largestCluster = Array.from(r);
      }
      return;
    }

    const pCopy = Array.from(p);
    for (const node of pCopy) {
      const neighbors = new Set(graph[node]);

      bronKerbosch(
        new Set([...r, node]),
        new Set([...p].filter((v) => neighbors.has(v))),
        new Set([...x].filter((v) => neighbors.has(v))),
      );

      p.delete(node);
      x.add(node);
    }
  }

  const allNodes = new Set(Object.keys(graph));
  bronKerbosch(new Set(), allNodes, new Set());

  return { size: largestCluster.length, nodes: largestCluster };
}

console.log(findLargestCluster(nodeMap).nodes.sort().join(','));
