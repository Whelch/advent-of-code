import { readFileSync } from 'fs';
import { chain, unzip } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

type Vector = [number, number, number];

type Rect = [Vector, Vector];

interface CutResponse {
  cutout: Rect;
  remaining: Rect;
}

function parseLine(line: string): [boolean, Vector, Vector] {
  let [instruction, coordinates] = line.split(' ') as ['on' | 'off', string];

  coordinates = coordinates.replace(/x=/, '').replace(/y=/, '').replace(/z=/, '');

  const ranges = coordinates.split(',').map((coord) => coord.split('..').map((val) => +val));

  return [instruction === 'on', ...(unzip(ranges) as [Vector, Vector])];
}

let procedures = chain(file).split('\n').map(parseLine).valueOf();

function sliceLowX(rect: Rect, obstacle: Rect): CutResponse {
  if (rect[0][0] < obstacle[0][0]) {
    const highX = Math.min(obstacle[0][0] - 1, rect[1][0]);
    return {
      cutout: [rect[0], [highX, rect[1][1], rect[1][2]]],
      remaining: highX === rect[1][0] ? undefined : [[highX + 1, rect[0][1], rect[0][2]], rect[1]],
    };
  }
}

function sliceHighX(rect: Rect, obstacle: Rect): CutResponse {
  if (rect[1][0] > obstacle[1][0]) {
    const lowX = Math.max(obstacle[1][0] + 1, rect[0][0]);
    return {
      cutout: [[lowX, rect[0][1], rect[0][2]], rect[1]],
      remaining: lowX === rect[0][0] ? undefined : [rect[0], [lowX - 1, rect[1][1], rect[1][2]]],
    };
  }
}

function sliceLowY(rect: Rect, obstacle: Rect): CutResponse {
  if (rect[0][1] < obstacle[0][1]) {
    const highY = Math.min(obstacle[0][1] - 1, rect[1][1]);
    return {
      cutout: [rect[0], [rect[1][0], highY, rect[1][2]]],
      remaining: highY === rect[1][1] ? undefined : [[rect[0][0], highY + 1, rect[0][2]], rect[1]],
    };
  }
}

function sliceHighY(rect: Rect, obstacle: Rect): CutResponse {
  if (rect[1][1] > obstacle[1][1]) {
    const lowY = Math.max(obstacle[1][1] + 1, rect[0][1]);
    return {
      cutout: [[rect[0][0], lowY, rect[0][2]], rect[1]],
      remaining: lowY === rect[0][1] ? undefined : [rect[0], [rect[1][0], lowY - 1, rect[1][2]]],
    };
  }
}

function sliceLowZ(rect: Rect, obstacle: Rect): CutResponse {
  if (rect[0][2] < obstacle[0][2]) {
    const highZ = Math.min(obstacle[0][2] - 1, rect[1][2]);
    return {
      cutout: [rect[0], [rect[1][0], rect[1][1], highZ]],
      remaining: highZ === rect[1][2] ? undefined : [[rect[0][0], rect[0][1], highZ - 1], rect[1]],
    };
  }
}

function sliceHighZ(rect: Rect, obstacle: Rect): CutResponse {
  if (rect[1][2] > obstacle[1][2]) {
    const lowZ = Math.max(obstacle[1][2] + 1, rect[0][2]);
    return {
      cutout: [[rect[0][0], rect[0][1], lowZ], rect[1]],
      remaining: lowZ === rect[0][2] ? undefined : [rect[0], [rect[1][0], rect[1][1], lowZ]],
    };
  }
}

function turnOff(currentRects: Rect[], obstacle: Rect): Rect[] {
  let newRects: Rect[] = [];
  currentRects.forEach((rect) => {
    let lowXResponse = sliceLowX(rect, obstacle);
    if (lowXResponse) {
      newRects.push(lowXResponse.cutout);
      rect = lowXResponse.remaining;
    }

    if (rect) {
      let highXResponse = sliceHighX(rect, obstacle);
      if (highXResponse) {
        newRects.push(highXResponse.cutout);
        rect = highXResponse.remaining;
      }
    }

    if (rect) {
      let lowYResponse = sliceLowY(rect, obstacle);
      if (lowYResponse) {
        newRects.push(lowYResponse.cutout);
        rect = lowYResponse.remaining;
      }
    }

    if (rect) {
      let highYResponse = sliceHighY(rect, obstacle);
      if (highYResponse) {
        newRects.push(highYResponse.cutout);
        rect = highYResponse.remaining;
      }
    }

    if (rect) {
      let lowZResponse = sliceLowZ(rect, obstacle);
      if (lowZResponse) {
        newRects.push(lowZResponse.cutout);
        rect = lowZResponse.remaining;
      }
    }

    if (rect) {
      let highZResponse = sliceHighZ(rect, obstacle);
      if (highZResponse) {
        newRects.push(highZResponse.cutout);
      }
    }
  });

  return newRects;
}

let rects: Rect[] = [];

const [on, lowBound, highBound] = procedures.shift();
rects.push([lowBound, highBound]);

procedures.forEach(([on, lowBound, highBound], index) => {
  console.log(`Procedure ${index} of ${procedures.length}`);

  let newRect: Rect = [lowBound, highBound];
  if (!on) {
    rects = turnOff(rects, newRect);
  } else {
    let newRects: Rect[] = [newRect];
    rects.forEach((obstacle) => {
      const toCutRects = [...newRects];
      newRects = [];
      toCutRects.forEach((rect) => {
        let lowXResponse = sliceLowX(rect, obstacle);
        if (lowXResponse) {
          newRects.push(lowXResponse.cutout);
          rect = lowXResponse.remaining;
        }

        if (rect) {
          let highXResponse = sliceHighX(rect, obstacle);
          if (highXResponse) {
            newRects.push(highXResponse.cutout);
            rect = highXResponse.remaining;
          }
        }

        if (rect) {
          let lowYResponse = sliceLowY(rect, obstacle);
          if (lowYResponse) {
            newRects.push(lowYResponse.cutout);
            rect = lowYResponse.remaining;
          }
        }

        if (rect) {
          let highYResponse = sliceHighY(rect, obstacle);
          if (highYResponse) {
            newRects.push(highYResponse.cutout);
            rect = highYResponse.remaining;
          }
        }

        if (rect) {
          let lowZResponse = sliceLowZ(rect, obstacle);
          if (lowZResponse) {
            newRects.push(lowZResponse.cutout);
            rect = lowZResponse.remaining;
          }
        }

        if (rect) {
          let highZResponse = sliceHighZ(rect, obstacle);
          if (highZResponse) {
            newRects.push(highZResponse.cutout);
          }
        }
      });
    });
    rects.push(...newRects);
  }
});

let answer = 0;

rects.forEach(([[x0, y0, z0], [x1, y1, z1]]) => {
  const area = (x1 - x0 + 1) * (y1 - y0 + 1) * (z1 - z0 + 1);
  answer += area;
});

console.log(answer);
