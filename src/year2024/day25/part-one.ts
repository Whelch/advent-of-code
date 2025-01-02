import { readFileSync } from 'fs';

const file = readFileSync(`${__dirname}/input.txt`);

const locks: number[][] = [];
const keys: number[][] = [];

file
  .toString()
  .split('\n\n')
  .map((keyLock) => {
    const lines = keyLock.split('\n');
    const colCount: number[] = [-1, -1, -1, -1, -1];

    for (let i = 0; i < lines.length; i++) {
      for (let j = 0; j < lines[i].length; j++) {
        if (lines[i][j] === '#') {
          colCount[j]++;
        }
      }
    }

    if (lines[0][0] === '#') {
      locks.push(colCount);
    } else {
      keys.push(colCount);
    }
  });

let pairs = 0;

function isValidLockKey(lock: number[], key: number[]) {
  return lock.every((l, index) => l + key[index] < 6);
}

for (let i = 0; i < locks.length; i++) {
  console.log('on lock: ', i);
  for (let j = 0; j < keys.length; j++) {
    if (isValidLockKey(locks[i], keys[j])) {
      pairs++;
    }
  }
}

console.log(pairs);
