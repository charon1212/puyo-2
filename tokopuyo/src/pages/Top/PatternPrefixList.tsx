import { useMemo, useState } from 'react';
import { SimpleSelectList } from '@charon1212/my-lib-react';
import { usePuyoTsumoPatternRepository } from '../../context/PuyoTsumoPatternRepository';

const prefixTitles = ['1111', '1112', '1122', '1123', '1211', '1212', '1213', '1222', '1223', '1233'];
const defaultOpenMap: { [key in string]: boolean } = {
  '1111': false,
  '1112': false,
  '1122': false,
  '1123': false,
  '1211': false,
  '1212': false,
  '1213': false,
  '1222': false,
  '1223': false,
  '1233': false,
};

type Props = {};
export const PatternPrefixList = (props: Props) => {
  const {} = props;
  const [repository] = usePuyoTsumoPatternRepository();

  const menus = useMemo(() => {
    const prefixList = repository.getPattern([], 4);
    return prefixTitles.map((prefixTitle) => {
      return {
        prefixTitle,
        tsumoList: prefixList.filter((v) => v.str.startsWith(prefixTitle)),
      };
    });
  }, [repository]);

  const [openMap, setOpenMap] = useState<{ [key in string]: boolean }>(defaultOpenMap);
  const onClickOpenAnchor =
    (prefixTitle: string): React.MouseEventHandler<HTMLAnchorElement> =>
    (e) => {
      e.preventDefault();
      setOpenMap({ ...openMap, [prefixTitle]: openMap[prefixTitle] ? false : true });
    };

  const getRate = (n: number) => Math.floor((10000 * n) / 65536) / 100;
  return (
    <>
      <div style={{ maxHeight: '100vh', overflowY: 'scroll', minWidth: '200px', padding: '10px' }}>
        {menus.map(({ prefixTitle, tsumoList }) => (
          <>
            <div>
              {prefixTitle}{' '}
              <a href='#' onClick={onClickOpenAnchor(prefixTitle)}>
                {openMap[prefixTitle] ? 'close' : 'open'}
              </a>{' '}
              ({getRate(tsumoList.map((v) => v.num).reduce((p, c) => p + c, 0))}%)
            </div>
            {openMap[prefixTitle] ? (
              <div>
                <SimpleSelectList
                  list={tsumoList}
                  content={(list) => (
                    <>
                      {list.pattern.map(([p, c]) => `${p}${c}`).join('')} ({list.num})
                    </>
                  )}
                  sx={{ listItem: { p: '0 10px 0' }, listItemButton: { p: '0' } }}
                />
              </div>
            ) : (
              ''
            )}
          </>
        ))}
      </div>
    </>
  );
};
