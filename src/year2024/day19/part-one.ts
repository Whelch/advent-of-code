import { readFileSync } from 'fs';

const file = readFileSync(`${__dirname}/input.txt`);
const [towelLines, designLines]: string[] = file.toString().split('\n\n');

const towels = towelLines.split(',').map((towel) => {
  return towel.trim();
});
const designs = designLines.split('\n');

console.log(designs);

function findDesign(design: string): boolean {
  if (design === '') {
    return true;
  }
  let foundIndex = towels.findIndex((towel) => design.startsWith(towel));

  while (foundIndex >= 0) {
    console.log('foundIndex: ', foundIndex, design);
    // console.log('foundIndex: ', foundIndex, design);
    const remainingDesign = design.slice(towels[foundIndex].length);
    const works = findDesign(remainingDesign);
    if (works) {
      return true;
    } else {
      foundIndex = towels.findIndex((towel, index) => {
        return index > foundIndex && design.startsWith(towel);
      });
    }
  }

  return false;
}

const possibleDesigns = designs.filter((design) => {
  console.log('finding design: ', design);
  return findDesign(design);
});

console.log(possibleDesigns.length);
