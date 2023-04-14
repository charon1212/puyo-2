import { PuyoColor, Tsumo } from "../domain/type";
import * as fs from 'fs';
import { binarySearch } from 'util-charon1212';

const defaultTsumoFilePath = `file/output.txt`;

export class TsumoManager {
  public list: Tsumo[][];
  constructor(private lineList: string[]) {
    this.list = lineList.map((v) => convert(v));
  }
  static createFromFile(filePath?: string) {
    const lines = fs.readFileSync(filePath ?? defaultTsumoFilePath).toString().split('\r\n').filter((line) => line);
    return new TsumoManager(lines)
  }
  getRandom() {
    if (this.lineList.length === 0) throw new Error('登録なし。');
    const i = Math.floor(Math.random() * this.lineList.length);
    return convert(this.lineList[i]);
  }
  search(prefixTsumo: Tsumo[]) {
    if (prefixTsumo.length === 0) return this.list;
    const prefixStart = prefixTsumo.map(([t1, t2]) => `${t1 - 1}${t2 - 1}`).join('');
    const prefixEnd = prefixStart.slice(0, -1) + `${(+prefixStart[prefixStart.length - 1] + 1)}`;

    const indexStart = binarySearch(this.lineList, (t) => t < prefixStart);
    const indexEnd = binarySearch(this.lineList, (t) => t < prefixEnd);
    console.log(JSON.stringify({ log: 'TsumoManager.search', prefixStart, prefixEnd, indexStart, indexEnd }));
    return this.list.slice(indexStart === -1 ? 0 : indexStart, indexEnd);
  }
  getPattern(prefixTsumo: Tsumo[], patternNum: number) {
    const searched = this.search(prefixTsumo);
    const patterns = searched.map((v) => v.filter((_, i) => i >= prefixTsumo.length && i < prefixTsumo.length + patternNum));
    const result: Tsumo[][] = [];
    const equal = (t1: Tsumo[], t2: Tsumo[]) => t1.length === t2.length && t1.every((_, i) => t1[i][0] === t2[i][0] && t1[i][1] === t2[i][1]);
    let prev: Tsumo[] | undefined = undefined;
    for (let p of patterns) {
      if (prev && equal(prev, p)) continue;
      result.push(p);
      prev = p;
    }
    return result;
  }
};

const convert = (line: string) => {
  const arr: Tsumo[] = [];
  for (let i = 0; 2 * i < line.length; i++) {
    const t1 = +line[2 * i] + 1;
    const t2 = +line[2 * i + 1] + 1;
    arr.push([t1 as PuyoColor, t2 as PuyoColor]);
  }
  return arr;
};
