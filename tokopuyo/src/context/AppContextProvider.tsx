import { useEffect } from 'react';
import {
  PuyoTsumoPatternRepositoryProvider,
  getInitialPuyoTsumoPatternRepository,
  usePuyoTsumoPatternRepository,
} from './PuyoTsumoPatternRepository';

type Props = { children: React.ReactNode };
export const AppContextProvider = (props: Props) => {
  const { children } = props;
  return (
    <>
      <PuyoTsumoPatternRepositoryProvider>
        <ContextInitializer>{children}</ContextInitializer>
      </PuyoTsumoPatternRepositoryProvider>
    </>
  );
};

const ContextInitializer = ({ children }: { children: React.ReactNode }) => {
  const [_, setRepository] = usePuyoTsumoPatternRepository();
  useEffect(() => {
    let flag = true;
    getInitialPuyoTsumoPatternRepository().then((newRepository) => {
      flag && setRepository(newRepository);
    });
    return () => {
      flag = false;
    };
  }, []);
  return <>{children}</>;
};
