/**
 * 方向を表す列挙型。
 * 1: 上、2: 右、3: 下、4: 左
 */
export type Dir = typeof DirUp | typeof DirRight | typeof DirDown | typeof DirLeft;
export const DirUp = 1;
export const DirRight = 2;
export const DirDown = 3;
export const DirLeft = 4;

/**
 * Currentぷよの状態から親ぷよと子ぷよの座標を取得する。
 * @param x 0～5
 * @param dir 親ぷよに対する子ぷよの方向
 * @returns 親ぷよ・子ぷよのx,y座標。y座標は親ぷよをy=1とし、上に子ぷよがある場合はy=2, 下に子ぷよがある場合はy=0とする。
 */
export const getCoordinates = (x: number, dir: Dir) => {
  const parentX = x;
  const parentY = 1;
  return { parentX, parentY, childX: parentX + dx[dir - 1], childY: parentY + dy[dir - 1] };
};

const dx = [0, 1, 0, -1];
const dy = [1, 0, -1, 0];