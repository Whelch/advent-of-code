import { readFileSync } from 'fs';
import { chain, get } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

let [enhancementMap, baseImageString] = chain(file).split('\n\n').valueOf();

enhancementMap = enhancementMap.replace(/#/g, '1').replace(/\./g, '0');

const baseImage: string[][] = chain(baseImageString)
  .split('\n')
  .map((line) => line.split('').map((cell) => (cell === '#' ? '1' : '0')))
  .valueOf();

function enhanceImagePixel(image: string[][], x: number, y: number, oobPixel: '0' | '1'): string {
  let binary = '';

  binary += get(image, [y - 1, x - 1], oobPixel);
  binary += get(image, [y - 1, x], oobPixel);
  binary += get(image, [y - 1, x + 1], oobPixel);
  binary += get(image, [y, x - 1], oobPixel);
  binary += get(image, [y, x], oobPixel);
  binary += get(image, [y, x + 1], oobPixel);
  binary += get(image, [y + 1, x - 1], oobPixel);
  binary += get(image, [y + 1, x], oobPixel);
  binary += get(image, [y + 1, x + 1], oobPixel);
  const decimal = Number.parseInt(binary, 2);

  return enhancementMap[decimal];
}

function enhanceImage(image: string[][], generation: number): string[][] {
  const newImage: string[][] = [];

  for (let y = -1; y < image.length + 1; y++) {
    newImage[y + 1] = [];
    for (let x = -1; x < image[0].length + 1; x++) {
      newImage[y + 1][x + 1] = enhanceImagePixel(image, x, y, generation % 2 === 0 ? '0' : '1');
    }
  }

  return newImage;
}

let enhancedImage = baseImage;

for (let i = 0; i < 2; i++) {
  enhancedImage = enhanceImage(enhancedImage, i);
}

const answer = chain(enhancedImage).flatten().without('0').size().valueOf();

console.log(answer); //5347
