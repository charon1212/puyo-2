import { createStateContext } from "@charon1212/my-lib-react";
import { PuyoTsumoPatternRepository } from "@charon1212/puyo-domain";

const [PuyoTsumoPatternRepositoryProvider, usePuyoTsumoPatternRepository] = createStateContext<PuyoTsumoPatternRepository>(new PuyoTsumoPatternRepository());
export { PuyoTsumoPatternRepositoryProvider, usePuyoTsumoPatternRepository };

const tsumoPatternFilePath = '%USERPROFILE%/.electron/charon1212/PuyoTsumo.txt';
export const getInitialPuyoTsumoPatternRepository = async () => {
  const newRepository = new PuyoTsumoPatternRepository();
  const exists = await window.myAPI.fileExists(tsumoPatternFilePath)
  if (!exists) return newRepository;
  const fileContent = await window.myAPI.readFile(tsumoPatternFilePath);
  newRepository.registerFromString(fileContent.split('\r\n').filter((v) => v));
  return newRepository;
};
