import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { calculateBusinessDay, isDataEntryBlocked } from '../utils/storage';
import { AlertCircle, CheckCircle, Lock, Unlock, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const DataEntryForm: React.FC = () => {
  const { user, data, updateData } = useAuth();
  const [setorId, setSetorId] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const [businessDay, setBusinessDay] = useState(0);
  const [activeTab, setActiveTab] = useState('coletivos');

  const isAdmin = user?.role === 'admin';
  
  // Filtrar setores baseado no role do usuário
  const availableSetores = isAdmin 
    ? data.setores 
    : data.setores.filter(s => s.id === user?.setorId);

  // Verificar se usuário comum tem setor vinculado
  const hasSetor = isAdmin || (user?.setorId && availableSetores.length > 0);

  // Estados para indicadores coletivos
  const [coletivos, setColetivos] = useState({
    preenchimentoProntuario: '',
    satisfacaoUsuarios: '',
    densidadeQuedas: '',
    densidadeLesaoPressao: '',
    naoConformidadeMedicamentos: '',
    acoesSegurancaPaciente: '',
    educacaoPermanente: ''
  });

  // Estados para indicadores individuais (variam por setor)
  const [individuais, setIndividuais] = useState<any>({});

  useEffect(() => {
    const day = calculateBusinessDay();
    setBusinessDay(day);
    
    if (user) {
      const blocked = isDataEntryBlocked(user.role, data.dataLiberada);
      setIsBlocked(blocked);
      
      // Se for usuário comum, setar automaticamente seu setor
      if (!isAdmin && user.setorId) {
        setSetorId(user.setorId);
      }
    }
  }, [user, data.dataLiberada, isAdmin]);

  // Carregar dados do setor selecionado
  useEffect(() => {
    if (setorId) {
      const setor = data.setores.find(s => s.id === setorId);
      if (setor && setor.indicadores) {
        // Carregar indicadores coletivos se existirem
        if ((setor.indicadores as any).preenchimentoProntuario !== undefined) {
          setColetivos({
            preenchimentoProntuario: (setor.indicadores as any).preenchimentoProntuario?.toString() || '',
            satisfacaoUsuarios: (setor.indicadores as any).satisfacaoUsuarios?.toString() || '',
            densidadeQuedas: (setor.indicadores as any).densidadeQuedas?.toString() || '',
            densidadeLesaoPressao: (setor.indicadores as any).densidadeLesaoPressao?.toString() || '',
            naoConformidadeMedicamentos: (setor.indicadores as any).naoConformidadeMedicamentos?.toString() || '',
            acoesSegurancaPaciente: (setor.indicadores as any).acoesSegurancaPaciente?.toString() || '',
            educacaoPermanente: (setor.indicadores as any).educacaoPermanente?.toString() || ''
          });
        }
        
        // Carregar indicadores individuais
        setIndividuais(setor.indicadores);
      }
    }
  }, [setorId, data.setores]);

  const handleLiberar = () => {
    if (user?.role === 'admin') {
      updateData({ dataLiberada: true });
      toast.success('Entrada de dados liberada!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isBlocked) {
      toast.error('Entrada de dados bloqueada após o 5º dia útil');
      return;
    }

    if (!setorId) {
      toast.error('Selecione um setor');
      return;
    }

    const setor = data.setores.find(s => s.id === setorId);
    if (!setor) return;

    // Preparar objeto com novos indicadores
    const novosIndicadores: any = { ...setor.indicadores };

    // Atualizar coletivos se o setor não for de apoio
    if (setor.tipo !== 'apoio') {
      Object.keys(coletivos).forEach(key => {
        if (coletivos[key as keyof typeof coletivos]) {
          novosIndicadores[key] = parseFloat(coletivos[key as keyof typeof coletivos]);
        }
      });
    }

    // Atualizar individuais
    Object.keys(individuais).forEach(key => {
      if (individuais[key] !== undefined && individuais[key] !== '') {
        const value = parseFloat(individuais[key]);
        if (!isNaN(value)) {
          novosIndicadores[key] = value;
        }
      }
    });

    // Atualizar setor
    const updatedSetores = data.setores.map(s => {
      if (s.id === setorId) {
        return {
          ...s,
          indicadores: novosIndicadores
        };
      }
      return s;
    });

    updateData({ setores: updatedSetores });
    toast.success('Dados atualizados com sucesso!');
  };

  const renderCamposIndividuais = () => {
    if (!setorId) return null;

    const setor = data.setores.find(s => s.id === setorId);
    if (!setor) return null;

    switch (setor.tipo) {
      case 'internacao':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Saídas" value={individuais.saidas} onChange={(v) => setIndividuais({...individuais, saidas: v})} />
            <InputField label="Média Permanência (dias)" value={individuais.mediaPermanencia} onChange={(v) => setIndividuais({...individuais, mediaPermanencia: v})} />
            <InputField label="Taxa Ocupação (%)" value={individuais.taxaOcupacao} onChange={(v) => setIndividuais({...individuais, taxaOcupacao: v})} />
            <InputField label="Taxa Readmissão 29 dias (%)" value={individuais.taxaReadmissao29dias} onChange={(v) => setIndividuais({...individuais, taxaReadmissao29dias: v})} />
            <InputField label="Taxa Retorno Não Program. 15d (%)" value={individuais.taxaRetornoNaoProgramado15dias} onChange={(v) => setIndividuais({...individuais, taxaRetornoNaoProgramado15dias: v})} />
            <InputField label="LOS com Exames (dias)" value={individuais.losComExames} onChange={(v) => setIndividuais({...individuais, losComExames: v})} />
            <InputField label="LOS sem Exames (dias)" value={individuais.losSemExames} onChange={(v) => setIndividuais({...individuais, losSemExames: v})} />
            <InputField label="Intervalo Substituição (dias)" value={individuais.intervaloSubstituicao} onChange={(v) => setIndividuais({...individuais, intervaloSubstituicao: v})} />
            <InputField label="Utilização Protocolos (%)" value={individuais.utilizacaoProtocolos} onChange={(v) => setIndividuais({...individuais, utilizacaoProtocolos: v})} />
          </div>
        );

      case 'pronto-atendimento':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Tempo Espera Vermelho (min)" value={individuais.tempoEsperaVermelho} onChange={(v) => setIndividuais({...individuais, tempoEsperaVermelho: v})} />
            <InputField label="Tempo Espera Amarelo (min)" value={individuais.tempoEsperaAmarelo} onChange={(v) => setIndividuais({...individuais, tempoEsperaAmarelo: v})} />
            <InputField label="Tempo Espera Verde (min)" value={individuais.tempoEsperaVerde} onChange={(v) => setIndividuais({...individuais, tempoEsperaVerde: v})} />
            <InputField label="Tempo Espera Azul (min)" value={individuais.tempoEsperaAzul} onChange={(v) => setIndividuais({...individuais, tempoEsperaAzul: v})} />
            <InputField label="Tempo Porta-Médico (min)" value={individuais.tempoPortaMedico} onChange={(v) => setIndividuais({...individuais, tempoPortaMedico: v})} />
            <InputField label="Tempo Decisão Médica (min)" value={individuais.tempoDecisaoMedica} onChange={(v) => setIndividuais({...individuais, tempoDecisaoMedica: v})} />
            <InputField label="Tempo Boarding (min)" value={individuais.tempoBoarding} onChange={(v) => setIndividuais({...individuais, tempoBoarding: v})} />
            <InputField label="Atendimentos Classificação" value={individuais.atendimentosClassificacao} onChange={(v) => setIndividuais({...individuais, atendimentosClassificacao: v})} />
            <InputField label="Taxa Evasão (%)" value={individuais.taxaEvasao} onChange={(v) => setIndividuais({...individuais, taxaEvasao: v})} />
            <InputField label="Observação até 24h" value={individuais.observacaoAte24h} onChange={(v) => setIndividuais({...individuais, observacaoAte24h: v})} />
          </div>
        );

      case 'uti':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {individuais.saidasAdulto !== undefined && (
              <InputField label="Saídas Adulto" value={individuais.saidasAdulto} onChange={(v) => setIndividuais({...individuais, saidasAdulto: v})} />
            )}
            {individuais.saidasNeonatal !== undefined && (
              <InputField label="Saídas Neonatal" value={individuais.saidasNeonatal} onChange={(v) => setIndividuais({...individuais, saidasNeonatal: v})} />
            )}
            <InputField label="Taxa Readmissão 48h (%)" value={individuais.taxaReadmissao48h} onChange={(v) => setIndividuais({...individuais, taxaReadmissao48h: v})} />
            <InputField label="Taxa Mortalidade >24h (%)" value={individuais.taxaMortalidade24h} onChange={(v) => setIndividuais({...individuais, taxaMortalidade24h: v})} />
            <InputField label="Densidade ITU (/1k sonda-dia)" value={individuais.densidadeITU} onChange={(v) => setIndividuais({...individuais, densidadeITU: v})} />
            <InputField label="Densidade Pneumonia (/1k VM-dia)" value={individuais.densidadePneumonia} onChange={(v) => setIndividuais({...individuais, densidadePneumonia: v})} />
            <InputField label="Tempo Porta-ECG (min)" value={individuais.tempoPortaECG} onChange={(v) => setIndividuais({...individuais, tempoPortaECG: v})} />
          </div>
        );

      case 'maternidade':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Saídas Maternidade" value={individuais.saidasMaternidade} onChange={(v) => setIndividuais({...individuais, saidasMaternidade: v})} />
            <InputField label="Atend. Urgência Obstétrico" value={individuais.atendimentosUrgenciaObstetrico} onChange={(v) => setIndividuais({...individuais, atendimentosUrgenciaObstetrico: v})} />
            <InputField label="Taxa Partos Normal (%)" value={individuais.taxaPartosNormal} onChange={(v) => setIndividuais({...individuais, taxaPartosNormal: v})} />
            <InputField label="Taxa Partos Cesárea (%)" value={individuais.taxaPartosCesarea} onChange={(v) => setIndividuais({...individuais, taxaPartosCesarea: v})} />
          </div>
        );

      case 'centro-cirurgico':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#0a2b3e] to-[#1e6a8f] p-4 rounded-lg">
              <h3 className="text-white font-bold text-lg">Indicadores do Centro Cirúrgico</h3>
              <p className="text-blue-200 text-sm">15 indicadores de qualidade e segurança cirúrgica</p>
            </div>

            {/* Qualidade e Segurança Cirúrgica */}
            <div className="border-l-4 border-green-600 pl-4">
              <h4 className="font-semibold text-gray-900 mb-3">Qualidade e Segurança Cirúrgica</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField 
                  label="Taxa de Infecção do Sítio Cirúrgico (%)" 
                  value={individuais.taxaInfeccaoSitioCirurgico} 
                  onChange={(v) => setIndividuais({...individuais, taxaInfeccaoSitioCirurgico: v})} 
                />
                <InputField 
                  label="Taxa de Reabordagem Não Programada (%)" 
                  value={individuais.taxaReabordagemNaoProgramada} 
                  onChange={(v) => setIndividuais({...individuais, taxaReabordagemNaoProgramada: v})} 
                />
                <InputField 
                  label="Taxa de Mortalidade Cirúrgica (%)" 
                  value={individuais.taxaMortalidadeCirurgica} 
                  onChange={(v) => setIndividuais({...individuais, taxaMortalidadeCirurgica: v})} 
                />
                <InputField 
                  label="Taxa de Eventos Adversos (%)" 
                  value={individuais.taxaEventosAdversos} 
                  onChange={(v) => setIndividuais({...individuais, taxaEventosAdversos: v})} 
                />
              </div>
            </div>

            {/* Eficiência Operacional */}
            <div className="border-l-4 border-blue-600 pl-4">
              <h4 className="font-semibold text-gray-900 mb-3">Eficiência Operacional</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField 
                  label="Taxa de Ocupação de Sala Cirúrgica (%)" 
                  value={individuais.taxaOcupacaoSalaCirurgica} 
                  onChange={(v) => setIndividuais({...individuais, taxaOcupacaoSalaCirurgica: v})} 
                />
                <InputField 
                  label="Tempo de Giro de Sala (minutos)" 
                  value={individuais.tempoGiroSala} 
                  onChange={(v) => setIndividuais({...individuais, tempoGiroSala: v})} 
                />
                <InputField 
                  label="Taxa de Cancelamento Cirúrgico (%)" 
                  value={individuais.taxaCancelamentoCirurgico} 
                  onChange={(v) => setIndividuais({...individuais, taxaCancelamentoCirurgico: v})} 
                />
                <InputField 
                  label="Atraso no Início das Cirurgias (minutos)" 
                  value={individuais.atrasoInicioCirurgias} 
                  onChange={(v) => setIndividuais({...individuais, atrasoInicioCirurgias: v})} 
                />
                <InputField 
                  label="Cumprimento do Mapa Cirúrgico (%)" 
                  value={individuais.cumprimentoMapaCirurgico} 
                  onChange={(v) => setIndividuais({...individuais, cumprimentoMapaCirurgico: v})} 
                />
              </div>
            </div>

            {/* Processos e Gestão */}
            <div className="border-l-4 border-amber-600 pl-4">
              <h4 className="font-semibold text-gray-900 mb-3">Processos e Gestão</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField 
                  label="Notificação de Não Conformidades (quantidade)" 
                  value={individuais.notificacaoNaoConformidades} 
                  onChange={(v) => setIndividuais({...individuais, notificacaoNaoConformidades: v})} 
                />
                <InputField 
                  label="Taxa de Perdas de Materiais/Esterilização (%)" 
                  value={individuais.taxaPerdasMateriaisEsterilizacao} 
                  onChange={(v) => setIndividuais({...individuais, taxaPerdasMateriaisEsterilizacao: v})} 
                />
                <InputField 
                  label="Tempo de Permanência da RPA (minutos)" 
                  value={individuais.tempoPermanenciaRPA} 
                  onChange={(v) => setIndividuais({...individuais, tempoPermanenciaRPA: v})} 
                />
              </div>
            </div>

            {/* Segurança do Paciente (Never Events) */}
            <div className="border-l-4 border-red-600 pl-4">
              <h4 className="font-semibold text-gray-900 mb-3">Segurança do Paciente (Never Events)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField 
                  label="Retenção de Corpo Estranho (quantidade)" 
                  value={individuais.retencaoCorpoEstranho} 
                  onChange={(v) => setIndividuais({...individuais, retencaoCorpoEstranho: v})} 
                />
                <InputField 
                  label="Falha no Processo de Identificação do Paciente (quantidade)" 
                  value={individuais.falhaIdentificacaoPaciente} 
                  onChange={(v) => setIndividuais({...individuais, falhaIdentificacaoPaciente: v})} 
                />
              </div>
            </div>

            {/* Satisfação */}
            <div className="border-l-4 border-purple-600 pl-4">
              <h4 className="font-semibold text-gray-900 mb-3">Satisfação</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField 
                  label="Índice de Satisfação do Paciente (0-5)" 
                  value={individuais.indiceSatisfacaoPaciente} 
                  onChange={(v) => setIndividuais({...individuais, indiceSatisfacaoPaciente: v})} 
                />
              </div>
            </div>
          </div>
        );

      case 'ambulatorio':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Razão Consultas Ofertadas (%)" value={individuais.razaoConsultasOfertadas} onChange={(v) => setIndividuais({...individuais, razaoConsultasOfertadas: v})} />
            <InputField label="Absenteísmo (%)" value={individuais.absenteismo} onChange={(v) => setIndividuais({...individuais, absenteismo: v})} />
          </div>
        );

      case 'apoio':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {individuais.indiceSustentabilidadeFinanceira !== undefined && (
              <InputField label="Índice Sustentabilidade Financeira" value={individuais.indiceSustentabilidadeFinanceira} onChange={(v) => setIndividuais({...individuais, indiceSustentabilidadeFinanceira: v})} />
            )}
            {individuais.custoVsOrcamento !== undefined && (
              <InputField label="Custo vs Orçamento (%)" value={individuais.custoVsOrcamento} onChange={(v) => setIndividuais({...individuais, custoVsOrcamento: v})} />
            )}
            {individuais.indiceAcuraciaEstoque !== undefined && (
              <InputField label="Índice Acurácia Estoque (%)" value={individuais.indiceAcuraciaEstoque} onChange={(v) => setIndividuais({...individuais, indiceAcuraciaEstoque: v})} />
            )}
            {individuais.investigacaoReacoesAdversas !== undefined && (
              <InputField label="Investigação Reações Adversas" value={individuais.investigacaoReacoesAdversas} onChange={(v) => setIndividuais({...individuais, investigacaoReacoesAdversas: v})} />
            )}
            {individuais.taxaGlosasSIH !== undefined && (
              <InputField label="Taxa Glosas SIH (%)" value={individuais.taxaGlosasSIH} onChange={(v) => setIndividuais({...individuais, taxaGlosasSIH: v})} />
            )}
            {individuais.monitoramentoDensidades !== undefined && (
              <InputField label="Monitoramento Densidades" value={individuais.monitoramentoDensidades} onChange={(v) => setIndividuais({...individuais, monitoramentoDensidades: v})} />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const InputField: React.FC<{ label: string; value: any; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
    <div>
      <label className="block text-sm mb-2 text-gray-700">{label}</label>
      <input
        type="number"
        step="0.1"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={isBlocked}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e6a8f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
  );

  const setorSelecionado = data.setores.find(s => s.id === setorId);
  const mostrarColetivos = setorSelecionado && setorSelecionado.tipo !== 'apoio';

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2" style={{ color: '#0a2b3e' }}>Alimentar Dados</h1>
        <p className="text-gray-600">Atualizar indicadores por setor</p>
      </div>

      {/* Alerta se usuário não tem setor vinculado */}
      {!hasSetor && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-semibold mb-2">Usuário sem setor vinculado</h3>
              <p className="text-red-700 text-sm mb-3">
                Seu usuário não está vinculado a nenhum setor. Entre em contato com o administrador para vincular sua conta a um setor específico.
              </p>
              <p className="text-red-600 text-xs">
                Apenas usuários com setor vinculado podem alimentar dados.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status do Bloqueio */}
      {hasSetor && (
        <div className={`mb-6 rounded-lg p-4 border ${
          businessDay > 5 
            ? 'bg-yellow-50 border-yellow-200' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {businessDay > 5 ? (
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              ) : (
                <CheckCircle className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className={`text-sm mb-1 ${
                businessDay > 5 ? 'text-yellow-800' : 'text-blue-800'
              }`}>
                Dia útil atual: {businessDay}º dia
              </h3>
              <p className={`text-sm ${
                businessDay > 5 ? 'text-yellow-700' : 'text-blue-700'
              }`}>
                {businessDay <= 5 
                  ? 'Entrada de dados liberada para todos os usuários.' 
                  : isBlocked
                    ? 'Entrada de dados bloqueada. Apenas administradores podem liberar.'
                    : 'Entrada de dados liberada temporariamente pelo administrador.'}
              </p>
            </div>
            {user?.role === 'admin' && businessDay > 5 && (
              <button
                onClick={handleLiberar}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                  data.dataLiberada
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-yellow-600 text-white hover:bg-yellow-700'
                }`}
              >
                {data.dataLiberada ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                {data.dataLiberada ? 'Liberado' : 'Liberar'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Formulário */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="setor" className="block text-sm mb-2 text-gray-700">
              Setor *
            </label>
            <select
              id="setor"
              value={setorId}
              onChange={(e) => setSetorId(e.target.value)}
              disabled={isBlocked}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e6a8f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            >
              <option value="">Selecione um setor</option>
              {availableSetores.map(setor => (
                <option key={setor.id} value={setor.id}>
                  {setor.nome}
                </option>
              ))}
            </select>
          </div>

          {setorId && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className={`grid w-full ${mostrarColetivos ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {mostrarColetivos && <TabsTrigger value="coletivos">Indicadores Coletivos</TabsTrigger>}
                <TabsTrigger value="individuais">Indicadores Individuais</TabsTrigger>
              </TabsList>

              {mostrarColetivos && (
                <TabsContent value="coletivos" className="space-y-4 mt-6">
                  <h3 className="text-lg mb-4" style={{ color: '#1e6a8f' }}>Indicadores Transversais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField 
                      label="Preenchimento Prontuário (%)" 
                      value={coletivos.preenchimentoProntuario} 
                      onChange={(v) => setColetivos({...coletivos, preenchimentoProntuario: v})} 
                    />
                    <InputField 
                      label="Satisfação Usuários (%)" 
                      value={coletivos.satisfacaoUsuarios} 
                      onChange={(v) => setColetivos({...coletivos, satisfacaoUsuarios: v})} 
                    />
                    <InputField 
                      label="Densidade Quedas (/1k)" 
                      value={coletivos.densidadeQuedas} 
                      onChange={(v) => setColetivos({...coletivos, densidadeQuedas: v})} 
                    />
                    <InputField 
                      label="Densidade Lesão por Pressão (/1k)" 
                      value={coletivos.densidadeLesaoPressao} 
                      onChange={(v) => setColetivos({...coletivos, densidadeLesaoPressao: v})} 
                    />
                    <InputField 
                      label="Não Conformidade Medicamentos" 
                      value={coletivos.naoConformidadeMedicamentos} 
                      onChange={(v) => setColetivos({...coletivos, naoConformidadeMedicamentos: v})} 
                    />
                    <InputField 
                      label="Ações Segurança Paciente" 
                      value={coletivos.acoesSegurancaPaciente} 
                      onChange={(v) => setColetivos({...coletivos, acoesSegurancaPaciente: v})} 
                    />
                    <InputField 
                      label="Educação Permanente (horas)" 
                      value={coletivos.educacaoPermanente} 
                      onChange={(v) => setColetivos({...coletivos, educacaoPermanente: v})} 
                    />
                  </div>
                </TabsContent>
              )}

              <TabsContent value="individuais" className="space-y-4 mt-6">
                <h3 className="text-lg mb-4" style={{ color: '#1e6a8f' }}>
                  Indicadores Específicos - {setorSelecionado?.nome}
                </h3>
                {renderCamposIndividuais()}
              </TabsContent>
            </Tabs>
          )}

          <button
            type="submit"
            disabled={isBlocked || !setorId}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#1e6a8f' }}
          >
            <Save className="w-5 h-5" />
            {isBlocked ? 'Entrada Bloqueada' : 'Salvar Dados'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DataEntryForm;