import { Arr } from 'util-charon1212';
import { ColorMapping } from './ColorMapping';
import { PuyoBoard, PuyoColor } from '@charon1212/puyo-domain';

type Props = { board: PuyoBoard; colorMapping: ColorMapping; radius: number };
export const PuyoBoardView = (props: Props) => {
  const { board, colorMapping, radius } = props;
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
            return <Row key={index} row={row} colorMapping={colorMapping} radius={radius} />;
          })}
        </tbody>
      </table>
    </>
  );
};

type PropsRow = { row: PuyoColor[]; colorMapping: ColorMapping; radius: number };
const Row = (props: PropsRow) => {
  const { row, colorMapping, radius } = props;
  return (
    <tr>
      {row.map((cell) => (
        <Cell cell={cell} colorMapping={colorMapping} radius={radius} />
      ))}
    </tr>
  );
};

type PropsCell = { cell: PuyoColor; colorMapping: ColorMapping; radius: number };
const Cell = (props: PropsCell) => {
  const { cell, colorMapping, radius } = props;
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
