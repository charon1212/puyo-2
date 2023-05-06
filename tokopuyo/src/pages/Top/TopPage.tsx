import { useState } from 'react';
import { PatternPrefixList, SelectValuePatternPrefixList } from './PatternPrefixList';
import { usePuyoTsumoPatternRepository2 } from '../../context/PuyoTsumoPatternRepository2';
import { useTsumoPatternList } from './useTsumoPatternList';
import { FoundationMemoView } from './FoundationMemoView';
import { getDefaultKeyConfig, ColorMapping, getRandomColorMapping, TokopuyoGame } from '@charon1212/puyo-ui';

const keyConfig = getDefaultKeyConfig();
keyConfig.push({ key: 'e', operation: 'reset' });

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
          <div>←→:移動, zx:回転, as:戻進</div>
          <div>e:リセット(同じツモ), r:リセット(別ツモ)</div>
          <TokopuyoGame
            radius={15}
            colorMapping={colorMapping}
            keyConfig={keyConfig}
            pattern={selectedPuyoTsumoPatternInfo?.pattern ?? []}
            showRensaCount
            beforeOnKeyPress={(key) => {
              if (key === 'r') {
                setRandom();
                setColorMapping(getRandomColorMapping());
              }
            }}
          />
        </div>
        <div>
          <FoundationMemoView selectValuePatternPrefixList={selectValuePatternPrefixList} />
        </div>
      </div>
    </>
  );
};
