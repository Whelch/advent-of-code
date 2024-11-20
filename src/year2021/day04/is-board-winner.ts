import { chain, constant, times } from 'lodash';

export function isBoardWinner(board: number[][]): boolean {
  const cols = times(5, constant(0));
  const winningRows = chain(board)
    .forEach((row) => row.forEach((val, index) => isNaN(val) && cols[index]++))
    .filter((row) => row.every(isNaN))
    .size()
    .valueOf();

  return cols.some((val) => val === 5) || winningRows > 0;
}
