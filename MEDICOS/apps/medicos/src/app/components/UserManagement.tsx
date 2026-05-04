import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';
import { Trash2, UserPlus, Shield, User as UserIcon, Edit2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

const UserManagement: React.FC = () => {
  const { data, updateData } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    name: '',
    role: 'user' as 'admin' | 'user',
    setorId: ''
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (data.users.find(u => u.username === newUser.username)) {
      toast.error('Nome de usuário já existe');
      return;
    }

    if (newUser.password.length < 6) {
      toast.error('Senha deve ter no mínimo 6 caracteres');
      return;
    }

    // Se for usuário comum, precisa ter setor
    if (newUser.role === 'user' && !newUser.setorId) {
      toast.error('Usuários comuns precisam ter um setor vinculado');
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      username: newUser.username,
      password: newUser.password,
      name: newUser.name,
      role: newUser.role,
      ...(newUser.role === 'user' && { setorId: newUser.setorId })
    };

    updateData({
      users: [...data.users, user]
    });

    toast.success('Usuário adicionado com sucesso!');
    
    // Reset form
    setNewUser({
      username: '',
      password: '',
      name: '',
      role: 'user',
      setorId: ''
    });
    setShowAddForm(false);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setNewUser({
      username: user.username,
      password: user.password,
      name: user.name,
      role: user.role,
      setorId: user.setorId || ''
    });
    setShowAddForm(true);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingUser) return;

    // Validar se username já existe em outro usuário
    if (data.users.find(u => u.username === newUser.username && u.id !== editingUser.id)) {
      toast.error('Nome de usuário já existe');
      return;
    }

    if (newUser.password.length < 6) {
      toast.error('Senha deve ter no mínimo 6 caracteres');
      return;
    }

    // Se for usuário comum, precisa ter setor
    if (newUser.role === 'user' && !newUser.setorId) {
      toast.error('Usuários comuns precisam ter um setor vinculado');
      return;
    }

    const updatedUser: User = {
      ...editingUser,
      username: newUser.username,
      password: newUser.password,
      name: newUser.name,
      role: newUser.role,
      ...(newUser.role === 'user' ? { setorId: newUser.setorId } : {})
    };

    updateData({
      users: data.users.map(u => u.id === editingUser.id ? updatedUser : u)
    });

    toast.success('Usuário atualizado com sucesso!');
    
    // Reset form
    setNewUser({
      username: '',
      password: '',
      name: '',
      role: 'user',
      setorId: ''
    });
    setShowAddForm(false);
    setEditingUser(null);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setShowAddForm(false);
    setNewUser({
      username: '',
      password: '',
      name: '',
      role: 'user',
      setorId: ''
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (data.users.length <= 1) {
      toast.error('Não é possível excluir o último usuário');
      return;
    }

    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      updateData({
        users: data.users.filter(u => u.id !== userId)
      });
      toast.success('Usuário excluído com sucesso!');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2" style={{ color: '#0a2b3e' }}>Gestão de Usuários</h1>
          <p className="text-gray-600">Adicionar e gerenciar usuários do sistema</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all hover:shadow-lg"
          style={{ backgroundColor: '#1e6a8f' }}
        >
          <UserPlus className="w-5 h-5" />
          Adicionar Usuário
        </button>
      </div>

      {/* Formulário de Adicionar Usuário */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
          <h2 className="text-xl mb-4" style={{ color: '#0a2b3e' }}>Novo Usuário</h2>
          <form onSubmit={editingUser ? handleUpdateUser : handleAddUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700">Nome Completo *</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                  placeholder="Ex: João Silva"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">Nome de Usuário *</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                  placeholder="Ex: joao.silva"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">Senha *</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">Perfil *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'user' })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                  required
                >
                  <option value="user">Usuário</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              {newUser.role === 'user' && (
                <div>
                  <label className="block text-sm mb-2 text-gray-700">Setor *</label>
                  <select
                    value={newUser.setorId}
                    onChange={(e) => setNewUser({ ...newUser, setorId: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                    required
                  >
                    <option value="">Selecione um setor</option>
                    {data.setores.map(setor => (
                      <option key={setor.id} value={setor.id}>{setor.nome}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-white transition-all hover:shadow-lg"
                style={{ backgroundColor: '#1e6a8f' }}
              >
                {editingUser ? 'Atualizar' : 'Adicionar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Usuários */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#0a2b3e' }}>
              <tr>
                <th className="px-6 py-4 text-left text-sm text-white">Nome</th>
                <th className="px-6 py-4 text-left text-sm text-white">Usuário</th>
                <th className="px-6 py-4 text-left text-sm text-white">Perfil</th>
                <th className="px-6 py-4 text-center text-sm text-white">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1e6a8f] flex items-center justify-center text-white">
                        {user.name.charAt(0)}
                      </div>
                      <span className="text-sm" style={{ color: '#0a2b3e' }}>
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {user.username}
                  </td>
                  <td className="px-6 py-4">
                    {user.role === 'admin' ? (
                      <Badge className="bg-purple-500 hover:bg-purple-600">
                        <Shield className="w-3 h-3 mr-1" />
                        Administrador
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <UserIcon className="w-3 h-3 mr-1" />
                        Usuário
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all"
                      title="Editar usuário"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                      title="Excluir usuário"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;