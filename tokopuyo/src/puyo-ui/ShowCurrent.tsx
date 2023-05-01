import { useMemo } from 'react';
import { PuyoCoordinate, getCoordinates } from '../puyo-domain/PuyoCoordinate';
import { PuyoTsumo } from '../puyo-domain/PuyoTsumo';
import { PuyoBoard } from '../puyo-domain/PuyoBoard';
import { PuyoBoardView } from './PuyoBoardView';
import { ColorMapping } from './ColorMapping';

type Props = { cor: PuyoCoordinate; tsumo: PuyoTsumo; colorMapping: ColorMapping; radius: number };
export const ShowCurrent = (props: Props) => {
  const {
    cor: { x, dir },
    tsumo,
    colorMapping,
    radius,
  } = props;
  const board = useMemo(() => {
    const { parentX, parentY, childX, childY } = getCoordinates({ x, dir });
    const newBoard = new PuyoBoard({ width: 6, height: 3 });
    newBoard.board[parentY][parentX] = tsumo[0];
    newBoard.board[childY][childX] = tsumo[1];
    return newBoard;
  }, [x, dir, tsumo]);
  return (
    <>
      <PuyoBoardView board={board} colorMapping={colorMapping} radius={radius} />
    </>
  );
};
