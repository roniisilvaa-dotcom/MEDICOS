import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ClipboardCheck, Plus, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { PlanoAcao } from '../types';

const PlanosAcao: React.FC = () => {
  const { data, updateData } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlano, setEditingPlano] = useState<PlanoAcao | null>(null);
  
  const [newPlano, setNewPlano] = useState({
    setorId: '',
    incidenteId: '',
    problema: '',
    analiseCritica: '',
    acaoImediata: '',
    acaoSistemica: '',
    responsavel: '',
    prazo: '',
    status: 'pendente' as 'pendente' | 'em-andamento' | 'concluido',
    verificacaoEficacia: '',
    dataVerificacao: ''
  });

  const handleAddPlano = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPlano.setorId || !newPlano.problema || !newPlano.responsavel) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const plano: PlanoAcao = {
      id: Date.now().toString(),
      data: new Date().toISOString().split('T')[0],
      ...newPlano,
      incidenteId: newPlano.incidenteId || undefined,
      verificacaoEficacia: newPlano.verificacaoEficacia || undefined,
      dataVerificacao: newPlano.dataVerificacao || undefined
    };

    updateData({
      planosAcao: [...data.planosAcao, plano]
    });

    toast.success('Plano de ação criado com sucesso!');
    resetForm();
  };

  const handleUpdatePlano = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingPlano) return;

    const planoAtualizado: PlanoAcao = {
      ...editingPlano,
      ...newPlano,
      incidenteId: newPlano.incidenteId || undefined,
      verificacaoEficacia: newPlano.verificacaoEficacia || undefined,
      dataVerificacao: newPlano.dataVerificacao || undefined
    };

    updateData({
      planosAcao: data.planosAcao.map(p => p.id === editingPlano.id ? planoAtualizado : p)
    });

    toast.success('Plano de ação atualizado com sucesso!');
    resetForm();
  };

  const handleEditPlano = (plano: PlanoAcao) => {
    setEditingPlano(plano);
    setNewPlano({
      setorId: plano.setorId,
      incidenteId: plano.incidenteId || '',
      problema: plano.problema,
      analiseCritica: plano.analiseCritica,
      acaoImediata: plano.acaoImediata,
      acaoSistemica: plano.acaoSistemica,
      responsavel: plano.responsavel,
      prazo: plano.prazo,
      status: plano.status,
      verificacaoEficacia: plano.verificacaoEficacia || '',
      dataVerificacao: plano.dataVerificacao || ''
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setNewPlano({
      setorId: '',
      incidenteId: '',
      problema: '',
      analiseCritica: '',
      acaoImediata: '',
      acaoSistemica: '',
      responsavel: '',
      prazo: '',
      status: 'pendente',
      verificacaoEficacia: '',
      dataVerificacao: ''
    });
    setShowAddForm(false);
    setEditingPlano(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'em-andamento':
        return 'bg-blue-100 text-blue-800';
      case 'concluido':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente':
        return <AlertTriangle className="w-4 h-4" />;
      case 'em-andamento':
        return <Clock className="w-4 h-4" />;
      case 'concluido':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const isPrazoVencido = (prazo: string, status: string) => {
    if (status === 'concluido') return false;
    const hoje = new Date();
    const dataPrazo = new Date(prazo);
    return dataPrazo < hoje;
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2" style={{ color: '#0a2b3e' }}>Planos de Ação</h1>
          <p className="text-gray-600">Gestão de ações corretivas e preventivas</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all hover:shadow-lg"
          style={{ backgroundColor: '#1e6a8f' }}
        >
          <Plus className="w-5 h-5" />
          Novo Plano de Ação
        </button>
      </div>

      {/* Card Informativo */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3">
          <ClipboardCheck className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-green-900 font-semibold mb-2">Metodologia do Guia Prático de Análise Crítica</h3>
            <div className="text-green-800 text-sm space-y-2">
              <p>
                <strong>1. Definição do Problema:</strong> Identifique claramente o desvio encontrado no Dashboard
              </p>
              <p>
                <strong>2. Análise Crítica:</strong> Reunião com líderes para entender as causas
              </p>
              <p>
                <strong>3. Ação Imediata:</strong> Solução rápida para conter o problema
              </p>
              <p>
                <strong>4. Ação Sistêmica:</strong> Mudança estrutural para evitar recorrência
              </p>
              <p>
                <strong>5. Verificação de Eficácia:</strong> Acompanhar no próximo mês se o indicador melhorou
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário de Adicionar/Editar Plano */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
          <h2 className="text-xl mb-4" style={{ color: '#0a2b3e' }}>
            {editingPlano ? 'Editar Plano de Ação' : 'Novo Plano de Ação'}
          </h2>
          <form onSubmit={editingPlano ? handleUpdatePlano : handleAddPlano} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700">Setor *</label>
                <select
                  value={newPlano.setorId}
                  onChange={(e) => setNewPlano({ ...newPlano, setorId: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                  required
                >
                  <option value="">Selecione um setor</option>
                  {data.setores.map(setor => (
                    <option key={setor.id} value={setor.id}>{setor.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">Incidente Relacionado (Opcional)</label>
                <select
                  value={newPlano.incidenteId}
                  onChange={(e) => setNewPlano({ ...newPlano, incidenteId: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                >
                  <option value="">Nenhum</option>
                  {data.incidentes
                    .filter(inc => inc.setorId === newPlano.setorId || !newPlano.setorId)
                    .map(incidente => (
                      <option key={incidente.id} value={incidente.id}>
                        {incidente.tipo} - {new Date(incidente.data).toLocaleDateString('pt-BR')}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">Responsável *</label>
                <input
                  type="text"
                  value={newPlano.responsavel}
                  onChange={(e) => setNewPlano({ ...newPlano, responsavel: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                  placeholder="Nome do responsável"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">Prazo *</label>
                <input
                  type="date"
                  value={newPlano.prazo}
                  onChange={(e) => setNewPlano({ ...newPlano, prazo: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">Status</label>
                <select
                  value={newPlano.status}
                  onChange={(e) => setNewPlano({ ...newPlano, status: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                >
                  <option value="pendente">Pendente</option>
                  <option value="em-andamento">Em Andamento</option>
                  <option value="concluido">Concluído</option>
                </select>
              </div>

              {newPlano.status === 'concluido' && (
                <div>
                  <label className="block text-sm mb-2 text-gray-700">Data de Verificação</label>
                  <input
                    type="date"
                    value={newPlano.dataVerificacao}
                    onChange={(e) => setNewPlano({ ...newPlano, dataVerificacao: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">1. Definição do Problema *</label>
              <textarea
                value={newPlano.problema}
                onChange={(e) => setNewPlano({ ...newPlano, problema: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                rows={2}
                placeholder='Ex: "A taxa de quedas na Enfermaria subiu 12% em relação a Fevereiro"'
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">2. Análise Crítica *</label>
              <textarea
                value={newPlano.analiseCritica}
                onChange={(e) => setNewPlano({ ...newPlano, analiseCritica: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                rows={2}
                placeholder='Ex: "Reunião identificou novos funcionários sem treinamento adequado"'
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">3. Ação Imediata *</label>
              <textarea
                value={newPlano.acaoImediata}
                onChange={(e) => setNewPlano({ ...newPlano, acaoImediata: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                rows={2}
                placeholder='Ex: "Treinamento de beira de leito para equipe noturna"'
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">4. Ação Sistêmica *</label>
              <textarea
                value={newPlano.acaoSistemica}
                onChange={(e) => setNewPlano({ ...newPlano, acaoSistemica: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                rows={2}
                placeholder='Ex: "Revisão do protocolo de classificação de risco de queda na admissão"'
                required
              />
            </div>

            {newPlano.status === 'concluido' && (
              <div>
                <label className="block text-sm mb-2 text-gray-700">5. Verificação de Eficácia</label>
                <textarea
                  value={newPlano.verificacaoEficacia}
                  onChange={(e) => setNewPlano({ ...newPlano, verificacaoEficacia: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                  rows={2}
                  placeholder='Ex: "Gráfico de Evolução Mensal mostra retorno à média esperada"'
                />
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-white transition-all hover:shadow-lg"
                style={{ backgroundColor: '#1e6a8f' }}
              >
                {editingPlano ? 'Atualizar' : 'Salvar'} Plano
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Planos de Ação */}
      <div className="space-y-4">
        {(!data.planosAcao || data.planosAcao.length === 0) ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
            <ClipboardCheck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Nenhum plano de ação criado</p>
          </div>
        ) : (
          data.planosAcao.map((plano) => {
            const setor = data.setores.find(s => s.id === plano.setorId);
            const vencido = isPrazoVencido(plano.prazo, plano.status);
            
            return (
              <div 
                key={plano.id} 
                className={`bg-white rounded-lg shadow-md border p-6 transition-all hover:shadow-lg ${
                  vencido ? 'border-red-300' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{setor?.nome}</h3>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(plano.status)}`}>
                        {getStatusIcon(plano.status)}
                        {plano.status === 'pendente' && 'Pendente'}
                        {plano.status === 'em-andamento' && 'Em Andamento'}
                        {plano.status === 'concluido' && 'Concluído'}
                      </span>
                      {vencido && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertTriangle className="w-3 h-3" />
                          Vencido
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Criado em: {new Date(plano.data).toLocaleDateString('pt-BR')} | 
                      Responsável: <span className="font-medium">{plano.responsavel}</span> | 
                      Prazo: <span className={vencido ? 'text-red-600 font-medium' : 'font-medium'}>{new Date(plano.prazo).toLocaleDateString('pt-BR')}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleEditPlano(plano)}
                    className="px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all text-sm font-medium"
                  >
                    Editar
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">📋 Problema:</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 rounded p-2">{plano.problema}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">🔍 Análise Crítica:</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 rounded p-2">{plano.analiseCritica}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">⚡ Ação Imediata:</h4>
                      <p className="text-sm text-gray-600 bg-yellow-50 rounded p-2">{plano.acaoImediata}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">🔧 Ação Sistêmica:</h4>
                      <p className="text-sm text-gray-600 bg-blue-50 rounded p-2">{plano.acaoSistemica}</p>
                    </div>
                  </div>

                  {plano.verificacaoEficacia && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">✅ Verificação de Eficácia:</h4>
                      <p className="text-sm text-gray-600 bg-green-50 rounded p-2">
                        {plano.verificacaoEficacia}
                        {plano.dataVerificacao && ` (Verificado em: ${new Date(plano.dataVerificacao).toLocaleDateString('pt-BR')})`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PlanosAcao;