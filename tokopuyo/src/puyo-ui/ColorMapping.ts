import { PuyoColor } from "../puyo-domain/PuyoColor";

export type ColorMapping = { [key in PuyoColor]: string };

export const getRandomColorMapping = (): ColorMapping => {
  const arr: string[] = shuffle(['red', 'blue', 'yellow', 'green', 'purple']);
  return {
    0: '',
    1: arr[0],
    2: arr[1],
    3: arr[2],
    4: arr[3],
  };
};

const shuffle = <T>(arr: T[]) => {
  for (let i = 0; i < arr.length - 1; i++)
    for (let j = i + 1; j < arr.length; j++)
      if (Math.random() < 0.5) [arr[i], arr[j]] = [arr[j], arr[i]]
  return arr;
};
