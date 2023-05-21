/**
 * 方向を表す列挙型。
 * 0: 上、1: 右、2: 下、3: 左
 * 各方向は、定数DirUp等を利用すること。
 */
export type Dir = typeof DirUp | typeof DirRight | typeof DirDown | typeof DirLeft;
export const DirUp = 0;
export const DirRight = 1;
export const DirDown = 2;
export const DirLeft = 3;

/**
 * 方向を指定量だけ回転する。
 * @param dir 方向を表す数値。
 * @param dif 回転量。上を右に回転する方向を正とする。
 * @returns 回転後の方向を表す数値。
 */
export const rotateDir = (dir: Dir, dif: number): Dir => dif >= 0 ? (dir + dif) % 4 as Dir : rotateDir(dir, dif % 4 + 4);

/** 座標型 */
export type PuyoCoordinate = { x: number, dir: Dir };

/**
 * Currentぷよの状態から親ぷよと子ぷよの座標を取得する。
 * @param x 0～5
 * @param dir 親ぷよに対する子ぷよの方向
 * @returns 親ぷよ・子ぷよのx,y座標。y座標は親ぷよをy=1とし、上に子ぷよがある場合はy=2, 下に子ぷよがある場合はy=0とする。
 */
export const getCoordinates = ({ x, dir }: PuyoCoordinate) => {
  const parentX = x;
  const parentY = 1;
  return { parentX, parentY, childX: parentX + dx[dir], childY: parentY + dy[dir] };
};

const dx = [0, 1, 0, -1];
const dy = [1, 0, -1, 0];

/**
 * カレントぷよを操作する関数を取得する。
 * @param minX x座標の最小値を指定する。各操作の戻り値のxは、この値を取りうる。
 * @param maxX x座標の最大値を指定する。各操作の戻り値のxは、この値を取りうる。
 */
export const getCoordinateOperator = (minX: number, maxX: number,) => ({
  rotateRight: (cor: PuyoCoordinate): PuyoCoordinate =>
    cor.dir === DirUp && cor.x >= maxX ? { x: maxX - 1, dir: DirRight } :
      cor.dir === DirDown && cor.x <= minX ? { x: minX + 1, dir: DirLeft } :
        { x: cor.x, dir: rotateDir(cor.dir, 1) },
  rotateLeft: (cor: PuyoCoordinate): PuyoCoordinate =>
    cor.dir === DirDown && cor.x >= maxX ? { x: maxX - 1, dir: DirRight } :
      cor.dir === DirUp && cor.x <= minX ? { x: minX + 1, dir: DirLeft } :
        { x: cor.x, dir: rotateDir(cor.dir, 3) }, // mod4のもと、-1と3は同じ。
  moveRight: (cor: PuyoCoordinate): PuyoCoordinate => cor.dir === DirRight ? { x: Math.min(cor.x + 1, maxX - 1), dir: cor.dir } : { x: Math.min(cor.x + 1, maxX), dir: cor.dir },
  moveLeft: (cor: PuyoCoordinate): PuyoCoordinate => cor.dir === DirLeft ? { x: Math.max(cor.x - 1, minX + 1), dir: cor.dir } : { x: Math.max(cor.x - 1, minX), dir: cor.dir },
});
