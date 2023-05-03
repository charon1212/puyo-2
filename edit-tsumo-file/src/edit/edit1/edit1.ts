import * as fs from 'fs';
import { Result, Start } from './type';
import { createResult } from './createResult';

type Output = { start: Start, tsumoPatternList: Result[], }[];
const allStartList: Start[] = ['AAAA', 'AAAB', 'AABB', 'ABAC', 'AABC',];

/**
 * ツモファイル編集1
 */
export const edit1 = () => {

  // 入力読み込み & 空行排除
  const inputStr = fs.readFileSync('file/suutika.txt').toString();
  const lines = inputStr.split('\r\n').filter((v) => v);

  const output: Output = allStartList.map((start) => ({ start, tsumoPatternList: [] }));
  let id = 1;
  for (let line of lines) {
    const { start, result } = createResult(line, `${id}`);
    output.find((v) => v.start === start)?.tsumoPatternList.push(result) ?? console.error(`missing start=${start}`);
    id++;
  }

  fs.writeFileSync('file/output.json', JSON.stringify(output));
  fs.writeFileSync('file/output.json.type', "type Output = { start: 'AAAA' | 'AAAB' | 'AABB' | 'ABAC' | 'AABC', tsumoPatternList: { id: string, pattern: string, allClear: number, }[], }[]");

};
