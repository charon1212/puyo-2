import { useState, useEffect } from 'react';
import { usePuyoTsumoPatternRepository } from '../../context/PuyoTsumoPatternRepository';
import { ColorMapping, getRandomColorMapping } from '../../puyo-ui/ColorMapping';
import { TokopuyoGame } from '../../puyo-ui/TokopuyoGame';
import { getDefaultKeyConfig } from '../../puyo-ui/TokopuyoGameKeyConfig';
import { PuyoTsumoPatternInfo } from '../../puyo-domain/PuyoTsumoPatternRepository';
import { PatternPrefixList } from './PatternPrefixList';

export const TopPage = () => {
  const [repository] = usePuyoTsumoPatternRepository();
  return <>{repository.isEmpty() ? 'ぷよツモインポート中...' : <TopPage2 />}</>;
};

const TopPage2 = () => {
  const [repository] = usePuyoTsumoPatternRepository();
  const [tsumoPattern, setTsumoPattern] = useState<PuyoTsumoPatternInfo>({ id: -1, pattern: [], str: '' });
  const [colorMapping, setColorMapping] = useState<ColorMapping>(getRandomColorMapping());
  useEffect(() => {
    setTsumoPattern(repository.getRandom());
  }, []);

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div>
          <PatternPrefixList />
        </div>
        <div>
          <TokopuyoGame
            radius={15}
            colorMapping={colorMapping}
            keyConfig={getDefaultKeyConfig()}
            pattern={tsumoPattern.pattern}
            reset={() => {
              setTsumoPattern(repository.getRandom());
              setColorMapping(getRandomColorMapping());
            }}
          />
        </div>
      </div>
    </>
  );
};
