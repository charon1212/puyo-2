import { AppContextProvider } from './context/AppContextProvider';
import { TopPage } from './pages/Top/TopPage';

type Props = {};
export const App = (props: Props) => {
  const {} = props;
  return (
    <>
      <AppContextProvider>
        <TopPage />
      </AppContextProvider>
    </>
  );
};
