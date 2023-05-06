import { PuyoBoard, PuyoColor } from '@charon1212/puyo-domain';
import { PuyoBoardView, getDefaultColorMapping, useEditablePuyoBoard } from '@charon1212/puyo-ui';
import { useState } from 'react';
import { searchChainTail } from './logic/searchChainTail';

const cm = getDefaultColorMapping();
const initBoard = new PuyoBoard({ width: 6, height: 13 });
initBoard.ignoreTopRowWhenErase = false;

const allPuyoColor: PuyoColor[] = [0, 1, 2, 3, 4];

export const App = () => {
  const [list, setList] = useState<{ x: number; y: number; candidate: PuyoColor[] }[]>([]);
  const onMouseRightClick = (x: number, y: number) => {
    if (!list.some((v) => v.x === x && v.y === y)) setList([...list, { x, y, candidate: allPuyoColor }]);
  };
  const [ui, board, setBoard] = useEditablePuyoBoard({ initBoard, colorMapping: cm, radius: 10, onMouseRightClick: onMouseRightClick });

  const onClick = (index: number, puyoColor: PuyoColor, add: boolean) => {
    const copyList = [...list];
    console.log({ copyList, index, puyoColor, add });
    if (add) {
      if (!copyList[index].candidate.includes(puyoColor)) copyList[index].candidate.push(puyoColor);
    } else {
      copyList[index].candidate = copyList[index].candidate.filter((v) => v !== puyoColor);
    }
    console.log({ copyList });
    setList(copyList);
  };

  const [minRensa, setMinRensa] = useState('');
  const [resultList, setResultList] = useState<PuyoBoard[]>([]);

  const onClickSearch = () => {
    const minRensaInt = +minRensa;
    if (isNaN(minRensaInt) || minRensaInt < 0 || minRensaInt > 20) return alert('有効なminRensaを指定してください。');
    const result = searchChainTail(board.deepCopy(), list, minRensaInt);
    console.log(result);
    setResultList(result);
  };

  return (
    <>
      <div style={{ width: '100vw', height: '100vh', userSelect: 'none' }}>
        <div style={{ padding: '20px', display: 'flex' }}>
          <div style={{ margin: '10px' }}>
            <div>{ui}</div>
            <div>
              <button onClick={() => window.confirm('リセットします') && setBoard(initBoard.deepCopy())}>reset</button>
            </div>
            <div>
              <input value={minRensa} onChange={(e) => setMinRensa(e.target.value)} /> <button onClick={onClickSearch}>Search</button>
            </div>
          </div>
          <div style={{ margin: '10px' }}>
            {list.map(({ x, y, candidate }, i) => (
              <>
                <div style={{ display: 'flex' }}>
                  <div style={{ margin: '2px' }}>
                    ({x},{y})
                  </div>
                  {allPuyoColor.map((v) => (
                    <div style={{ margin: '2px' }}>
                      <button style={{ width: '60px' }} onClick={() => onClick(i, v, !candidate.includes(v))}>
                        {v} {candidate.includes(v) ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  ))}
                  <div>
                    <button
                      onClick={() => {
                        setList(list.filter((_, j) => j !== i));
                      }}
                    >
                      削除
                    </button>
                  </div>
                </div>
              </>
            ))}
          </div>
          <div style={{ margin: '10px' }}>
            {resultList.map((b) => (
              <div>
                <PuyoBoardView board={b} colorMapping={cm} radius={5} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
