import { chain } from 'lodash';

export function parseBoard(input: string) {
  return chain(input)
    .split('\n')
    .map((row) =>
      row
        .trim()
        .split(/ +/)
        .map((val) => +val),
    )
    .valueOf();
}
