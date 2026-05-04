import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { 
  Plus, Target, Calendar, Users, AlertCircle, CheckCircle, 
  Clock, Edit, Trash2, TrendingUp, FileText
} from 'lucide-react';
import { toast } from 'sonner';

interface ActionPlan {
  id: string;
  setorId: string;
  setorNome: string;
  indicador: string;
  metaAtual: string;
  metaDesejada: string;
  prazo: string;
  responsavel: string;
  acoes: string[];
  status: 'pendente' | 'em-andamento' | 'concluido' | 'atrasado';
  dataCriacao: string;
  observacoes: string;
}

export default function ActionPlanManager() {
  const { user, data, updateData } = useAuth();
  const [planos, setPlanos] = useState<ActionPlan[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ActionPlan | null>(null);
  const [setorSelecionado, setSetorSelecionado] = useState('');
  
  const isAdmin = user?.role === 'admin';
  
  // Filtrar setores baseado no role do usuário
  const availableSetores = isAdmin 
    ? data.setores 
    : data.setores.filter(s => s.id === user?.setorId);

  // Estados do formulário
  const [formData, setFormData] = useState({
    indicador: '',
    metaAtual: '',
    metaDesejada: '',
    prazo: '',
    responsavel: '',
    acao1: '',
    acao2: '',
    acao3: '',
    observacoes: ''
  });

  useEffect(() => {
    // Carregar planos do localStorage
    const savedPlans = localStorage.getItem('actionPlans');
    if (savedPlans) {
      setPlanos(JSON.parse(savedPlans));
    }

    // Se for usuário comum, setar automaticamente seu setor
    if (!isAdmin && user?.setorId) {
      setSetorSelecionado(user.setorId);
    }
  }, [user, isAdmin]);

  const savePlans = (updatedPlans: ActionPlan[]) => {
    localStorage.setItem('actionPlans', JSON.stringify(updatedPlans));
    setPlanos(updatedPlans);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!setorSelecionado) {
      toast.error('Selecione um setor');
      return;
    }

    const setor = data.setores.find(s => s.id === setorSelecionado);
    if (!setor) return;

    const acoes = [formData.acao1, formData.acao2, formData.acao3].filter(a => a.trim());

    if (acoes.length === 0) {
      toast.error('Adicione pelo menos uma ação');
      return;
    }

    if (editingPlan) {
      // Editar plano existente
      const updatedPlans = planos.map(p => 
        p.id === editingPlan.id 
          ? {
              ...p,
              indicador: formData.indicador,
              metaAtual: formData.metaAtual,
              metaDesejada: formData.metaDesejada,
              prazo: formData.prazo,
              responsavel: formData.responsavel,
              acoes,
              observacoes: formData.observacoes
            }
          : p
      );
      savePlans(updatedPlans);
      toast.success('Plano de ação atualizado com sucesso!');
    } else {
      // Criar novo plano
      const newPlan: ActionPlan = {
        id: Date.now().toString(),
        setorId: setorSelecionado,
        setorNome: setor.nome,
        indicador: formData.indicador,
        metaAtual: formData.metaAtual,
        metaDesejada: formData.metaDesejada,
        prazo: formData.prazo,
        responsavel: formData.responsavel,
        acoes,
        status: 'pendente',
        dataCriacao: new Date().toISOString().split('T')[0],
        observacoes: formData.observacoes
      };

      savePlans([...planos, newPlan]);
      toast.success('Plano de ação criado com sucesso!');
    }

    // Resetar formulário
    setFormData({
      indicador: '',
      metaAtual: '',
      metaDesejada: '',
      prazo: '',
      responsavel: '',
      acao1: '',
      acao2: '',
      acao3: '',
      observacoes: ''
    });
    setEditingPlan(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (plan: ActionPlan) => {
    setEditingPlan(plan);
    setSetorSelecionado(plan.setorId);
    setFormData({
      indicador: plan.indicador,
      metaAtual: plan.metaAtual,
      metaDesejada: plan.metaDesejada,
      prazo: plan.prazo,
      responsavel: plan.responsavel,
      acao1: plan.acoes[0] || '',
      acao2: plan.acoes[1] || '',
      acao3: plan.acoes[2] || '',
      observacoes: plan.observacoes
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este plano de ação?')) {
      const updatedPlans = planos.filter(p => p.id !== id);
      savePlans(updatedPlans);
      toast.success('Plano de ação excluído');
    }
  };

  const handleStatusChange = (id: string, newStatus: ActionPlan['status']) => {
    const updatedPlans = planos.map(p => 
      p.id === id ? { ...p, status: newStatus } : p
    );
    savePlans(updatedPlans);
    toast.success('Status atualizado');
  };

  // Filtrar planos baseado no setor do usuário
  const planosVisiveis = isAdmin 
    ? planos 
    : planos.filter(p => p.setorId === user?.setorId);

  const getStatusBadge = (status: ActionPlan['status']) => {
    switch (status) {
      case 'pendente':
        return <Badge className="bg-gray-500">Pendente</Badge>;
      case 'em-andamento':
        return <Badge className="bg-blue-600">Em Andamento</Badge>;
      case 'concluido':
        return <Badge className="bg-green-600">Concluído</Badge>;
      case 'atrasado':
        return <Badge className="bg-red-600">Atrasado</Badge>;
      default:
        return <Badge>Indefinido</Badge>;
    }
  };

  const getStatusColor = (status: ActionPlan['status']) => {
    switch (status) {
      case 'pendente':
        return 'border-gray-400';
      case 'em-andamento':
        return 'border-blue-500';
      case 'concluido':
        return 'border-green-500';
      case 'atrasado':
        return 'border-red-500';
      default:
        return 'border-gray-300';
    }
  };

  // Verificar se plano está atrasado
  const checkIfOverdue = (prazo: string, status: ActionPlan['status']) => {
    if (status === 'concluido') return false;
    const today = new Date();
    const deadline = new Date(prazo);
    return deadline < today;
  };

  // Atualizar status automaticamente se estiver atrasado
  useEffect(() => {
    const updatedPlans = planos.map(p => {
      if (checkIfOverdue(p.prazo, p.status) && p.status !== 'concluido') {
        return { ...p, status: 'atrasado' as const };
      }
      return p;
    });
    if (JSON.stringify(updatedPlans) !== JSON.stringify(planos)) {
      savePlans(updatedPlans);
    }
  }, [planos]);

  // Estatísticas
  const totalPlanos = planosVisiveis.length;
  const pendentes = planosVisiveis.filter(p => p.status === 'pendente').length;
  const emAndamento = planosVisiveis.filter(p => p.status === 'em-andamento').length;
  const concluidos = planosVisiveis.filter(p => p.status === 'concluido').length;
  const atrasados = planosVisiveis.filter(p => p.status === 'atrasado').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0a2b3e]">Plano de Ação</h2>
          <p className="text-gray-600 mt-1">Gerencie planos de ação para melhoria dos indicadores</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button 
              onClick={() => {
                setEditingPlan(null);
                setFormData({
                  indicador: '',
                  metaAtual: '',
                  metaDesejada: '',
                  prazo: '',
                  responsavel: '',
                  acao1: '',
                  acao2: '',
                  acao3: '',
                  observacoes: ''
                });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#1e6a8f] text-white rounded-lg hover:bg-[#0a2b3e] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Plano
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#0a2b3e]">
                {editingPlan ? 'Editar Plano de Ação' : 'Novo Plano de Ação'}
              </DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para criar ou editar um plano de ação.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Setor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Setor</label>
                <select
                  value={setorSelecionado}
                  onChange={(e) => setSetorSelecionado(e.target.value)}
                  disabled={!isAdmin}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e6a8f] disabled:bg-gray-100"
                >
                  <option value="">Selecione um setor</option>
                  {availableSetores.map(setor => (
                    <option key={setor.id} value={setor.id}>{setor.nome}</option>
                  ))}
                </select>
              </div>

              {/* Indicador */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Indicador</label>
                <input
                  type="text"
                  value={formData.indicador}
                  onChange={(e) => setFormData({...formData, indicador: e.target.value})}
                  placeholder="Ex: Taxa de Ocupação"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                />
              </div>

              {/* Meta Atual e Desejada */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Atual</label>
                  <input
                    type="text"
                    value={formData.metaAtual}
                    onChange={(e) => setFormData({...formData, metaAtual: e.target.value})}
                    placeholder="Ex: 65%"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Desejada</label>
                  <input
                    type="text"
                    value={formData.metaDesejada}
                    onChange={(e) => setFormData({...formData, metaDesejada: e.target.value})}
                    placeholder="Ex: 80%"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                  />
                </div>
              </div>

              {/* Prazo e Responsável */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prazo</label>
                  <input
                    type="date"
                    value={formData.prazo}
                    onChange={(e) => setFormData({...formData, prazo: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                  <input
                    type="text"
                    value={formData.responsavel}
                    onChange={(e) => setFormData({...formData, responsavel: e.target.value})}
                    placeholder="Nome do responsável"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                  />
                </div>
              </div>

              {/* Ações */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ações a serem realizadas</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.acao1}
                    onChange={(e) => setFormData({...formData, acao1: e.target.value})}
                    placeholder="Ação 1"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                  />
                  <input
                    type="text"
                    value={formData.acao2}
                    onChange={(e) => setFormData({...formData, acao2: e.target.value})}
                    placeholder="Ação 2 (opcional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                  />
                  <input
                    type="text"
                    value={formData.acao3}
                    onChange={(e) => setFormData({...formData, acao3: e.target.value})}
                    placeholder="Ação 3 (opcional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                  />
                </div>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                  placeholder="Observações adicionais..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                />
              </div>

              {/* Botões */}
              <div className="flex gap-2 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1e6a8f] text-white rounded-lg hover:bg-[#0a2b3e]"
                >
                  {editingPlan ? 'Atualizar' : 'Criar'} Plano
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-[#1e6a8f]">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total de Planos</p>
              <p className="text-3xl font-bold text-[#0a2b3e] mt-2">{totalPlanos}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-400 bg-gray-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-700 font-medium">Pendentes</p>
              <p className="text-3xl font-bold text-gray-700 mt-2">{pendentes}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-blue-700 font-medium">Em Andamento</p>
              <p className="text-3xl font-bold text-blue-700 mt-2">{emAndamento}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-green-700 font-medium">Concluídos</p>
              <p className="text-3xl font-bold text-green-700 mt-2">{concluidos}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-red-700 font-medium">Atrasados</p>
              <p className="text-3xl font-bold text-red-700 mt-2">{atrasados}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Planos */}
      {planosVisiveis.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Nenhum plano de ação cadastrado</p>
              <p className="text-sm text-gray-500 mt-1">Clique em "Novo Plano" para começar</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {planosVisiveis.map((plano) => (
            <Card key={plano.id} className={`border-l-4 ${getStatusColor(plano.status)}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{plano.setorNome}</Badge>
                      {getStatusBadge(plano.status)}
                    </div>
                    <CardTitle className="text-lg text-[#0a2b3e]">{plano.indicador}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(plano)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(plano.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Metas */}
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-600">Meta Atual</p>
                    <p className="text-lg font-bold text-gray-900">{plano.metaAtual}</p>
                  </div>
                  <TrendingUp className="w-6 h-6 text-[#1e6a8f]" />
                  <div>
                    <p className="text-xs text-gray-600">Meta Desejada</p>
                    <p className="text-lg font-bold text-green-600">{plano.metaDesejada}</p>
                  </div>
                </div>

                {/* Prazo e Responsável */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-600">Prazo</p>
                      <p className="font-medium">{new Date(plano.prazo).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-600">Responsável</p>
                      <p className="font-medium">{plano.responsavel}</p>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Ações:</p>
                  <ul className="space-y-1">
                    {plano.acoes.map((acao, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-[#1e6a8f] font-bold">{index + 1}.</span>
                        {acao}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Observações */}
                {plano.observacoes && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Observações:</p>
                    <p className="text-sm text-gray-700">{plano.observacoes}</p>
                  </div>
                )}

                {/* Alterar Status */}
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600 mb-2">Alterar Status:</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(plano.id, 'pendente')}
                      className={`flex-1 px-3 py-1.5 text-xs rounded-lg transition-colors ${
                        plano.status === 'pendente' 
                          ? 'bg-gray-500 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Pendente
                    </button>
                    <button
                      onClick={() => handleStatusChange(plano.id, 'em-andamento')}
                      className={`flex-1 px-3 py-1.5 text-xs rounded-lg transition-colors ${
                        plano.status === 'em-andamento' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      Em Andamento
                    </button>
                    <button
                      onClick={() => handleStatusChange(plano.id, 'concluido')}
                      className={`flex-1 px-3 py-1.5 text-xs rounded-lg transition-colors ${
                        plano.status === 'concluido' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      Concluído
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Alerta de Planos Atrasados */}
      {atrasados > 0 && (
        <Card className="border-red-500 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-800 font-semibold mb-2">Atenção: Planos Atrasados</h3>
                <p className="text-red-700 text-sm">
                  Você tem {atrasados} plano(s) de ação atrasado(s). Atualize o status ou revise os prazos para manter o acompanhamento em dia.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}