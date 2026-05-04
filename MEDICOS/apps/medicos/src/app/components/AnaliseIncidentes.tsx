import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, CheckCircle, AlertCircle, Activity, FileText, Plus, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Incidente, AnaliseIshikawa } from '../types';

const AnaliseIncidentes: React.FC = () => {
  const { data, updateData } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showIshikawa, setShowIshikawa] = useState(false);
  const [selectedIncidente, setSelectedIncidente] = useState<Incidente | null>(null);
  
  const [newIncidente, setNewIncidente] = useState({
    setorId: '',
    data: new Date().toISOString().split('T')[0],
    tipo: '',
    descricao: '',
    quantidade: 1,
    atendimentos: 0,
    gravidade: 'leve' as 'near-miss' | 'leve' | 'moderado' | 'grave',
    status: 'aberto' as 'aberto' | 'em-analise' | 'resolvido'
  });

  const [ishikawa, setIshikawa] = useState({
    paciente: [''],
    tarefa: [''],
    individuo: [''],
    equipe: [''],
    ambiente: [''],
    organizacao: ['']
  });

  const getGravidadeColor = (gravidade: string) => {
    switch (gravidade) {
      case 'near-miss':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'leve':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'moderado':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'grave':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getGravidadeLabel = (gravidade: string) => {
    switch (gravidade) {
      case 'near-miss':
        return 'Near Miss';
      case 'leve':
        return 'Dano Leve';
      case 'moderado':
        return 'Dano Moderado';
      case 'grave':
        return 'Dano Grave';
      default:
        return gravidade;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto':
        return 'bg-red-100 text-red-800';
      case 'em-analise':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolvido':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddIncidente = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newIncidente.setorId || !newIncidente.tipo || !newIncidente.descricao) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const incidente: Incidente = {
      id: Date.now().toString(),
      ...newIncidente
    };

    updateData({
      incidentes: [...(data.incidentes || []), incidente]
    });

    toast.success('Incidente registrado com sucesso!');
    
    setNewIncidente({
      setorId: '',
      data: new Date().toISOString().split('T')[0],
      tipo: '',
      descricao: '',
      quantidade: 1,
      atendimentos: 0,
      gravidade: 'leve',
      status: 'aberto'
    });
    setShowAddForm(false);
  };

  const handleSaveIshikawa = () => {
    if (!selectedIncidente) return;

    // Filtrar fatores vazios
    const fatoresLimpos = {
      paciente: ishikawa.paciente.filter(f => f.trim() !== ''),
      tarefa: ishikawa.tarefa.filter(f => f.trim() !== ''),
      individuo: ishikawa.individuo.filter(f => f.trim() !== ''),
      equipe: ishikawa.equipe.filter(f => f.trim() !== ''),
      ambiente: ishikawa.ambiente.filter(f => f.trim() !== ''),
      organizacao: ishikawa.organizacao.filter(f => f.trim() !== '')
    };

    const analise: AnaliseIshikawa = {
      id: Date.now().toString(),
      incidenteId: selectedIncidente.id,
      setorId: selectedIncidente.setorId,
      data: new Date().toISOString().split('T')[0],
      fatores: fatoresLimpos
    };

    // Atualizar status do incidente para "em-analise"
    const incidentesAtualizados = data.incidentes.map(inc =>
      inc.id === selectedIncidente.id ? { ...inc, status: 'em-analise' as const } : inc
    );

    updateData({
      incidentes: incidentesAtualizados,
      analises: [...data.analises, analise]
    });

    toast.success('Análise de Causa Raiz salva com sucesso!');
    setShowIshikawa(false);
    setSelectedIncidente(null);
    setIshikawa({
      paciente: [''],
      tarefa: [''],
      individuo: [''],
      equipe: [''],
      ambiente: [''],
      organizacao: ['']
    });
  };

  const addFatorField = (categoria: keyof typeof ishikawa) => {
    setIshikawa({
      ...ishikawa,
      [categoria]: [...ishikawa[categoria], '']
    });
  };

  const updateFator = (categoria: keyof typeof ishikawa, index: number, value: string) => {
    const newFatores = [...ishikawa[categoria]];
    newFatores[index] = value;
    setIshikawa({
      ...ishikawa,
      [categoria]: newFatores
    });
  };

  const removeFatorField = (categoria: keyof typeof ishikawa, index: number) => {
    const newFatores = ishikawa[categoria].filter((_, i) => i !== index);
    setIshikawa({
      ...ishikawa,
      [categoria]: newFatores.length > 0 ? newFatores : ['']
    });
  };

  const tiposIncidente = [
    'Queda de Paciente',
    'Erro de Medicação',
    'Lesão por Pressão',
    'Infecção Hospitalar',
    'Atraso no Atendimento',
    'Falha de Comunicação',
    'Perda de Equipamento',
    'Identificação Incorreta',
    'Outro'
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2" style={{ color: '#0a2b3e' }}>Análise de Incidentes</h1>
          <p className="text-gray-600">Registro e análise de causa raiz (Metodologia Ishikawa)</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all hover:shadow-lg"
          style={{ backgroundColor: '#1e6a8f' }}
        >
          <Plus className="w-5 h-5" />
          Registrar Incidente
        </button>
      </div>

      {/* Card Informativo */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3">
          <Activity className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-blue-900 font-semibold mb-2">Metodologia de Análise</h3>
            <p className="text-blue-800 text-sm mb-3">
              De acordo com o Manual de Análise de Incidente, o processo não serve para punir, mas para aprender.
            </p>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• <strong>Near Miss:</strong> Quase erro - não gerou dano</li>
              <li>• <strong>Dano Leve:</strong> Recuperação rápida, sem intervenção complexa</li>
              <li>• <strong>Dano Moderado:</strong> Requer intervenção médica adicional</li>
              <li>• <strong>Dano Grave:</strong> Lesão permanente ou risco à vida</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Formulário de Adicionar Incidente */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
          <h2 className="text-xl mb-4" style={{ color: '#0a2b3e' }}>Novo Incidente</h2>
          <form onSubmit={handleAddIncidente} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700">Setor *</label>
                <select
                  value={newIncidente.setorId}
                  onChange={(e) => setNewIncidente({ ...newIncidente, setorId: e.target.value })}
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
                <label className="block text-sm mb-2 text-gray-700">Data do Incidente *</label>
                <input
                  type="date"
                  value={newIncidente.data}
                  onChange={(e) => setNewIncidente({ ...newIncidente, data: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">Tipo de Incidente *</label>
                <select
                  value={newIncidente.tipo}
                  onChange={(e) => setNewIncidente({ ...newIncidente, tipo: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                  required
                >
                  <option value="">Selecione o tipo</option>
                  {tiposIncidente.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">Gravidade *</label>
                <select
                  value={newIncidente.gravidade}
                  onChange={(e) => setNewIncidente({ ...newIncidente, gravidade: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                  required
                >
                  <option value="near-miss">Near Miss (Quase Erro)</option>
                  <option value="leve">Dano Leve</option>
                  <option value="moderado">Dano Moderado</option>
                  <option value="grave">Dano Grave</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">Quantidade</label>
                <input
                  type="number"
                  min="1"
                  value={newIncidente.quantidade}
                  onChange={(e) => setNewIncidente({ ...newIncidente, quantidade: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">Atendimentos no Período</label>
                <input
                  type="number"
                  min="0"
                  value={newIncidente.atendimentos}
                  onChange={(e) => setNewIncidente({ ...newIncidente, atendimentos: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">Descrição do Incidente *</label>
              <textarea
                value={newIncidente.descricao}
                onChange={(e) => setNewIncidente({ ...newIncidente, descricao: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e6a8f]"
                rows={4}
                placeholder="Descreva o incidente de forma clara e objetiva..."
                required
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-white transition-all hover:shadow-lg"
                style={{ backgroundColor: '#1e6a8f' }}
              >
                Salvar Incidente
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal de Análise Ishikawa */}
      {showIshikawa && selectedIncidente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-2xl font-semibold" style={{ color: '#0a2b3e' }}>
                Análise de Causa Raiz - Ishikawa
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {data.setores.find(s => s.id === selectedIncidente.setorId)?.nome} | {selectedIncidente.tipo}
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Diagrama Conceitual */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                <h3 className="font-semibold text-gray-800 mb-3">🐟 Diagrama de Ishikawa (Espinha de Peixe)</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Identifique os fatores contributivos em cada categoria. Incidentes frequentes exigem planos de ação imediatos.
                </p>
              </div>

              {/* Paciente */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-blue-500">👤</span> Paciente
                </h4>
                {ishikawa.paciente.map((fator, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={fator}
                      onChange={(e) => updateFator('paciente', index, e.target.value)}
                      placeholder="Ex: Paciente idoso, comunicação prejudicada..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {ishikawa.paciente.length > 1 && (
                      <button
                        onClick={() => removeFatorField('paciente', index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addFatorField('paciente')}
                  className="text-sm text-blue-600 hover:text-blue-800 mt-1"
                >
                  + Adicionar fator
                </button>
              </div>

              {/* Tarefa */}
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-green-500">📋</span> Tarefa
                </h4>
                {ishikawa.tarefa.map((fator, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={fator}
                      onChange={(e) => updateFator('tarefa', index, e.target.value)}
                      placeholder="Ex: Procedimento complexo, protocolo não seguido..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {ishikawa.tarefa.length > 1 && (
                      <button
                        onClick={() => removeFatorField('tarefa', index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addFatorField('tarefa')}
                  className="text-sm text-green-600 hover:text-green-800 mt-1"
                >
                  + Adicionar fator
                </button>
              </div>

              {/* Indivíduo */}
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-purple-500">🧑‍⚕️</span> Indivíduo
                </h4>
                {ishikawa.individuo.map((fator, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={fator}
                      onChange={(e) => updateFator('individuo', index, e.target.value)}
                      placeholder="Ex: Falta de treinamento, fadiga..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {ishikawa.individuo.length > 1 && (
                      <button
                        onClick={() => removeFatorField('individuo', index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addFatorField('individuo')}
                  className="text-sm text-purple-600 hover:text-purple-800 mt-1"
                >
                  + Adicionar fator
                </button>
              </div>

              {/* Equipe */}
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-orange-500">👥</span> Equipe
                </h4>
                {ishikawa.equipe.map((fator, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={fator}
                      onChange={(e) => updateFator('equipe', index, e.target.value)}
                      placeholder="Ex: Falha de comunicação, sobrecarga..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {ishikawa.equipe.length > 1 && (
                      <button
                        onClick={() => removeFatorField('equipe', index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addFatorField('equipe')}
                  className="text-sm text-orange-600 hover:text-orange-800 mt-1"
                >
                  + Adicionar fator
                </button>
              </div>

              {/* Ambiente */}
              <div className="border-l-4 border-teal-500 pl-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-teal-500">🏥</span> Ambiente
                </h4>
                {ishikawa.ambiente.map((fator, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={fator}
                      onChange={(e) => updateFator('ambiente', index, e.target.value)}
                      placeholder="Ex: Iluminação inadequada, espaço reduzido..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    {ishikawa.ambiente.length > 1 && (
                      <button
                        onClick={() => removeFatorField('ambiente', index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addFatorField('ambiente')}
                  className="text-sm text-teal-600 hover:text-teal-800 mt-1"
                >
                  + Adicionar fator
                </button>
              </div>

              {/* Organização */}
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-red-500">🏢</span> Organização
                </h4>
                {ishikawa.organizacao.map((fator, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={fator}
                      onChange={(e) => updateFator('organizacao', index, e.target.value)}
                      placeholder="Ex: Falta de recursos, política inadequada..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    {ishikawa.organizacao.length > 1 && (
                      <button
                        onClick={() => removeFatorField('organizacao', index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addFatorField('organizacao')}
                  className="text-sm text-red-600 hover:text-red-800 mt-1"
                >
                  + Adicionar fator
                </button>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end bg-gray-50">
              <button
                onClick={() => {
                  setShowIshikawa(false);
                  setSelectedIncidente(null);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveIshikawa}
                className="px-4 py-2 rounded-lg text-white transition-all hover:shadow-lg"
                style={{ backgroundColor: '#1e6a8f' }}
              >
                Salvar Análise
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Incidentes */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#0a2b3e' }}>
              <tr>
                <th className="px-6 py-4 text-left text-sm text-white">Data</th>
                <th className="px-6 py-4 text-left text-sm text-white">Setor</th>
                <th className="px-6 py-4 text-left text-sm text-white">Tipo</th>
                <th className="px-6 py-4 text-left text-sm text-white">Gravidade</th>
                <th className="px-6 py-4 text-left text-sm text-white">Status</th>
                <th className="px-6 py-4 text-center text-sm text-white">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.incidentes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Nenhum incidente registrado
                  </td>
                </tr>
              ) : (
                data.incidentes.map((incidente) => {
                  const setor = data.setores.find(s => s.id === incidente.setorId);
                  const temAnalise = data.analises.some(a => a.incidenteId === incidente.id);
                  
                  return (
                    <tr key={incidente.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(incidente.data).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {setor?.nome}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {incidente.tipo}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getGravidadeColor(incidente.gravidade)}`}>
                          {getGravidadeLabel(incidente.gravidade)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(incidente.status)}`}>
                          {incidente.status === 'aberto' && 'Aberto'}
                          {incidente.status === 'em-analise' && 'Em Análise'}
                          {incidente.status === 'resolvido' && 'Resolvido'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedIncidente(incidente);
                              setShowIshikawa(true);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all"
                            title={temAnalise ? "Ver análise" : "Analisar causa raiz"}
                          >
                            {temAnalise ? <Eye className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                            <span className="text-xs">{temAnalise ? "Ver" : "Analisar"}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnaliseIncidentes;