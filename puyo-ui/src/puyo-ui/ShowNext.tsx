import { useMemo } from 'react';
import { ColorMapping } from './ColorMapping';
import { PuyoBoardView } from './PuyoBoardView';
import { PuyoBoard, PuyoTsumo } from '@charon1212/puyo-domain';

type Props = { nexts: PuyoTsumo[]; colorMapping: ColorMapping; radius: number };
export const ShowNext = (props: Props) => {
  const { nexts, colorMapping, radius } = props;
  const board = useMemo(() => {
    const newBoard = new PuyoBoard({ width: nexts.length, height: 2 });
    for (let i = 0; i < nexts.length; i++) {
      newBoard.board[0][i] = nexts[i][0];
      newBoard.board[1][i] = nexts[i][1];
    }
    return newBoard;
  }, [nexts]);
  return (
    <>
      <PuyoBoardView board={board} colorMapping={colorMapping} radius={radius} />
    </>
  );
};
