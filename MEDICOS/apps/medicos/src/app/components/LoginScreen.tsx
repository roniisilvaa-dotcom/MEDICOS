import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { LogIn, Activity } from 'lucide-react';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Preencha todos os campos');
      return;
    }

    const success = login(username, password);
    
    if (success) {
      toast.success('Login realizado com sucesso!');
    } else {
      toast.error('Usuário ou senha incorretos');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a2b3e] via-[#1e6a8f] to-[#0a2b3e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header com Logo */}
          <div className="bg-gradient-to-r from-[#0a2b3e] to-[#1e6a8f] p-8">
            <div className="flex items-center justify-center mb-6">
              {/* Logo VITALLIS */}
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-white rounded-full p-4 shadow-2xl flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center">
                    <Activity className="w-16 h-16 text-[#1e6a8f]" strokeWidth={2.5} />
                    <span className="text-[#0a2b3e] font-bold text-xl mt-2">VITALLIS</span>
                  </div>
                </div>
              </div>
            </div>
            
            <h1 className="text-2xl font-light text-white text-center tracking-wide">
              Sistema de Indicadores
            </h1>
            <p className="text-blue-100 text-center text-sm mt-2 font-light">
              Gestão Hospitalar Inteligente
            </p>
          </div>

          {/* Formulário */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Usuário
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e6a8f] focus:border-transparent transition-all"
                  placeholder="Digite seu usuário"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e6a8f] focus:border-transparent transition-all"
                  placeholder="Digite sua senha"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#0a2b3e] to-[#1e6a8f] text-white py-3 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 font-medium shadow-lg"
              >
                <LogIn className="w-5 h-5" />
                Entrar
              </button>
            </form>

            {/* Credenciais de Teste */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-3">Credenciais de teste:</p>
              <div className="space-y-2 text-xs">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-semibold text-gray-700">Administrador</p>
                  <p className="text-gray-600">Usuário: <span className="font-mono">admin</span> | Senha: <span className="font-mono">admin123</span></p>
                  <p className="text-gray-500 text-xs mt-1">Acesso total ao sistema</p>
                </div>
                <div className="bg-teal-50 p-3 rounded-lg">
                  <p className="font-semibold text-gray-700">Centro Cirúrgico</p>
                  <p className="text-gray-600">Usuário: <span className="font-mono">centro_cirurgico</span> | Senha: <span className="font-mono">cc123</span></p>
                  <p className="text-gray-500 text-xs mt-1">Acesso ao Centro Cirúrgico + Indicadores</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="font-semibold text-gray-700">Usuário - UCINCO</p>
                  <p className="text-gray-600">Usuário: <span className="font-mono">ucinco</span> | Senha: <span className="font-mono">ucinco123</span></p>
                  <p className="text-gray-500 text-xs mt-1">Acesso apenas ao setor UCINCO</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="font-semibold text-gray-700">Usuário - Pronto Atendimento</p>
                  <p className="text-gray-600">Usuário: <span className="font-mono">pa</span> | Senha: <span className="font-mono">pa123</span></p>
                  <p className="text-gray-500 text-xs mt-1">Acesso apenas ao Pronto Atendimento</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white text-sm font-light">
            © 2024 VITALLIS - Sistema de Gestão Hospitalar
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;