import { PuyoBoard, PuyoColor } from "@charon1212/puyo-domain";

/**
 * 連鎖尾を探索する。
 * @param board 対象の盤面
 * @param searchList 探索を行うポイント。x,yいずれも0スタート。yは下から何段目、xは左から何列目。
 * @param minRensa 連鎖尾として成立と見なす最小の連鎖数。
 */
export const searchChainTail = (board: PuyoBoard, searchList: { x: number, y: number, candidate: PuyoColor[] }[], minRensa: number): PuyoBoard[] => {

  // searchListを全て埋めたとしても落下が起きるなら、どう組んでもNGとして、early return。
  const test = board.deepCopy();
  for (let { x, y } of searchList) test.board[y][x] = 1;
  if (test.fall()) return [];

  const copySearchList = [...searchList];
  const top = copySearchList.shift();
  if (!top) {
    const rensaCount = getRensaCount(board.deepCopy());
    console.log({ rensaCount, board });
    if (rensaCount >= minRensa) return [board];
    else return [];
  }
  return top.candidate.flatMap((p) => {
    const copyBoard = board.deepCopy();
    copyBoard.board[top.y][top.x] = p;
    return searchChainTail(copyBoard, copySearchList, minRensa);
  });
};

const getRensaCount = (board: PuyoBoard) => {
  console.log(board);
  for (let i = 0; i < 20; i++) {
    board.fall();
    const r = board.erase();
    if (!r) return i;
  }
  return -1;
};
