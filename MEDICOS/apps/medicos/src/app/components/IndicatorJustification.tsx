import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { 
  Plus, AlertTriangle, FileText, Calendar, Eye, Edit, Trash2, 
  CheckCircle, XCircle, Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface Justification {
  id: string;
  setorId: string;
  setorNome: string;
  indicador: string;
  metaEsperada: string;
  resultadoObtido: string;
  periodo: string;
  justificativa: string;
  acaoCorretiva: string;
  responsavel: string;
  dataEnvio: string;
  status: 'pendente-analise' | 'aprovada' | 'rejeitada';
  observacaoAdmin?: string;
}

export default function IndicatorJustification() {
  const { user, data } = useAuth();
  const [justificativas, setJustificativas] = useState<Justification[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewingJustification, setViewingJustification] = useState<Justification | null>(null);
  const [editingJustification, setEditingJustification] = useState<Justification | null>(null);
  const [setorSelecionado, setSetorSelecionado] = useState('');
  
  const isAdmin = user?.role === 'admin';
  
  // Filtrar setores baseado no role do usuário
  const availableSetores = isAdmin 
    ? data.setores 
    : data.setores.filter(s => s.id === user?.setorId);

  // Estados do formulário
  const [formData, setFormData] = useState({
    indicador: '',
    metaEsperada: '',
    resultadoObtido: '',
    periodo: '',
    justificativa: '',
    acaoCorretiva: '',
    responsavel: user?.name || ''
  });

  useEffect(() => {
    // Carregar justificativas do localStorage
    const savedJustifications = localStorage.getItem('justifications');
    if (savedJustifications) {
      setJustificativas(JSON.parse(savedJustifications));
    }

    // Se for usuário comum, setar automaticamente seu setor
    if (!isAdmin && user?.setorId) {
      setSetorSelecionado(user.setorId);
    }
  }, [user, isAdmin]);

  const saveJustifications = (updatedJustifications: Justification[]) => {
    localStorage.setItem('justifications', JSON.stringify(updatedJustifications));
    setJustificativas(updatedJustifications);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!setorSelecionado) {
      toast.error('Selecione um setor');
      return;
    }

    const setor = data.setores.find(s => s.id === setorSelecionado);
    if (!setor) return;

    if (editingJustification) {
      // Editar justificativa existente (apenas se pendente)
      if (editingJustification.status !== 'pendente-analise') {
        toast.error('Não é possível editar justificativa já analisada');
        return;
      }

      const updatedJustifications = justificativas.map(j => 
        j.id === editingJustification.id 
          ? {
              ...j,
              indicador: formData.indicador,
              metaEsperada: formData.metaEsperada,
              resultadoObtido: formData.resultadoObtido,
              periodo: formData.periodo,
              justificativa: formData.justificativa,
              acaoCorretiva: formData.acaoCorretiva,
              responsavel: formData.responsavel
            }
          : j
      );
      saveJustifications(updatedJustifications);
      toast.success('Justificativa atualizada com sucesso!');
    } else {
      // Criar nova justificativa
      const newJustification: Justification = {
        id: Date.now().toString(),
        setorId: setorSelecionado,
        setorNome: setor.nome,
        indicador: formData.indicador,
        metaEsperada: formData.metaEsperada,
        resultadoObtido: formData.resultadoObtido,
        periodo: formData.periodo,
        justificativa: formData.justificativa,
        acaoCorretiva: formData.acaoCorretiva,
        responsavel: formData.responsavel,
        dataEnvio: new Date().toISOString().split('T')[0],
        status: 'pendente-analise'
      };

      saveJustifications([...justificativas, newJustification]);
      toast.success('Justificativa enviada com sucesso!');
    }

    // Resetar formulário
    setFormData({
      indicador: '',
      metaEsperada: '',
      resultadoObtido: '',
      periodo: '',
      justificativa: '',
      acaoCorretiva: '',
      responsavel: user?.name || ''
    });
    setEditingJustification(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (justification: Justification) => {
    if (justification.status !== 'pendente-analise') {
      toast.error('Não é possível editar justificativa já analisada');
      return;
    }
    setEditingJustification(justification);
    setSetorSelecionado(justification.setorId);
    setFormData({
      indicador: justification.indicador,
      metaEsperada: justification.metaEsperada,
      resultadoObtido: justification.resultadoObtido,
      periodo: justification.periodo,
      justificativa: justification.justificativa,
      acaoCorretiva: justification.acaoCorretiva,
      responsavel: justification.responsavel
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const justification = justificativas.find(j => j.id === id);
    if (justification?.status !== 'pendente-analise' && !isAdmin) {
      toast.error('Apenas administradores podem excluir justificativas analisadas');
      return;
    }

    if (confirm('Tem certeza que deseja excluir esta justificativa?')) {
      const updatedJustifications = justificativas.filter(j => j.id !== id);
      saveJustifications(updatedJustifications);
      toast.success('Justificativa excluída');
    }
  };

  const handleStatusChange = (id: string, newStatus: Justification['status'], observacao?: string) => {
    if (!isAdmin) {
      toast.error('Apenas administradores podem alterar o status');
      return;
    }

    const updatedJustifications = justificativas.map(j => 
      j.id === id 
        ? { ...j, status: newStatus, observacaoAdmin: observacao } 
        : j
    );
    saveJustifications(updatedJustifications);
    toast.success('Status atualizado');
  };

  // Filtrar justificativas baseado no setor do usuário
  const justificativasVisiveis = isAdmin 
    ? justificativas 
    : justificativas.filter(j => j.setorId === user?.setorId);

  const getStatusBadge = (status: Justification['status']) => {
    switch (status) {
      case 'pendente-analise':
        return <Badge className="bg-amber-500">Pendente Análise</Badge>;
      case 'aprovada':
        return <Badge className="bg-green-600">Aprovada</Badge>;
      case 'rejeitada':
        return <Badge className="bg-red-600">Rejeitada</Badge>;
      default:
        return <Badge>Indefinido</Badge>;
    }
  };

  const getStatusColor = (status: Justification['status']) => {
    switch (status) {
      case 'pendente-analise':
        return 'border-amber-500';
      case 'aprovada':
        return 'border-green-500';
      case 'rejeitada':
        return 'border-red-500';
      default:
        return 'border-gray-300';
    }
  };

  // Estatísticas
  const totalJustificativas = justificativasVisiveis.length;
  const pendentes = justificativasVisiveis.filter(j => j.status === 'pendente-analise').length;
  const aprovadas = justificativasVisiveis.filter(j => j.status === 'aprovada').length;
  const rejeitadas = justificativasVisiveis.filter(j => j.status === 'rejeitada').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0a2b3e]">Justificativa de Indicadores</h2>
          <p className="text-gray-600 mt-1">Justifique metas não atingidas e proponha ações corretivas</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button 
              onClick={() => {
                setEditingJustification(null);
                setFormData({
                  indicador: '',
                  metaEsperada: '',
                  resultadoObtido: '',
                  periodo: '',
                  justificativa: '',
                  acaoCorretiva: '',
                  responsavel: user?.name || ''
                });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#1e6a8f] text-white rounded-lg hover:bg-[#0a2b3e] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nova Justificativa
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#0a2b3e]">
                {editingJustification ? 'Editar Justificativa' : 'Nova Justificativa'}
              </DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para {editingJustification ? 'editar' : 'criar'} uma justificativa de indicador.
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

              {/* Meta Esperada e Resultado Obtido */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Esperada</label>
                  <input
                    type="text"
                    value={formData.metaEsperada}
                    onChange={(e) => setFormData({...formData, metaEsperada: e.target.value})}
                    placeholder="Ex: 80%"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resultado Obtido</label>
                  <input
                    type="text"
                    value={formData.resultadoObtido}
                    onChange={(e) => setFormData({...formData, resultadoObtido: e.target.value})}
                    placeholder="Ex: 65%"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                  />
                </div>
              </div>

              {/* Período e Responsável */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                  <input
                    type="month"
                    value={formData.periodo}
                    onChange={(e) => setFormData({...formData, periodo: e.target.value})}
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

              {/* Justificativa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Justificativa <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.justificativa}
                  onChange={(e) => setFormData({...formData, justificativa: e.target.value})}
                  placeholder="Descreva os motivos pelos quais a meta não foi atingida..."
                  rows={4}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                />
              </div>

              {/* Ação Corretiva */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ação Corretiva Proposta <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.acaoCorretiva}
                  onChange={(e) => setFormData({...formData, acaoCorretiva: e.target.value})}
                  placeholder="Descreva as ações que serão tomadas para melhorar o indicador..."
                  rows={4}
                  required
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
                  {editingJustification ? 'Atualizar' : 'Enviar'} Justificativa
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#1e6a8f]">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total de Justificativas</p>
              <p className="text-3xl font-bold text-[#0a2b3e] mt-2">{totalJustificativas}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-500 bg-amber-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-amber-700 font-medium">Pendente Análise</p>
              <p className="text-3xl font-bold text-amber-700 mt-2">{pendentes}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-green-700 font-medium">Aprovadas</p>
              <p className="text-3xl font-bold text-green-700 mt-2">{aprovadas}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-red-700 font-medium">Rejeitadas</p>
              <p className="text-3xl font-bold text-red-700 mt-2">{rejeitadas}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Justificativas */}
      {justificativasVisiveis.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Nenhuma justificativa cadastrada</p>
              <p className="text-sm text-gray-500 mt-1">Clique em "Nova Justificativa" para começar</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {justificativasVisiveis.map((just) => (
            <Card key={just.id} className={`border-l-4 ${getStatusColor(just.status)}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{just.setorNome}</Badge>
                      {getStatusBadge(just.status)}
                    </div>
                    <CardTitle className="text-lg text-[#0a2b3e]">{just.indicador}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Período: {new Date(just.periodo + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setViewingJustification(just)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Visualizar"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    {just.status === 'pendente-analise' && (
                      <button
                        onClick={() => handleEdit(just)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(just.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Comparativo Meta vs Resultado */}
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-600">Meta Esperada</p>
                    <p className="text-lg font-bold text-gray-900">{just.metaEsperada}</p>
                  </div>
                  <XCircle className="w-6 h-6 text-red-500" />
                  <div>
                    <p className="text-xs text-gray-600">Resultado Obtido</p>
                    <p className="text-lg font-bold text-red-600">{just.resultadoObtido}</p>
                  </div>
                </div>

                {/* Resumo da Justificativa */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Justificativa:</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{just.justificativa}</p>
                </div>

                {/* Ação Corretiva */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">Ação Corretiva:</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{just.acaoCorretiva}</p>
                </div>

                {/* Observação do Admin (se houver) */}
                {just.observacaoAdmin && (
                  <div className="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-500">
                    <p className="text-sm font-medium text-purple-800 mb-1">Observação do Administrador:</p>
                    <p className="text-sm text-purple-700">{just.observacaoAdmin}</p>
                  </div>
                )}

                {/* Info e Ações Admin */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>Responsável: {just.responsavel}</span>
                    <span>Enviado em: {new Date(just.dataEnvio).toLocaleDateString('pt-BR')}</span>
                  </div>

                  {/* Botões de Aprovação/Rejeição (apenas admin e se pendente) */}
                  {isAdmin && just.status === 'pendente-analise' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const obs = prompt('Observação (opcional):');
                          handleStatusChange(just.id, 'aprovada', obs || undefined);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Aprovar
                      </button>
                      <button
                        onClick={() => {
                          const obs = prompt('Motivo da rejeição (obrigatório):');
                          if (obs && obs.trim()) {
                            handleStatusChange(just.id, 'rejeitada', obs);
                          } else {
                            toast.error('É necessário informar o motivo da rejeição');
                          }
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="w-3 h-3" />
                        Rejeitar
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Visualização Completa */}
      <Dialog open={!!viewingJustification} onOpenChange={() => setViewingJustification(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#0a2b3e]">Detalhes da Justificativa</DialogTitle>
          </DialogHeader>
          {viewingJustification && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Setor</p>
                  <p className="text-gray-900">{viewingJustification.setorNome}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  {getStatusBadge(viewingJustification.status)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Indicador</p>
                  <p className="text-gray-900">{viewingJustification.indicador}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Período</p>
                  <p className="text-gray-900">
                    {new Date(viewingJustification.periodo + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Meta Esperada</p>
                  <p className="text-gray-900 font-bold">{viewingJustification.metaEsperada}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Resultado Obtido</p>
                  <p className="text-red-600 font-bold">{viewingJustification.resultadoObtido}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Responsável</p>
                  <p className="text-gray-900">{viewingJustification.responsavel}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Data de Envio</p>
                  <p className="text-gray-900">{new Date(viewingJustification.dataEnvio).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Justificativa</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">{viewingJustification.justificativa}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Ação Corretiva Proposta</p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">{viewingJustification.acaoCorretiva}</p>
                </div>
              </div>

              {viewingJustification.observacaoAdmin && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Observação do Administrador</p>
                  <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                    <p className="text-purple-900 whitespace-pre-wrap">{viewingJustification.observacaoAdmin}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Alerta de Pendências (Admin) */}
      {isAdmin && pendentes > 0 && (
        <Card className="border-amber-500 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-amber-800 font-semibold mb-2">Atenção: Justificativas Pendentes</h3>
                <p className="text-amber-700 text-sm">
                  Você tem {pendentes} justificativa(s) aguardando análise. Revise e aprove/rejeite para manter o fluxo de gestão em dia.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}