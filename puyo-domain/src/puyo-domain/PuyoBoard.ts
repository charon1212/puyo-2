import { emptyColor, PuyoColor } from "./PuyoColor";
import { Dir, DirDown, getCoordinates, PuyoCoordinate } from "./PuyoCoordinate";
import { Arr } from 'util-charon1212';
import { PuyoTsumo } from "./PuyoTsumo";

type Point = { x: number, y: number };
const eraseConnectCount = 4; // 何個ぷよが連結したら消すか
const dpList: Point[] = [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 0, y: -1 },]; // 上下左右を表現するPointリスト

export class PuyoBoard {
  width: number;
  height: number;
  board: PuyoColor[][]; // 第1引数は高さ、第2引数は横を表す。
  ignoreTopRowWhenErase: boolean = true;
  constructor({ width, height }: { width: number, height: number }) {
    this.board = Arr(height).map(() => Arr(width).map(() => emptyColor));
    this.width = width;
    this.height = height;
  }
  static fromStr(str: string) {
    const b = str.split('/').map((v) => {
      const a: PuyoColor[] = [];
      for (let i = 0; i < v.length; i++) a.push(+v[i] as PuyoColor);
      return a;
    });
    const newBoard = new PuyoBoard({ width: b[0].length, height: b.length });
    newBoard.board = b;
    return newBoard;
  }
  toStr() {
    return this.board.map((v) => v.map((v) => `${v}`).join).join('/');
  }
  /** インスタンスのディープコピーを取得する。 */
  deepCopy() {
    const newBoard = new PuyoBoard({ width: this.width, height: this.height });
    newBoard.board = this.board.map((v) => [...v]);
    return newBoard;
  }
  /**
   * ぷよを配置する。この関数実行後、落下は必要ない。
   * @param parent 親ぷよ
   * @param child 子ぷよ
   * @param x 親ぷよのx座標
   * @param dir 親ぷよに対する子ぷよの方向
   */
  put(tsumo: PuyoTsumo, cor: PuyoCoordinate) {
    const { parentX, childX } = getCoordinates(cor);
    if (cor.dir === DirDown) {
      // 子ぷよが下の場合、子ぷよから先に置く
      this.putOne(tsumo[1], childX);
      this.putOne(tsumo[0], parentX);
    } else {
      this.putOne(tsumo[0], parentX);
      this.putOne(tsumo[1], childX);
    }
  }
  private putOne(p: PuyoColor, x: number) {
    for (let i = 0; i < this.height; i++) {
      if (this.board[i][x] === emptyColor) {
        this.board[i][x] = p;
        break;
      }
    }
  }
  /**
   * ぷよを落下させる
   * @returns 1つ以上落下した場合はtrue。
   */
  fall() {
    let result = false;
    for (let x = 0; x < this.width; x++) {
      let hosei = 0;
      for (let y = 0; y < this.height; y++) {
        if (this.board[y][x] !== 0) {
          this.board[y - hosei][x] = this.board[y][x];
          if (hosei > 0) {
            this.board[y][x] = emptyColor;
            result = true;
          }
        } else {
          hosei++;
        }
      }
    }
    return result;
  }
  /**
   * eraseConnectCount以上の連結ぷよを削除する。
   * @returns 1つ以上削除した場合はtrue。
   */
  erase() {
    // 最上段は控えておき、削除処理中は無いものとし、最後に戻す。 (ignoreTopRowWhenEraseがtrueの時)
    const upperRow = [...(this.board[this.height - 1])];
    if (this.ignoreTopRowWhenErase) for (let x = 0; x < this.width; x++) this.board[this.height - 1][x] = emptyColor;
    let examinedList: Point[] = [];
    let eraseList: Point[] = [];
    for (let y = 0; y < this.height - 1; y++) {
      for (let x = 0; x < this.width; x++) {
        if (!examinedList.some((q) => q.x === x && q.y === y)) {
          const connectList = this.searchConnectPointList({ x, y });
          examinedList = examinedList.concat(connectList); // 検査済みリストに隣接ポイントを追加
          if (connectList.length >= eraseConnectCount) {
            eraseList = eraseList.concat(connectList); // 規定数以上つながっている場合、消去するポイントのリストに隣接ポイントを追加
          }
        }
      }
    }
    // 最上段は最後に戻す。 (ignoreTopRowWhenEraseがtrueの時)
    if (this.ignoreTopRowWhenErase) this.board[this.height - 1] = upperRow;

    for (let p of eraseList) this.board[p.y][p.x] = emptyColor;
    return eraseList.length > 0;
  }
  private searchConnectPointList(p: Point) {
    const temp = this.board[p.y][p.x];
    if (temp === emptyColor) return [];
    const connectionList: Point[] = [];
    connectionList.push(p);
    this.board[p.y][p.x] = emptyColor; // いったん消す
    for (let dp of dpList) {
      const x = p.x + dp.x;
      const y = p.y + dp.y;
      if (this.board[y] && this.board[y][x] === temp) connectionList.push(...this.searchConnectPointList({ x, y }));
    }
    this.board[p.y][p.x] = temp; // 戻す
    return connectionList;
  }
};
