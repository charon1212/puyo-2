import { createStateContext } from "@charon1212/my-lib-react";

export type FoundationMemo = { startPatternType: string, afterStartPrefix: string, memo: string }[];

const [FoundationMemoProvider, useFoundationMemo] = createStateContext<FoundationMemo>([]);
export { FoundationMemoProvider, useFoundationMemo };

const foundationMemoFilePath = '%USERPROFILE%/.electron/charon1212/FoundationMemo.json';
export const loadFoundationMemo = async (): Promise<FoundationMemo> => {
  const exists = await window.myAPI.fileExists(foundationMemoFilePath)
  if (!exists) return [];
  const fileContent = await window.myAPI.readFile(foundationMemoFilePath);
  return JSON.parse(fileContent);
};

export const saveFoundationMemo = async (memo: FoundationMemo) => {
  return window.myAPI.writeFile(foundationMemoFilePath, JSON.stringify(memo));
};
