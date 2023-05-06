import { Arr } from 'util-charon1212';
import { ColorMapping } from './ColorMapping';
import { PuyoBoard, PuyoColor } from '@charon1212/puyo-domain';

type Props = {
  board: PuyoBoard;
  colorMapping: ColorMapping;
  radius: number;
  onMouseClick?: (x: number, y: number, side: 'left' | 'right') => unknown;
};
export const PuyoBoardView = (props: Props) => {
  const { board, colorMapping, radius, onMouseClick } = props;
  const reversed = [...board.board].reverse();
  return (
    <>
      <table style={{ borderCollapse: 'collapse' }}>
        <colgroup>
          {Arr(board.width).map((_, k) => (
            <col key={k} style={{ width: `${3 * radius}px` }} />
          ))}
        </colgroup>
        <tbody>
          {reversed.map((row, index) => {
            return (
              <Row
                key={index}
                row={row}
                colorMapping={colorMapping}
                radius={radius}
                onMouseClick={(x, side) => onMouseClick?.(x, reversed.length - 1 - index, side)}
              />
            );
          })}
        </tbody>
      </table>
    </>
  );
};

type PropsRow = { row: PuyoColor[]; colorMapping: ColorMapping; radius: number; onMouseClick?: (x: number, side: 'left' | 'right') => unknown };
const Row = (props: PropsRow) => {
  const { row, colorMapping, radius, onMouseClick } = props;
  return (
    <tr>
      {row.map((cell, x) => (
        <Cell cell={cell} colorMapping={colorMapping} radius={radius} onMouseClick={(side) => onMouseClick?.(x, side)} />
      ))}
    </tr>
  );
};

type PropsCell = { cell: PuyoColor; colorMapping: ColorMapping; radius: number; onMouseClick?: (side: 'left' | 'right') => unknown };
const Cell = (props: PropsCell) => {
  const { cell, colorMapping, radius, onMouseClick } = props;
  return (
    <td
      style={{
        border: '1px solid black',
        height: `${3 * radius}px`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}
        onClick={(e) => {
          e.preventDefault();
          onMouseClick?.('left');
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          onMouseClick?.('right');
        }}
      >
        <div
          style={{
            backgroundColor: colorMapping[cell],
            width: `${2 * radius}px`,
            height: `${2 * radius}px`,
            borderRadius: '50%',
          }}
        />
      </div>
    </td>
  );
};
