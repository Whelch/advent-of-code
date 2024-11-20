import { readFileSync } from 'fs';
import { chain, sum } from 'lodash';

const file = readFileSync(`${__dirname}/input.txt`);

interface Packet {
  version: number;
  type: number;
  packetLength: number;
  literalValue?: number;
  lengthType?: number;
  length?: number;
  subPackets?: Packet[];
}

function decodeHex(hexChar: string): string {
  switch (hexChar) {
    case '0':
      return '0000';
    case '1':
      return '0001';
    case '2':
      return '0010';
    case '3':
      return '0011';
    case '4':
      return '0100';
    case '5':
      return '0101';
    case '6':
      return '0110';
    case '7':
      return '0111';
    case '8':
      return '1000';
    case '9':
      return '1001';
    case 'A':
      return '1010';
    case 'B':
      return '1011';
    case 'C':
      return '1100';
    case 'D':
      return '1101';
    case 'E':
      return '1110';
    case 'F':
      return '1111';
  }
}

function parseLiteralValue(input: string): [number, string] {
  let literalValue = '';
  let signalBit = '1';
  while (signalBit !== '0') {
    signalBit = input[0];
    literalValue += input.slice(1, 5);
    input = input.substring(5);
  }

  return [Number.parseInt(literalValue, 2), input];
}

function parsePacket(input: string): [Packet, string] {
  const startLength = input.length;
  const version = Number.parseInt(input.slice(0, 3), 2);
  input = input.substring(3);
  const type = Number.parseInt(input.slice(0, 3), 2);
  input = input.substring(3);

  if (type === 4) {
    const [literalValue, remainderInput] = parseLiteralValue(input);
    const packetLength = startLength - remainderInput.length;
    const packet: Packet = {
      version,
      type,
      literalValue,
      packetLength,
    };

    return [packet, remainderInput];
  } else {
    const lengthType = Number.parseInt(input.slice(0, 1), 2);
    input = input.substring(1);

    if (lengthType === 0) {
      const length = Number.parseInt(input.slice(0, 15), 2);
      input = input.substring(15);

      let subPacketLengths = 0;
      const subPackets = [];
      while (subPacketLengths !== length) {
        const [subPacket, remainderInput] = parsePacket(input);
        input = remainderInput;
        subPackets.push(subPacket);
        subPacketLengths += subPacket.packetLength;
      }

      const packetLength = startLength - input.length;
      const packet: Packet = {
        version,
        type,
        lengthType,
        length,
        subPackets,
        packetLength,
      };

      return [packet, input];
    } else {
      const length = Number.parseInt(input.slice(0, 11), 2);
      input = input.substring(11);

      const subPackets = [];
      for (let i = 0; i < length; i++) {
        const [subPacket, remainderInput] = parsePacket(input);
        input = remainderInput;
        subPackets.push(subPacket);
      }

      const packetLength = startLength - input.length;
      const packet: Packet = {
        version,
        type,
        lengthType,
        length,
        subPackets,
        packetLength,
      };

      return [packet, input];
    }
  }
}

function evaluatePacket(packet: Packet): number {
  switch (packet.type) {
    case 0:
      return sum(packet.subPackets.map(evaluatePacket));
    case 1:
      return packet.subPackets.map(evaluatePacket).reduce((prev, curr) => prev * curr);
    case 2:
      return Math.min(...packet.subPackets.map(evaluatePacket));
    case 3:
      return Math.max(...packet.subPackets.map(evaluatePacket));
    case 4:
      return packet.literalValue;
    case 5:
      return evaluatePacket(packet.subPackets[0]) > evaluatePacket(packet.subPackets[1]) ? 1 : 0;
    case 6:
      return evaluatePacket(packet.subPackets[0]) < evaluatePacket(packet.subPackets[1]) ? 1 : 0;
    case 7:
      return evaluatePacket(packet.subPackets[0]) === evaluatePacket(packet.subPackets[1]) ? 1 : 0;
  }
}

let input: string = chain(file).split('').map(decodeHex).flatten().join('').valueOf();

const [packet] = parsePacket(input);

console.log(evaluatePacket(packet));
