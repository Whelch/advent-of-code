import { readFileSync } from 'fs';

const file = readFileSync(`${__dirname}/input.txt`);

console.log(file);
