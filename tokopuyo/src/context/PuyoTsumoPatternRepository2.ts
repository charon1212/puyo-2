import { createStateContext } from "@charon1212/my-lib-react";
import { PuyoTsumoPatternRepository2 } from "@charon1212/puyo-domain";

const [PuyoTsumoPatternRepository2Provider, usePuyoTsumoPatternRepository2] = createStateContext<PuyoTsumoPatternRepository2>(new PuyoTsumoPatternRepository2());
export { PuyoTsumoPatternRepository2Provider, usePuyoTsumoPatternRepository2 };

const tsumoPatternFilePath = '%USERPROFILE%/.electron/charon1212/PuyoTsumo2.json';
export const getInitialPuyoTsumoPatternRepository2 = async () => {
  const exists = await window.myAPI.fileExists(tsumoPatternFilePath);
  if (!exists) return new PuyoTsumoPatternRepository2();
  const json = await window.myAPI.readFile(tsumoPatternFilePath);
  return PuyoTsumoPatternRepository2.fromJson(JSON.parse(json));
};
