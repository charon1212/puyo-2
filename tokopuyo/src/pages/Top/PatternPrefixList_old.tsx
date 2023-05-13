import { useMemo, useState } from 'react';
import { SimpleSelectList } from '@charon1212/my-lib-react';
import { usePuyoTsumoPatternRepository2 } from '../../context/PuyoTsumoPatternRepository2';

const defaultOpenMap: { [key in string]: boolean } = { AAAA: false, AAAB: false, AABB: false, ABAC: false, AABC: false };

export type SelectValuePatternPrefixList = { startPatternType: string; afterStartPrefix: string };
type Props = { selectValue?: SelectValuePatternPrefixList; setSelectValue?: (value: SelectValuePatternPrefixList) => void };
export const PatternPrefixList = (props: Props) => {
  const { selectValue, setSelectValue } = props;
  const [repository] = usePuyoTsumoPatternRepository2();

  const menus = useMemo(() => {
    const afterStartPrefixList = repository.getAfterStartPrefixList();
    return afterStartPrefixList.map(({ startPatternType, afterStartPrefixList }) => ({
      startPatternType,
      afterStartPrefixList: afterStartPrefixList.sort((a, b) => (a.afterStartPrefix < b.afterStartPrefix ? -1 : 1)),
      countSum: afterStartPrefixList.map((v) => v.count).reduce((p, c) => p + c, 0),
    }));
  }, [repository]);

  const [openMap, setOpenMap] = useState<{ [key in string]: boolean }>(defaultOpenMap);
  const onClickOpenAnchor =
    (startPatternType: string): React.MouseEventHandler<HTMLAnchorElement> =>
    (e) => {
      e.preventDefault();
      setOpenMap({ ...openMap, [startPatternType]: openMap[startPatternType] ? false : true });
    };

  const getRate = (n: number) => Math.floor((10000 * n) / 65536) / 100;
  return (
    <>
      <div style={{ maxHeight: '100vh', overflowY: 'scroll', minWidth: '200px', margin: '0 10px 0' }}>
        {menus.map(({ startPatternType, afterStartPrefixList, countSum }) => (
          <>
            <div>
              {startPatternType}{' '}
              <a href='#' onClick={onClickOpenAnchor(startPatternType)}>
                {openMap[startPatternType] ? 'close' : 'open'}
              </a>{' '}
              ({getRate(countSum)}%)
            </div>
            {openMap[startPatternType] ? (
              <SimpleSelectList
                list={afterStartPrefixList}
                content={({ afterStartPrefix, count }) => (
                  <>
                    {afterStartPrefix} ({count})
                  </>
                )}
                selected={({ afterStartPrefix }) =>
                  startPatternType === selectValue?.startPatternType && afterStartPrefix === selectValue?.afterStartPrefix
                }
                onClick={({ afterStartPrefix }) => setSelectValue?.({ startPatternType, afterStartPrefix })}
                sx={{ listItem: { p: '0 10px 0' }, listItemButton: { p: '0' } }}
              />
            ) : (
              ''
            )}
          </>
        ))}
      </div>
    </>
  );
};
