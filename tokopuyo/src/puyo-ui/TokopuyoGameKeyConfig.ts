export type TokopuyoGameKeyConfigOperation = 'left' | 'right' | 'rotateLeft' | 'rotateRight' | 'fall' | 'reset' | 'back' | 'next';
/**
 * TokopuyoGame用のキーコンフィグ。
 * key値はそのままKeyDownイベントのe.keyと比較するので、設定する値は<https://www.w3.org/TR/uievents-key/#named-key-attribute-values>を参照すること。
 */
export type TokopuyoGameKeyConfig = { key: string; operation: TokopuyoGameKeyConfigOperation }[];

export const getDefaultKeyConfig = (): TokopuyoGameKeyConfig => [
  { key: 'ArrowLeft', operation: 'left' },
  { key: 'ArrowRight', operation: 'right' },
  { key: 'z', operation: 'rotateLeft' },
  { key: 'x', operation: 'rotateRight' },
  { key: 'ArrowDown', operation: 'fall' },
  { key: 'r', operation: 'reset' },
  { key: 'a', operation: 'back' },
  { key: 's', operation: 'next' },
];
