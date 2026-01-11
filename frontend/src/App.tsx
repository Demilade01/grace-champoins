import { LandingPage } from '@/components/LandingPage';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <LandingPage />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(22, 163, 74, 0.3)',
            boxShadow: '0 8px 32px rgba(22, 163, 74, 0.2)',
          },
        }}
      />
    </>
  );
}

export default App;
