import { PuyoTsumoPattern } from './puyo-domain/PuyoTsumoPattern';
import { getRandomColorMapping } from './puyo-ui/ColorMapping';
import { TokopuyoGame, TokopuyoGameKeyConfig } from './puyo-ui/TokopuyoGame';

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
const defaultKeyConfig: TokopuyoGameKeyConfig = [
  { key: 'ArrowLeft', operation: 'left' },
  { key: 'ArrowRight', operation: 'right' },
  { key: 'z', operation: 'rotateLeft' },
  { key: 'x', operation: 'rotateRight' },
  { key: 'ArrowDown', operation: 'fall' },
  { key: 'r', operation: 'reset' },
  { key: 'a', operation: 'back' },
  { key: 's', operation: 'next' },
];

type Props = {};
export const App = (props: Props) => {
  const {} = props;
  return (
    <>
      <h1>tokopuyo</h1>
      <TokopuyoGame radius={15} colorMapping={colorMapping} keyConfig={defaultKeyConfig} pattern={testPattern} reset={() => {}} />
    </>
  );
};
