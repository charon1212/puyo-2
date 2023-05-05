import { binarySearch } from "util-charon1212";
import { PuyoColor } from "./PuyoColor";
import { PuyoTsumoPattern } from "./PuyoTsumoPattern";
import { PuyoTsumo } from "./PuyoTsumo";

export type PuyoTsumoPatternSet = { id: number, pattern: PuyoTsumoPattern, str: string };

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
  searchPrefix(prefixTsumo: PuyoTsumo[]): PuyoTsumoPatternSet[] {
    if (prefixTsumo.length === 0) return this.listPattern.map((_, i) => this.get(i));
    const prefix = prefixTsumo.map(([t1, t2]) => `${t1 - 1}${t2 - 1}`).join('');
    const id = binarySearch(this.listStr, (t) => t < prefix);
    const result: PuyoTsumoPatternSet[] = [];
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
    const list: { pattern: PuyoTsumo[], num: number, str: string }[] = [];
    let prev = '';
    for (let p of patterns) {
      const str = p.map(([p, c]) => `${p}${c}`).join('');
      if (str === prev) {
        list[list.length - 1].num++;
      } else {
        list.push({ pattern: p, num: 1, str });
        prev = str;
      }
    }
    return list;
  }
  /**
   * 指定したIDのツモパターンを取得する。
   */
  get(id: number): PuyoTsumoPatternSet {
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
