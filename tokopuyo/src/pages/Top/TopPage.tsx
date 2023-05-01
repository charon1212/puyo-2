import { PuyoTsumoPattern } from "../../puyo-domain/PuyoTsumoPattern";
import { getRandomColorMapping } from "../../puyo-ui/ColorMapping";
import { TokopuyoGame } from "../../puyo-ui/TokopuyoGame";
import { getDefaultKeyConfig } from "../../puyo-ui/TokopuyoGameKeyConfig";

const colorMapping = getRandomColorMapping();
const testPattern: PuyoTsumoPattern = [
  [1, 2],
  [1, 3],
  [1, 4],
  [1, 1],
  [2, 3],
  [1, 4],
  [2, 4],
  [4, 4],
];

export const TopPage = () => {
  return (
    <>
      <TokopuyoGame radius={15} colorMapping={colorMapping} keyConfig={getDefaultKeyConfig()} pattern={testPattern} reset={() => {}} />
    </>
  );
};
