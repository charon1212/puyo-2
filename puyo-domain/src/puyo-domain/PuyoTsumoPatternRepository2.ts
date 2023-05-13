import { PuyoColor } from "./PuyoColor";
import { PuyoTsumoPattern } from "./PuyoTsumoPattern";

export type StartPatternType = 'AAAA' | 'AAAB' | 'AABB' | 'ABAC' | 'AABC';
type TsumoFileJsonType = { start: 'AAAA' | 'AAAB' | 'AABB' | 'ABAC' | 'AABC', tsumoPatternList: { id: string, pattern: string, allClear: number, }[], }[];

export type PuyoTsumoPatternInfo = { id: string; pattern: PuyoTsumoPattern; allClear: number };

export class PuyoTsumoPatternRepository2 {
  private json: TsumoFileJsonType = [];
  constructor(json?: TsumoFileJsonType) { if (json) this.json = json };

  /**
   * @example
   * ```ts
   * const json = fs.readFileSync('file.json').toString();
   * const repository = PuyoTsumoPatternRepository2.fromJson(JSON.parse(json));
   * ```
   */
  static fromJson(json: TsumoFileJsonType) { return new PuyoTsumoPatternRepository2(json) }

  isEmpty() { return this.json.length === 0 };

  /**
   * 初手2手ごと型（startPatternType）と、それに続く2手（afterStartPrefix）の一覧を取得する。
   * startPatternTypeは、ABAC型やAABB型等の初手2手を示すパターンで、5種類から構成される。（'AAAA' | 'AAAB' | 'AABB' | 'ABAC' | 'AABC'）
   * afterStartPrefixは、初手2手に続く2手を示す4文字の数値列である。例えば、ABAC型に対しては、A>1,B>2,C>3,D>4に対応させた数値列で、'2413'のような文字列となる。
   * この関数は、3手目・4手目のパターンを、初手型ごとに取得することができる関数となる。
   */
  getAfterStartPrefixList(): { startPatternType: StartPatternType, afterStartPrefixList: { afterStartPrefix: string, count: number }[] }[] {
    return this.json.map(({ start, tsumoPatternList }) => {
      const afterStartPrefixMap = tsumoPatternList.map((v) => normalize(v.pattern.substring(4, 8)));
      return { startPatternType: start, afterStartPrefixList: aggregate(afterStartPrefixMap).map(({ value, count }) => ({ afterStartPrefix: value, count })) };
    });
  };

  getTsumoListByAfterStartPrefix(startPatternType: StartPatternType, afterStartPrefix: string,): PuyoTsumoPatternInfo[] {
    const result = this.json.find((v) => v.start === startPatternType)?.tsumoPatternList
      .filter(({ pattern }) => normalize(pattern.substring(4, 4 + afterStartPrefix.length)) === afterStartPrefix)
      .map(({ id, pattern, allClear }) => ({ id, allClear, pattern: convert(pattern) }))
    if (!result) throw new Error(`no startPatternType found. startPatternType=${startPatternType}`);
    return result;
  };
};

const convert = (patternStr: string): PuyoTsumoPattern => {
  const pattern: PuyoTsumoPattern = [];
  for (let i = 0; 2 * i + 1 < patternStr.length; i++) {
    const p: PuyoColor = +patternStr[2 * i] as PuyoColor;
    const c: PuyoColor = +patternStr[2 * i + 1] as PuyoColor;
    pattern.push([p, c]);
  }
  return pattern;
};

/** 正規化処理 */
const normalize = (str: string) => {
  let str2 = '';
  for (let i = 0; 2 * i + 1 < str.length; i++) {
    const s1 = str[2 * i];
    const s2 = str[2 * i + 1];
    str2 += s1 < s2 ? s1 + s2 : s2 + s1;
  }
  return str2;
};

/** 集約 */
const aggregate = <T>(list: T[]): { value: T, count: number }[] => {
  const result: { value: T, count: number }[] = [];
  for (let item of list) {
    const find = result.find(({ value }) => value === item);
    if (find) find.count++;
    else result.push({ value: item, count: 1 });
  }
  return result;
};
