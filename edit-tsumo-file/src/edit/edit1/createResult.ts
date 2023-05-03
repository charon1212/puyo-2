import { startMap } from './startMap';
import { Map4, Result, Start } from './type';

export const createResult = (line: string, id: string): { result: Result, start: Start } => {
  const m = startMap.find((v) => v.key === line.substring(0, 4));
  if (!m) throw new Error(`Not found start map. key=${line.substring(0, 4)}, id=${id}`);
  const allClear = searchAllClear(line);
  const pattern = convert(line, m.map);
  return { start: m.start, result: { id, allClear, pattern } };
};

/** 初手から数えていき、各ぷよが全て0 or 4個以上となる最小の手数を求める。50手まで探してなければ-1を返却する。 */
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
