import { useEffect, useState } from 'react';
import { Dir, DirUp, PuyoCoordinate, getCoordinateOperator } from '../puyo-domain/PuyoCoordinate';
import { PuyoTsumoPattern } from '../puyo-domain/PuyoTsumoPattern';
import { ColorMapping } from './ColorMapping';
import { PuyoBoard } from '../puyo-domain/PuyoBoard';
import { ShowCurrent } from './ShowCurrent';
import { PuyoBoardView } from './PuyoBoardView';
import { PuyoTsumo } from '../puyo-domain/PuyoTsumo';
import { Arr } from 'util-charon1212';
import { ShowNext } from './ShowNext';
import { TokopuyoGameKeyConfig } from './TokopuyoGameKeyConfig';

const initX = 2;
const initDir = DirUp;
const boardWidth = 6;
const boardHeight = 13;
const { moveLeft, moveRight, rotateLeft, rotateRight } = getCoordinateOperator(0, 5);
const waitRensaMs = 400;

type Props = {
  pattern: PuyoTsumoPattern;
  keyConfig: TokopuyoGameKeyConfig;
  colorMapping: ColorMapping;
  radius: number;
  beforeOnKeyPress?: (key: string) => unknown;
  afterOnKeyPress?: (key: string) => unknown;
  showRensaCount?: boolean;
};
export const TokopuyoGame = (props: Props) => {
  const { pattern, keyConfig, colorMapping, radius, beforeOnKeyPress, afterOnKeyPress, showRensaCount } = props;

  const getTsumo = (index: number): PuyoTsumo => {
    if (pattern.length === 0) return [0, 0];
    return pattern[index % pattern.length];
  };

  /** ■ state ■ */
  const [x, setX] = useState(initX);
  const [dir, setDir] = useState<Dir>(initDir);
  const [board, setBoard] = useState(new PuyoBoard({ width: boardWidth, height: boardHeight }));
  const [history, setHistory] = useState<PuyoBoard[]>([new PuyoBoard({ width: boardWidth, height: boardHeight })]);
  const [index, setIndex] = useState(0); // 何手目まで進んでいるかを表すindex。5手目が置き終わって6手目を置く状況は、index=5となる。
  const [countShowNext, setCountShowNext] = useState(1); // Nextの表示数
  const [inRensaAnimation, setInRensaAnimation] = useState(false); // アニメーション表示中で、ユーザーの操作を受け付けないかどうかを表す。trueなら操作を受け付けない。
  const [rensaCount, setRensaCount] = useState(0);

  const resetCoordinate = () => {
    setX(initX);
    setDir(initDir);
  };
  const resetState = () => {
    resetCoordinate();
    setBoard(new PuyoBoard({ width: boardWidth, height: boardHeight }));
    setHistory([new PuyoBoard({ width: boardWidth, height: boardHeight })]);
    setIndex(0);
    setInRensaAnimation(false);
    setRensaCount(0);
  };

  useEffect(() => {
    resetState();
  }, [pattern]);

  const operateCurrent = (operator: (cor: PuyoCoordinate) => PuyoCoordinate) => {
    const { x: newX, dir: newDir } = operator({ x, dir });
    setX(newX);
    setDir(newDir);
  };
  const moveHistory = (di: number) => {
    resetCoordinate();
    setBoard(history[index + di]);
    setIndex(index + di);
    setInRensaAnimation(false);
  };

  /** 落下処理 */
  const fall = () => {
    const newBoard = board.deepCopy();
    newBoard.put(getTsumo(index), { x, dir });
    setBoard(newBoard);
    setIndex(index + 1);
    resetCoordinate();
    setInRensaAnimation(true);
    rensa(newBoard, true);
  };
  const rensa = (board: PuyoBoard, resetRensaCount?: boolean) => {
    const erasedBoard = board.deepCopy();
    const erased = erasedBoard.erase();
    if (erased) {
      const falledBoard = erasedBoard.deepCopy();
      falledBoard.fall();
      if (resetRensaCount) setRensaCount(0);
      setTimeout(() => {
        setRensaCount((p) => p + 1);
        setBoard(erasedBoard);
      }, waitRensaMs);
      setTimeout(() => {
        setBoard(falledBoard);
        rensa(falledBoard);
      }, 2 * waitRensaMs);
    } else {
      setInRensaAnimation(false);
      const newHistory = [...history];
      // 5手目を置いたときはindex=4となる(setIndexの更新前のため)
      // そのため、4手目を置いた時までのhistoryで切り捨てて(splice(5)を実行)、そのあと末尾にpushし、更新する。
      // array.splice: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
      newHistory.splice(index + 1);
      newHistory.push(erasedBoard);
      setHistory(newHistory);
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (inRensaAnimation) return;
    const operation = keyConfig.find(({ key }) => e.key === key)?.operation;
    beforeOnKeyPress?.(e.key);
    if (operation === 'left') operateCurrent(moveLeft);
    else if (operation === 'right') operateCurrent(moveRight);
    else if (operation === 'rotateLeft') operateCurrent(rotateLeft);
    else if (operation === 'rotateRight') operateCurrent(rotateRight);
    else if (operation === 'fall') fall();
    else if (operation === 'back') index > 0 && moveHistory(-1);
    else if (operation === 'next') index < history.length - 1 && moveHistory(+1);
    else if (operation === 'reset') resetState();
    afterOnKeyPress?.(e.key);
  };
  const onChangeCountNext: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const value = Number(e.target.value);
    if (value === null || value === undefined) return;
    setCountShowNext(value);
  };

  const nexts = Arr(countShowNext).map((i) => getTsumo(index + i + 1));

  return (
    <>
      <div>{inRensaAnimation ? '待機中' : '操作可能'}</div>
      <div style={{ display: 'flex', userSelect: 'none' }}>
        <div tabIndex={0} onKeyDown={onKeyDown} style={{ flexShrink: 0 }}>
          <ShowCurrent tsumo={getTsumo(index)} cor={{ x, dir }} colorMapping={colorMapping} radius={radius} />
          <PuyoBoardView board={board} colorMapping={colorMapping} radius={radius} />
          <div style={{ width: '100%', textAlign: 'center' }}>{showRensaCount && rensaCount > 0 ? `${rensaCount}連鎖` : ''}</div>
        </div>
        <div style={{ marginLeft: '30px' }}>
          <select value={countShowNext.toString()} onChange={onChangeCountNext}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <option key={i} value={i.toString()}>
                {i.toString()}個
              </option>
            ))}
          </select>
          <ShowNext nexts={nexts} colorMapping={colorMapping} radius={radius} />
        </div>
      </div>
    </>
  );
};
