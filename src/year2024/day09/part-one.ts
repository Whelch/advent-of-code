import { readFileSync } from 'fs';

const file = readFileSync(`${__dirname}/input.txt`);
const line = file.toString();

let remaining = line.split('').map(Number);
let fileIndex = 0;
let blockIndex = 0;
let isFile = true;
let sum = 0;

while (remaining.length > 0) {
  let blockSize = remaining.shift();
  if (isFile) {
    for (let i = 0; i < blockSize; i++) {
      sum += fileIndex * blockIndex;
    }
  } else {
    while (blockSize > 0) {
      if (remaining[remaining.length - 1] === 0) {
        remaining.pop();
      }
      if (remaining.length % 2 === 0) {
        remaining.pop();
      }

      if (remaining.length === 0) {
        break;
      }

      remaining[remaining.length - 1]--;

      const lastFileIndex = Math.ceil(remaining.length / 2) + fileIndex;
      sum += lastFileIndex * blockIndex++;
      blockSize--;
    }

    fileIndex++;
  }

  isFile = !isFile;
}

console.log(sum);
