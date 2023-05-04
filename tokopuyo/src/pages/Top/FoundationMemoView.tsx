import { useEffect, useState } from 'react';
import { FoundationMemo, saveFoundationMemo, useFoundationMemo } from '../../context/FoundationMemo';
import { SelectValuePatternPrefixList } from './PatternPrefixList';

type Props = { selectValuePatternPrefixList?: SelectValuePatternPrefixList };
export const FoundationMemoView = (props: Props) => {
  const { selectValuePatternPrefixList } = props;
  const isSelectedMemo = (memo: FoundationMemo[number]) =>
    memo.startPatternType === selectValuePatternPrefixList?.startPatternType &&
    memo.afterStartPrefix === selectValuePatternPrefixList?.afterStartPrefix;
  const [foundationMemo, setFoundationMemo] = useFoundationMemo();
  const memo = foundationMemo.find((v) => isSelectedMemo(v));

  const [memoText, setMemoText] = useState('');
  const edited = selectValuePatternPrefixList !== undefined && memoText !== (memo?.memo ?? '');
  useEffect(() => {
    setMemoText(memo?.memo ?? '');
  }, [selectValuePatternPrefixList]);

  const onClickSave = () => {
    if (!selectValuePatternPrefixList) return;
    const { startPatternType, afterStartPrefix } = selectValuePatternPrefixList;
    const newFoundationMemo = [...foundationMemo];
    const target = newFoundationMemo.find((v) => isSelectedMemo(v));
    if (target) target.memo = memoText;
    else newFoundationMemo.push({ startPatternType, afterStartPrefix, memo: memoText });
    setFoundationMemo(newFoundationMemo);
    saveFoundationMemo(newFoundationMemo);
  };

  return (
    <>
      <div style={{ padding: '10px' }}>
        <div>
          <textarea style={{ width: '500px', height: '300px' }} value={memoText} onChange={(e) => setMemoText(e.target.value)} />
        </div>
        <div>
          <button onClick={onClickSave}>保存</button>
          {edited ? <span style={{ color: 'red' }}> edited</span> : ''}
        </div>
      </div>
    </>
  );
};
