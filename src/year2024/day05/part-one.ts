import { readFileSync } from 'fs';
import { sum } from 'lodash';

const file = readFileSync(`${__dirname}/i`);
const [rules, books] = file.toString().split('\n\n');

const ruleMap: Record<string, string[]> = rules.split('\n').reduce((acc, rule) => {
  const [before, after] = rule.split('|');
  if (!acc[after]) {
    acc[after] = [];
  }
  acc[after].push(before);
  return acc;
}, {});

function isGoodBook(bookPages: string[]) {
  const bannedAfters: string[] = [];

  return bookPages.every((page) => {
    if (ruleMap[page]) {
      bannedAfters.push(...ruleMap[page]);
    }
    return !bannedAfters.includes(page);
  });
}

const goodBooks = books
  .split('\n')
  .map((book) => book.split(','))
  .filter(isGoodBook);

console.log(sum(goodBooks.map((book) => Number(book[Math.floor(book.length / 2)]))));
