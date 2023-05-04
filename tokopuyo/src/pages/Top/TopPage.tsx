import { useState, useEffect } from 'react';
import { ColorMapping, getRandomColorMapping } from '../../puyo-ui/ColorMapping';
import { TokopuyoGame } from '../../puyo-ui/TokopuyoGame';
import { getDefaultKeyConfig } from '../../puyo-ui/TokopuyoGameKeyConfig';
import { PuyoTsumoPatternInfo } from '../../puyo-domain/PuyoTsumoPatternRepository';
import { PatternPrefixList, SelectValuePatternPrefixList } from './PatternPrefixList';
import { usePuyoTsumoPatternRepository2 } from '../../context/PuyoTsumoPatternRepository2';
import { useTsumoPatternList } from './useTsumoPatternList';

export const TopPage = () => {
  const [repository] = usePuyoTsumoPatternRepository2();
  return <>{repository.isEmpty() ? 'ぷよツモインポート中...' : <TopPage2 />}</>;
};

const TopPage2 = () => {
  const [colorMapping, setColorMapping] = useState<ColorMapping>(getRandomColorMapping());

  const [selectValuePatternPrefixList, setSelectValuePatternPrefixList] = useState<SelectValuePatternPrefixList | undefined>();

  const [uiTsumoPatternList, selectedPuyoTsumoPatternInfo, setRandom] = useTsumoPatternList({
    afterStartPrefix: selectValuePatternPrefixList?.afterStartPrefix,
    startPatternType: selectValuePatternPrefixList?.startPatternType,
  });

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div>
          <PatternPrefixList selectValue={selectValuePatternPrefixList} setSelectValue={setSelectValuePatternPrefixList} />
        </div>
        <div>{uiTsumoPatternList}</div>
        <div>
          <TokopuyoGame
            radius={15}
            colorMapping={colorMapping}
            keyConfig={getDefaultKeyConfig()}
            pattern={selectedPuyoTsumoPatternInfo?.pattern ?? []}
            reset={() => {
              setRandom();
              setColorMapping(getRandomColorMapping());
            }}
          />
        </div>
      </div>
    </>
  );
};
