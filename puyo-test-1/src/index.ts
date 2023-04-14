import { TsumoManager } from "./logic/TsumoManager";
import { writeTsumoFile } from "./logic/writeTsumoFile";

export const index = () => {
  console.log('start puyo-test-1');

  const tm = TsumoManager.createFromFile();
  const patterns = tm.getPattern([[1, 1]], 2);
  console.log(JSON.stringify({ patterns }));

};

index();
