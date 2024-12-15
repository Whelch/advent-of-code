import { readFileSync } from 'fs';

const file = readFileSync(`${__dirname}/input.txt`);
const lines = file.toString().split('\n');

let position = 5;
let code = '';
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].split('');
  while (line.length > 0) {
    switch (line.shift()) {
      case 'U':
        if (position > 3) {
          position -= 3;
        }
        break;
      case 'D':
        if (position < 7) {
          position += 3;
        }
        break;
      case 'L':
        if (position % 3 !== 1) {
          position--;
        }
        break;
      case 'R':
        if (position % 3 !== 0) {
          position++;
        }
        break;
    }
  }
  code += position;
}

console.log(code);
