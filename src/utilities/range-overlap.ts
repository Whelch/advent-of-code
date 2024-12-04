import { Range } from '../types/range';

interface Args {
  sourceRange: Range;
  targetRange: Range;
}

interface RangeOverlapResponse {
  /**
   * The section of the ranges that overlap
   */
  overlapRange?: Range;
  /**
   * The remaining source range without the overlapping section.
   * This could be 2 ranges if the overlap is only part of the middle
   */
  remainingSourceRange: Range[];
}

export function rangeOverlap({ sourceRange, targetRange }: Args): RangeOverlapResponse {
  if (sourceRange.start >= targetRange.start && sourceRange.start <= targetRange.end) {
    if (sourceRange.end <= targetRange.end) {
      return {
        overlapRange: { ...sourceRange },
        remainingSourceRange: [],
      };
    } else {
      return {
        overlapRange: { start: sourceRange.start, end: targetRange.end },
        remainingSourceRange: [{ start: targetRange.end + 1, end: sourceRange.end }],
      };
    }
  } else if (sourceRange.end >= targetRange.start && sourceRange.end <= targetRange.end) {
    return {
      overlapRange: { start: targetRange.start, end: sourceRange.end },
      remainingSourceRange: [{ start: sourceRange.start, end: targetRange.start - 1 }],
    };
  } else if (sourceRange.start < targetRange.start && sourceRange.end > targetRange.end) {
    return {
      overlapRange: { ...targetRange },
      remainingSourceRange: [
        { start: sourceRange.start, end: targetRange.start - 1 },
        { start: targetRange.end + 1, end: sourceRange.end },
      ],
    };
  } else {
    return {
      remainingSourceRange: [{ ...sourceRange }],
    };
  }
}
