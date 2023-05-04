import { useEffect, useState } from 'react';
import { usePuyoTsumoPatternRepository2 } from '../../context/PuyoTsumoPatternRepository2';
import { PuyoTsumoPatternInfo, StartPatternType } from '../../puyo-domain/PuyoTsumoPatternRepository2';
import { SimpleSelectList } from '@charon1212/my-lib-react';

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
    if (afterStartPrefix && startPatternType) {
      const list = repository.getTsumoListByAfterStartPrefix(startPatternType as StartPatternType, afterStartPrefix);
      setList(list);
    }
  }, [afterStartPrefix, startPatternType]);

  const ui = (
    <>
      <div style={{ maxHeight: '100vh', overflowY: 'scroll', minWidth: '300px', margin: '0 10px 0' }}>
        <SimpleSelectList
          list={list}
          content={(info) => <>{toStrPuyoTsumoPatternInfo(info)}</>}
          selected={({ id }) => selectedPuyoTsumoPatternInfo?.id === id}
          onClick={(info) => setSelectedPuyoTsumoPatternInfo(info)}
          sx={{ listItem: { p: '0 10px 0' }, listItemButton: { p: '0' } }}
        />
      </div>
    </>
  );

  return [ui, selectedPuyoTsumoPatternInfo, setRandom] as const;
};

const getRandom = <T extends any>(list: T[]) => {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
};

const toStrPuyoTsumoPatternInfo = (info: PuyoTsumoPatternInfo) =>
  `#${info.id.padStart(5, '0')} - ` +
  info.pattern
    .filter((_, i) => i < 6)
    .map(([p, c]) => `${p}${c} `)
    .join('') +
  ` [${info.allClear}]`;
