import { useEffect } from 'react';
import {
  PuyoTsumoPatternRepository2Provider,
  getInitialPuyoTsumoPatternRepository2,
  usePuyoTsumoPatternRepository2,
} from './PuyoTsumoPatternRepository2';

type Props = { children: React.ReactNode };
export const AppContextProvider = (props: Props) => {
  const { children } = props;
  return (
    <>
      <PuyoTsumoPatternRepository2Provider>
        <ContextInitializer>{children}</ContextInitializer>
      </PuyoTsumoPatternRepository2Provider>
    </>
  );
};

const ContextInitializer = ({ children }: { children: React.ReactNode }) => {
  const [_, setRepository] = usePuyoTsumoPatternRepository2();
  useEffect(() => {
    let flag = true;
    getInitialPuyoTsumoPatternRepository2().then((newRepository) => {
      flag && setRepository(newRepository);
    });
    return () => {
      flag = false;
    };
  }, []);
  return <>{children}</>;
};
