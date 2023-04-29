import { PuyoTsumo } from "../domain/PuyoTsumo";
import { TsumoManager } from "./TsumoManager";
import * as fs from 'fs';

/**
 * TsumoManagerに登録されているデータを、一定の規則で正規化する。
 * 規則は以下のとおり。
 *
 * - 各ぷよは登場順に0,1,2,3を採番する。（※この関数内で、この規則は特に考慮しない。TsumoManagerの段階で考慮しておいて。）
 * - 各ツモは、親ぷよのほうが番号が低いようにする。（10のツモは01に直す。これは、0102のツモと0120ノツモを同一視したいため）
 * - ツモは文字列として並べた状態で、昇順で並べ替える。
 *
 */
export const writeTsumoFile = (tm: TsumoManager, filePath: string = 'file/output.txt') => {
  const str =
    tm.list
      .map((v) => v.map((w): PuyoTsumo => w[0] > w[1] ? [w[1], w[0]] : w))
      .map((v) => v.map(([t1, t2]) => `${t1 - 1}${t2 - 1}`).join(''))
      .sort((a, b) => a > b ? 1 : -1)
      .join('\r\n');
  fs.writeFileSync(filePath, str);
};
