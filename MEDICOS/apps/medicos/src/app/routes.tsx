import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SetoresView from './components/SetoresView';
import DataEntryForm from './components/DataEntryForm';
import UserManagement from './components/UserManagement';
import BackupView from './components/BackupView';
import AnaliseIncidentes from './components/AnaliseIncidentes';
import PlanosAcao from './components/PlanosAcao';
import SurgicalCenter from './components/surgical/SurgicalCenter';
import ActionPlanManager from './components/ActionPlanManager';
import IndicatorJustification from './components/IndicatorJustification';

// Componente para proteger rotas admin
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (user?.role !== 'admin') {
    return <Navigate to="/dados" replace />;
  }
  
  return <>{children}</>;
};

// Componente para rotas do Centro Cirúrgico (Admin e usuários do setor Centro Cirúrgico)
const SurgicalRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (user?.role !== 'admin' && user?.setorId !== 'centro-cirurgico') {
    return <Navigate to="/dados" replace />;
  }
  
  return <>{children}</>;
};

// Componente para redirecionar para a página inicial correta
const HomeRedirect = () => {
  const { user } = useAuth();
  
  // Admin vai para Dashboard principal com gráficos
  if (user?.role === 'admin') {
    return (
      <Sidebar>
        <Dashboard />
      </Sidebar>
    );
  }
  
  // Usuário do Centro Cirúrgico vai direto para o módulo do CC
  if (user?.setorId === 'centro-cirurgico') {
    return <Navigate to="/centro-cirurgico" replace />;
  }
  
  // Outros usuários vão para alimentar dados
  return <Navigate to="/dados" replace />;
};

// Root wrapper que garante que o AuthContext está disponível
const RootLayout = () => {
  return <Outlet />;
};

export const createAppRouter = () => createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <HomeRedirect />,
      },
      {
        path: '/setores',
        element: (
          <AdminRoute>
            <Sidebar>
              <SetoresView />
            </Sidebar>
          </AdminRoute>
        ),
      },
      {
        path: '/dados',
        element: (
          <Sidebar>
            <DataEntryForm />
          </Sidebar>
        ),
      },
      {
        path: '/analise',
        element: (
          <AdminRoute>
            <Sidebar>
              <AnaliseIncidentes />
            </Sidebar>
          </AdminRoute>
        ),
      },
      {
        path: '/planos',
        element: (
          <AdminRoute>
            <Sidebar>
              <PlanosAcao />
            </Sidebar>
          </AdminRoute>
        ),
      },
      {
        path: '/usuarios',
        element: (
          <AdminRoute>
            <Sidebar>
              <UserManagement />
            </Sidebar>
          </AdminRoute>
        ),
      },
      {
        path: '/backup',
        element: (
          <AdminRoute>
            <Sidebar>
              <BackupView />
            </Sidebar>
          </AdminRoute>
        ),
      },
      {
        path: '/centro-cirurgico',
        element: (
          <SurgicalRoute>
            <Sidebar>
              <SurgicalCenter />
            </Sidebar>
          </SurgicalRoute>
        ),
      },
      {
        path: '/gerenciamento-planos',
        element: (
          <Sidebar>
            <ActionPlanManager />
          </Sidebar>
        ),
      },
      {
        path: '/justificativa-indicadores',
        element: (
          <Sidebar>
            <IndicatorJustification />
          </Sidebar>
        ),
      },
    ],
  },
]);