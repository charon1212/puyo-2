import { useMemo, useState } from 'react';
import { SimpleSelectList } from '@charon1212/my-lib-react';
import { usePuyoTsumoPatternRepository2 } from '../../context/PuyoTsumoPatternRepository2';
import { PuyoTsumoPatternRepository2, StartPatternType } from '@charon1212/puyo-domain';
import { aggregateByKey } from 'util-charon1212';

const defaultOpenMap: { [key in string]: boolean } = { AAAA: false, AAAB: false, AABB: false, ABAC: false, AABC: false };

export type SelectValuePatternPrefixList = { startPatternType: string; afterStartPrefix: string };
type Props = { selectValue?: SelectValuePatternPrefixList; setSelectValue?: (value: SelectValuePatternPrefixList) => void };

export const PatternPrefixList = (props: Props) => {
  const { selectValue, setSelectValue } = props;
  const [repository] = usePuyoTsumoPatternRepository2();

  const menuList = useMemo(() => createMenuList(repository), [repository]);

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
        {menuList.map(({ startPatternType, menus, countSum }) => (
          <>
            <div>
              {startPatternType}{' '}
              <a href='#' onClick={onClickOpenAnchor(startPatternType)}>
                {openMap[startPatternType] ? 'close' : 'open'}
              </a>{' '}
              ({getRate(countSum)}%)
            </div>
            {!openMap[startPatternType] ? (
              ''
            ) : (
              <SimpleSelectList
                list={menus}
                content={({ count, text }) => <>{`${text} (${count})`}</>}
                selected={({ afterStartPrefix }) =>
                  startPatternType === selectValue?.startPatternType && afterStartPrefix === selectValue?.afterStartPrefix
                }
                onClick={({ afterStartPrefix }) => setSelectValue?.({ startPatternType, afterStartPrefix })}
                sx={{ listItem: { p: '0 10px 0' }, listItemButton: { p: '0' } }}
              />
            )}
          </>
        ))}
      </div>
    </>
  );
};

type MenuList = {
  startPatternType: StartPatternType;
  menus: { text: string; afterStartPrefix: string; count: number }[];
  countSum: number;
}[];
const createMenuList = (repository: PuyoTsumoPatternRepository2): MenuList => {
  const afterStartPrefixList = repository.getAfterStartPrefixList();
  return afterStartPrefixList.map(({ startPatternType, afterStartPrefixList }) => {
    const countSum = afterStartPrefixList.reduce((p, c) => p + c.count, 0);
    const sorted = afterStartPrefixList.sort((a, b) => (a.afterStartPrefix < b.afterStartPrefix ? -1 : 1));
    const groupByFirst2Char = aggregateByKey(sorted, ({ afterStartPrefix }) => afterStartPrefix.substring(0, 2));
    const menus: MenuList[number]['menus'] = [];
    menus.push({ text: `★ALL`, count: countSum, afterStartPrefix: '' });
    for (let { key, values } of groupByFirst2Char) {
      menus.push({ text: `　[${key}]`, count: values.reduce((p, c) => p + c.count, 0), afterStartPrefix: key });
      menus.push(...values.map(({ afterStartPrefix, count }) => ({ afterStartPrefix, count, text: `　　${afterStartPrefix}` })));
    }
    return { startPatternType, menus, countSum };
  });
};
