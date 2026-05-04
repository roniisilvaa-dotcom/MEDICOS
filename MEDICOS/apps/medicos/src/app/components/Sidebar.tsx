import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Building2, 
  ClipboardPlus, 
  Users, 
  Download,
  LogOut,
  ChevronDown,
  Bell,
  Activity,
  ClipboardCheck,
  Scissors,
  Target,
  FileText
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === 'admin';
  const isCentroCirurgico = user?.setorId === 'centro-cirurgico';

  // Menu items baseado no role e setor
  const menuItems = isAdmin ? [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Building2, label: 'Setores', path: '/setores' },
    { icon: ClipboardPlus, label: 'Alimentar Dados', path: '/dados' },
    { icon: Activity, label: 'Análise de Incidentes', path: '/analise' },
    { icon: ClipboardCheck, label: 'Planos de Ação', path: '/planos' },
    { icon: Target, label: 'Gerenciamento de Planos', path: '/gerenciamento-planos' },
    { icon: FileText, label: 'Justificativas', path: '/justificativa-indicadores' },
    { icon: Scissors, label: 'Centro Cirúrgico', path: '/centro-cirurgico' },
    { icon: Users, label: 'Usuários', path: '/usuarios' },
    { icon: Download, label: 'Backup', path: '/backup' },
  ] : isCentroCirurgico ? [
    { icon: Scissors, label: 'Centro Cirúrgico', path: '/centro-cirurgico' },
    { icon: ClipboardPlus, label: 'Alimentar Dados', path: '/dados' },
    { icon: Target, label: 'Plano de Ação', path: '/gerenciamento-planos' },
    { icon: FileText, label: 'Justificativas', path: '/justificativa-indicadores' },
  ] : [
    { icon: ClipboardPlus, label: 'Alimentar Dados', path: '/dados' },
    { icon: Target, label: 'Plano de Ação', path: '/gerenciamento-planos' },
    { icon: FileText, label: 'Justificativas', path: '/justificativa-indicadores' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-[#f5f7fa]">
      {/* Sidebar */}
      <div className="w-64 bg-[#2c3e50] text-white flex flex-col">
        {/* Logo VITALLIS */}
        <div className="p-6 flex flex-col items-center border-b border-gray-600">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
            <Activity className="w-12 h-12 text-[#1e6a8f]" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold tracking-wider">VITALLIS</h1>
          <p className="text-xs text-gray-400 mt-1 text-center">Sistema de Indicadores</p>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-[#3498db] text-white' 
                        : 'text-gray-300 hover:bg-[#34495e]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer com Logo e Logout */}
        <div className="border-t border-gray-600">
          <div className="p-4 flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 shadow-md">
              <Activity className="w-10 h-10 text-[#1e6a8f]" strokeWidth={2.5} />
            </div>
            <p className="text-xs text-gray-400 text-center font-semibold">VITALLIS</p>
          </div>
          
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600/20 hover:text-red-400 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              {isAdmin && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 ml-6">
              {isAdmin && (
                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-all">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              )}
              
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="w-10 h-10 rounded-full bg-[#3498db] flex items-center justify-center">
                  <span className="text-sm text-white font-semibold">{user?.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role === 'admin' ? 'Administrador' : user?.role === 'cirurgico' ? 'Centro Cirúrgico' : 'Usuário'}
                  </p>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded transition-all">
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;