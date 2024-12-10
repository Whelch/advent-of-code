import { readFileSync } from 'fs';
import { findIndex } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);
const line = file.toString();

let spaceMap = line
  .split('')
  .map(Number)
  .map((length, index) => ({
    id: index % 2 === 0 ? index / 2 : -1,
    length,
  }))
  .filter((node) => node.length > 0);

let checkIndex = spaceMap.length - 1;
let checkId = spaceMap[checkIndex].id;
let freeSpaceIndex = findIndex(spaceMap, (node) => node.id === -1);

while (checkIndex > freeSpaceIndex) {
  let i = freeSpaceIndex;

  while (checkIndex > freeSpaceIndex && spaceMap[checkIndex].id === -1) {
    checkIndex--;
  }

  while (i < checkIndex) {
    if (spaceMap[i].length >= spaceMap[checkIndex].length) {
      if (spaceMap[i].length === spaceMap[checkIndex].length) {
        spaceMap[i] = { ...spaceMap[checkIndex] };
        spaceMap[checkIndex].id = -1;
      } else {
        spaceMap[i].length -= spaceMap[checkIndex].length;
        spaceMap.splice(i, 1, { ...spaceMap[checkIndex] }, spaceMap[i]);
        spaceMap[checkIndex + 1].id = -1;
      }
      break;
    } else {
      i++;
      while (i < checkIndex && spaceMap[i].id >= 0) {
        i++;
      }
    }
  }

  checkId--;
  checkIndex = spaceMap.findIndex((node) => node.id === checkId);

  freeSpaceIndex = findIndex(spaceMap, (node) => node.id === -1);
}

let blockIndex = 0;
let sum = 0;

while (spaceMap.length > 0) {
  let chunk = spaceMap.shift();

  for (let i = 0; i < chunk.length; i++) {
    if (chunk.id > 0) {
      sum += chunk.id * blockIndex;
    }
    blockIndex++;
  }
}

console.log(sum);
