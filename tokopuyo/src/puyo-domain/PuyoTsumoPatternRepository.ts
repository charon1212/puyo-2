import { binarySearch } from "util-charon1212";
import { PuyoColor } from "./PuyoColor";
import { PuyoTsumoPattern } from "./PuyoTsumoPattern";
import { PuyoTsumo } from "./PuyoTsumo";

export type PuyoTsumoPatternInfo = { id: number, pattern: PuyoTsumoPattern, str: string };

export class PuyoTsumoPatternRepository {
  private listStr: string[] = [];
  private listPattern: PuyoTsumoPattern[] = [];
  constructor() { };
  /** ツモパターンを登録する */
  registerFromString(lines: string[]) {
    for (let line of lines) {
      this.listStr.push(line);
      this.listPattern.push(convert(line));
    }
  }
  isEmpty() { return this.listPattern.length === 0 };
  /** 登録されているツモパターンからランダムに一つ選択する */
  getRandom() {
    if (this.listPattern.length === 0) throw new Error('登録なし。');
    const i = Math.floor(Math.random() * this.listPattern.length);
    return this.get(i);
  }
  /**
   * 登録されているツモパターンのうち、指定したprefix列で始まるツモパターンの一覧を取得する。
   * 二分探索を行うので、あらかじめソートしておくこと。
   */
  searchPrefix(prefixTsumo: PuyoTsumo[]): PuyoTsumoPatternInfo[] {
    if (prefixTsumo.length === 0) return this.listPattern.map((_, i) => this.get(i));
    const prefix = prefixTsumo.map(([t1, t2]) => `${t1 - 1}${t2 - 1}`).join('');
    const id = binarySearch(this.listStr, (t) => t < prefix);
    const result: PuyoTsumoPatternInfo[] = [];
    for (let i = id === -1 ? 0 : id; i < this.listStr.length; i++) {
      if (!this.listStr[i].startsWith(prefix)) break;
      result.push(this.get(i));
    }
    return result;
  }
  /**
   * 指定したprefixで始まるツモパターンから、prefix以降に取りうるパターン列を取得する。
   * 例えば、以下の呼び出しは、"abacaabbccdd"で始まるツモに対し、そのあとにくるパターンが"aaaa","bbbb","abcd"の3つしかないことを示す。
   *
   * ```ts
   * repository.getPattern([[1,2], [1,3], [1,1], [2,2], [3,3], [4,4]], 2); // [[[1,1],[1,1]], [[2,2],[2,2]], [[1,2],[3,4]]]
   * ```
   */
  getPattern(prefixTsumo: PuyoTsumo[], patternNum: number) {
    const searched = this.searchPrefix(prefixTsumo);
    const patterns = searched.map((v) => v.pattern.filter((_, i) => i >= prefixTsumo.length && i < prefixTsumo.length + patternNum));
    const result: PuyoTsumo[][] = [];
    const equal = (t1: PuyoTsumo[], t2: PuyoTsumo[]) => t1.length === t2.length && t1.every((_, i) => t1[i][0] === t2[i][0] && t1[i][1] === t2[i][1]);
    let prev: PuyoTsumo[] | undefined = undefined;
    for (let p of patterns) {
      if (prev && equal(prev, p)) continue;
      result.push(p);
      prev = p;
    }
    return result;
  }
  /**
   * 指定したIDのツモパターンを取得する。
   */
  get(id: number): PuyoTsumoPatternInfo {
    if (id < 0) throw new Error(`Index out of range. id=${id}`);
    if (id >= this.listStr.length) throw new Error(`Index out of range. id=${id}`);
    if (id >= this.listPattern.length) throw new Error(`Index out of range. id=${id}`);
    return { id, str: this.listStr[id], pattern: this.listPattern[id] };
  }
};

const convert = (line: string) => {
  const arr: PuyoTsumoPattern = [];
  for (let i = 0; 2 * i < line.length; i++) {
    const t1 = +line[2 * i] + 1;
    const t2 = +line[2 * i + 1] + 1;
    arr.push([t1 as PuyoColor, t2 as PuyoColor]);
  }
  return arr;
};
