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

  return bookPages.every((page, index) => {
    if (ruleMap[page]) {
      bannedAfters.push(...ruleMap[page]);
    }
    return !bannedAfters.includes(page);
  });
}

const badBooks = books
  .split('\n')
  .map((book) => book.split(','))
  .filter((bookPages) => !isGoodBook(bookPages));

const fixedBooks = badBooks.map((bookPages) => {
  while (!isGoodBook(bookPages)) {
    const bannedAfters: string[] = [];
    for (let i = 0; i < bookPages.length; i++) {
      if (ruleMap[bookPages[i]]) {
        bannedAfters.push(...ruleMap[bookPages[i]]);
      }
      if (bannedAfters.includes(bookPages[i])) {
        bookPages = [...bookPages.slice(0, i - 1), bookPages[i], bookPages[i - 1], ...bookPages.slice(i + 1)];
      }
    }
  }

  return bookPages;
});

console.log(sum(fixedBooks.map((book) => Number(book[Math.floor(book.length / 2)]))));
