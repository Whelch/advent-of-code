import { readFileSync } from 'fs';
import { chain, last } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

let roomConnections = chain(file)
  .split('\n')
  .map((line) => line.split('-'))
  .valueOf();

const rooms: Record<string, string[]> = chain(roomConnections)
  .flatten()
  .uniq()
  .reduce(
    (agg: Record<string, string[]>, room: string) => ({
      ...agg,
      [room]: chain(roomConnections)
        .filter((connection) => connection.includes(room))
        .flatten()
        .without(room, 'start')
        .valueOf(),
    }),
    {} as Record<string, string[]>,
  )
  .valueOf();

function isBigRoom(roomName: string): boolean {
  return roomName === roomName.toUpperCase();
}

function validAdditionToPath(path: string[], newRoom: string): boolean {
  return isBigRoom(newRoom) || path.every((room) => room !== newRoom);
}

const unfinishedPaths: string[][] = [['start']];
let numberOfPaths = 0;

while (unfinishedPaths.length > 0) {
  const path = unfinishedPaths.pop();

  rooms[last(path)].forEach((connectedRoom) => {
    if (validAdditionToPath(path, connectedRoom)) {
      if (connectedRoom === 'end') {
        numberOfPaths++;
      } else {
        unfinishedPaths.push([...path, connectedRoom]);
      }
    }
  });
}

console.log(numberOfPaths);
