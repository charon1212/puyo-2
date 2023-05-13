import { useEffect, useState } from 'react';
import { usePuyoTsumoPatternRepository2 } from '../../context/PuyoTsumoPatternRepository2';
import { SimpleSelectList } from '@charon1212/my-lib-react';
import { PuyoTsumoPatternInfo, StartPatternType } from '@charon1212/puyo-domain';

type Props = { startPatternType?: string; afterStartPrefix?: string };
export const useTsumoPatternList = (props: Props) => {
  const { afterStartPrefix, startPatternType } = props;
  const [repository] = usePuyoTsumoPatternRepository2();

  const [list, setList] = useState<PuyoTsumoPatternInfo[]>([]);
  const [selectedPuyoTsumoPatternInfo, setSelectedPuyoTsumoPatternInfo] = useState<PuyoTsumoPatternInfo | undefined>();

  const setRandom = () => {
    if (list.length > 0) setSelectedPuyoTsumoPatternInfo(getRandom(list));
  };
  useEffect(() => {
    setRandom();
  }, [list]);
  useEffect(() => {
    if (afterStartPrefix !== undefined && startPatternType !== undefined) {
      const list = repository.getTsumoListByAfterStartPrefix(startPatternType as StartPatternType, afterStartPrefix);
      setList(list);
    }
  }, [afterStartPrefix, startPatternType]);

  const ui = (
    <>
      <div style={{ height: '100vh', width: '300px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ margin: '10px' }}>
          <div>ID: {'#' + selectedPuyoTsumoPatternInfo?.id.padStart(5, '0') || '-'}</div>
          <div>全消し最短予想: {selectedPuyoTsumoPatternInfo?.allClear || '-'}</div>
          <div>pattern:</div>
          <div>
            {selectedPuyoTsumoPatternInfo?.pattern
              .filter((_, i) => i < 10)
              .map(([p, c]) => `${p}${c}`)
              .join('_') || '-'}
          </div>
        </div>
        <div style={{ overflowY: 'scroll', margin: '0 10px 0' }}>
          {afterStartPrefix && afterStartPrefix.length === 4 ? (
            <SimpleSelectList
              list={list}
              content={(info) => <>{toStrPuyoTsumoPatternInfo(info)}</>}
              selected={({ id }) => selectedPuyoTsumoPatternInfo?.id === id}
              onClick={(info) => setSelectedPuyoTsumoPatternInfo(info)}
              sx={{ listItem: { p: '0 10px 0' }, listItemButton: { p: '0' } }}
            />
          ) : (
            '(4手目まで指定していない場合は、性能問題から省略)'
          )}
        </div>
      </div>
    </>
  );

  return [ui, selectedPuyoTsumoPatternInfo, setRandom] as const;
};

const getRandom = <T extends any>(list: T[]) => {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
};

const toStrPuyoTsumoPatternInfo = (info: PuyoTsumoPatternInfo) => {
  const { id, pattern, allClear } = info;
  return `#${id.padStart(5, '0')} - ${pattern[4][0]}${pattern[4][1]} ${pattern[5][0]}${pattern[5][1]} [${allClear}]`;
};
