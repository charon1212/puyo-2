import { Tsumo } from "../domain/type";
import { TsumoManager } from "./TsumoManager";
import * as fs from 'fs';

export const writeTsumoFile = (tm: TsumoManager, filePath: string = 'file/output.txt') => {
  const str =
    tm.list
      .map((v) => v.map((w): Tsumo => w[0] > w[1] ? [w[1], w[0]] : w))
      .map((v) => v.map(([t1, t2]) => `${t1 - 1}${t2 - 1}`).join(''))
      .sort((a, b) => a > b ? 1 : -1)
      .join('\r\n');
  fs.writeFileSync(filePath, str);
};
