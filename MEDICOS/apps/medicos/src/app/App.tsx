import { RouterProvider } from 'react-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import { createAppRouter } from './routes';
import LoginScreen from './components/LoginScreen';
import { Toaster } from 'sonner';
import { useEffect, useState } from 'react';

function AppContent() {
  const { user } = useAuth();
  const [router, setRouter] = useState<ReturnType<typeof createAppRouter> | null>(null);

  useEffect(() => {
    // Criar router após o contexto estar pronto
    setRouter(createAppRouter());
  }, []);

  if (!user) {
    return <LoginScreen />;
  }

  if (!router) {
    return <div>Carregando...</div>;
  }

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}