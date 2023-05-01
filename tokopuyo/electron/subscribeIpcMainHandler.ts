import { ipcMain } from 'electron';
import { MyAPI } from './electronInterProcessCommunication'
import * as fs from 'fs';

/** 不要なら削除し、package.jsonからelectron-storeを削除。 */
const ElectronStore = require('electron-store');
const store = new ElectronStore();

const subscriptions: MyAPI = {
  callSample: (sample) => console.log(`sample! ${sample.name}`),
  writeFile: (filePath, content) => fs.writeFileSync(replaceEnv(filePath), content),
  readFile: (filePath) => fs.readFileSync(replaceEnv(filePath)).toString(),
  fileExists: (filePath) => fs.existsSync(replaceEnv(filePath)),
};

const replaceEnv = (str: string): string => {
  return str.replace(/%USERPROFILE%/g, process.env['USERPROFILE'] || '');
};

// electron起動の中で、この関数を呼び出す。
// package.jsonの"main"プロパティに指定したエントリーポイントからの処理内で実行されていればOK。
export const subscribeIpcMainHandler = () => {
  for (let key in subscriptions) ipcMain.handle(key, (_event, ...args) => subscriptions[key](...args));
};
