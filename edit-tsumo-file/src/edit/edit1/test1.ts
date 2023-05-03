import { Map4 } from "./type";

const convert = (line: string, map: Map4) => {
  let converted = line;
  converted = converted.replace(/0/g, 'a');
  converted = converted.replace(/1/g, 'b');
  converted = converted.replace(/2/g, 'c');
  converted = converted.replace(/3/g, 'd');
  converted = converted.replace(/a/g, map['0']);
  converted = converted.replace(/b/g, map['1']);
  converted = converted.replace(/c/g, map['2']);
  converted = converted.replace(/d/g, map['3']);
  return converted;
};
const searchAllClear = (line: string) => {
  let counter = [0, 0, 0, 0];
  for (let i = 0; i < 50; i++) {
    const i1 = +line[2 * i];
    const i2 = +line[2 * i + 1];
    counter[i1]++;
    counter[i2]++;
    if (counter.every((x) => x === 0 || x >= 4)) return i + 1;
  }
  return -1;
};


export const test1 = () => {
  expect(convert('00112233', { 0: '1', 1: '2', 2: '3', 3: '4' })).toBe('11223344');
  expect(searchAllClear('00001211033000031021')).toBe(2);
  expect(searchAllClear('00112201010101223322')).toBe(8);
  console.log('ALL TEST CLEAR');
};

const expect = (act: any) => ({ toBe: (exp: any) => { if (exp !== act) throw new Error(`Assertion Error. ${JSON.stringify({ exp, act })}`) } });
