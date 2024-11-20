let scores = [0, 0];
let positions = [5, 1];

let die = 1;
let rolls = 0;
let turn = 0;

function getDieValue(): number {
  rolls++;
  if (die === 100) {
    die = 1;
    return 100;
  } else {
    return die++;
  }
}

while (scores[0] < 1000 && scores[1] < 1000) {
  const move = getDieValue() + getDieValue() + getDieValue();

  positions[turn] = (positions[turn] + move) % 10;

  scores[turn] += positions[turn] + 1;

  turn = (turn + 1) % 2;
}

console.log(Math.min(...scores) * rolls);
