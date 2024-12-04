import { countBy, max } from 'lodash';

export enum HandType {
  HighCard,
  OnePair,
  TwoPair,
  OfAKind3,
  FullHouse,
  OfAKind4,
  OfAKind5,
}

export interface Hand {
  cards: number[];
  bid: number;
  type: HandType;
}

export function cardCharacterToValue({ card, jValue = 11 }: { card: string; jValue?: number }) {
  switch (card) {
    case 'A':
      return 14;
    case 'K':
      return 13;
    case 'Q':
      return 12;
    case 'J':
      return jValue;
    case 'T':
      return 10;
    default:
      return parseInt(card);
  }
}

export function evaluateHandType(hand: number[]): HandType {
  if (isFiveOfAkind(hand)) {
    return HandType.OfAKind5;
  } else if (isFourOfAkind(hand)) {
    return HandType.OfAKind4;
  } else if (isFullHouse(hand)) {
    return HandType.FullHouse;
  } else if (isThreeOfAkind(hand)) {
    return HandType.OfAKind3;
  } else if (isTwoPair(hand)) {
    return HandType.TwoPair;
  } else if (isOnePair(hand)) {
    return HandType.OnePair;
  } else {
    return HandType.HighCard;
  }
}

function isFiveOfAkind(hand: number[]): boolean {
  const jokers = hand.filter((card) => card === 1).length;
  const withoutJokers = hand.filter((card) => card !== 1);
  const counts = countBy(withoutJokers);
  return jokers === 5 || max(Object.values(counts)) + jokers === 5;
}

function isFourOfAkind(hand: number[]): boolean {
  const jokers = hand.filter((card) => card === 1).length;
  const withoutJokers = hand.filter((card) => card !== 1);
  const counts = countBy(withoutJokers);
  return max(Object.values(counts)) + jokers === 4;
}

function isFullHouse(hand: number[]): boolean {
  const jokers = hand.filter((card) => card === 1).length;
  const withoutJokers = hand.filter((card) => card !== 1);
  const counts = countBy(withoutJokers);
  const [secondMax, max] = Object.values(counts).toSorted().slice(-2);
  console.log({ max, secondMax, jokers });
  return max + jokers === 3 && secondMax === 2;
}

/**
 * Relies on hand not being any higher type
 */
function isThreeOfAkind(hand: number[]): boolean {
  const jokers = hand.filter((card) => card === 1).length;
  const withoutJokers = hand.filter((card) => card !== 1);
  const counts = countBy(withoutJokers);
  return max(Object.values(counts)) + jokers === 3;
}

/**
 * Relies on hand not being any higher type
 */
function isTwoPair(hand: number[]): boolean {
  const counts = countBy(hand);
  return Object.values(counts).filter((count) => count === 2).length === 2;
}

/**
 * Relies on hand not being any higher type
 */
function isOnePair(hand: number[]): boolean {
  const jokers = hand.filter((card) => card === 1).length;
  const withoutJokers = hand.filter((card) => card !== 1);
  const counts = countBy(withoutJokers);
  return max(Object.values(counts)) + jokers === 2;
}

export function handComparator(hand1: Hand, hand2: Hand) {
  if (hand1.type === hand2.type) {
    const card1 = hand1.cards.find((card, index) => card !== hand2.cards[index]);
    const card2 = hand2.cards.find((card, index) => card !== hand1.cards[index]);
    return card1 - card2;
  } else {
    return hand1.type - hand2.type;
  }
}
