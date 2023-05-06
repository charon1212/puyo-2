import { PuyoBoard, PuyoColor } from '@charon1212/puyo-domain';
import { ColorMapping } from './ColorMapping';
import { useState } from 'react';
import { PuyoBoardView } from './PuyoBoardView';

const incrementPuyoColor = (puyoColor: PuyoColor) => ((puyoColor + 1) % 5) as PuyoColor;

type Args = {
  initBoard: PuyoBoard;
  colorMapping: ColorMapping;
  radius: number;
  onMouseRightClick?: (x: number, y: number) => unknown;
};

export const useEditablePuyoBoard = (args: Args) => {
  const { initBoard, colorMapping, radius, onMouseRightClick } = args;
  console.log({ args });
  const [board, setBoard] = useState(initBoard);
  const onMouseClick = (x: number, y: number, side: 'left' | 'right') => {
    if (side === 'left') {
      const newBoard = board.deepCopy();
      newBoard.board[y][x] = incrementPuyoColor(newBoard.board[y][x]);
      setBoard(newBoard);
    } else {
      onMouseRightClick?.(x, y);
    }
  };
  const ui = <PuyoBoardView board={board} colorMapping={colorMapping} radius={radius} onMouseClick={onMouseClick} />;
  return [ui, board, setBoard] as const;
};
