import MainScreen from '@/components/screens/MainScreen.tsx';
import { Toaster } from '@/components/ui/sonner.tsx';

function App() {
  return (
    <>
      <MainScreen />
      <Toaster theme={'light'} richColors={true} />
    </>
  );
}

export default App;
