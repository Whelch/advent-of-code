import { forEach, get, setWith } from 'lodash';

const rollWeights: Record<number, number> = {
  3: 1,
  4: 3,
  5: 6,
  6: 7,
  7: 6,
  8: 3,
  9: 1,
};

/**
 * {
 *   p1 score: {
 *     p2 score: {
 *       p1 position: {
 *         p2 position: multiplicity
 *       }
 *     }
 *   }
 * }
 */
type UniverseMap = Record<number, Record<number, Record<number, Record<number, number>>>>;

let universesMap: UniverseMap = {};

let universeWinners: [number, number] = [0, 0];

setWith(universesMap, [0, 0, 5, 1], 1, Object);

let turn = 0;

const startTime = new Date();

while (Object.keys(universesMap).length > 0) {
  const newUniverseMap: UniverseMap = {};

  forEach(universesMap, (p2Scores, p1Score) => {
    forEach(p2Scores, (p1Positions, p2Score) => {
      forEach(p1Positions, (p2Positions, p1Position) => {
        forEach(p2Positions, (multiplicity, p2Position) => {
          for (let i = 3; i <= 9; i++) {
            const positions: [number, number] = [+p1Position, +p2Position];
            const scores: [number, number] = [+p1Score, +p2Score];
            const newMultiplicity = multiplicity * rollWeights[i];
            positions[turn] = (positions[turn] + i) % 10;
            scores[turn] += positions[turn] + 1;

            if (scores[turn] >= 21) {
              universeWinners[turn] += newMultiplicity;
            } else {
              const currMultiplicity = get(newUniverseMap, [scores[0], scores[1], positions[0], positions[1]], 0);
              setWith(
                newUniverseMap,
                [scores[0], scores[1], positions[0], positions[1]],
                currMultiplicity + newMultiplicity,
                Object,
              );
            }
          }
        });
      });
    });
  });

  turn = (turn + 1) % 2;

  universesMap = newUniverseMap;
}

const endTime = new Date();

console.log(`algorithm run time: ${endTime.valueOf() - startTime.valueOf()}ms`);

console.log(universeWinners);
