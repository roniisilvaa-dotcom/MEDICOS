import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, Heart, Stethoscope, Ambulance, FileText } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const SetoresView: React.FC = () => {
  const { data } = useAuth();
  const [activeTab, setActiveTab] = useState('todos');

  // Filtrar setores por tipo
  const setoresInternacao = data.setores.filter(s => s.tipo === 'internacao');
  const setoresUTI = data.setores.filter(s => s.tipo === 'uti');
  const setorPS = data.setores.filter(s => s.tipo === 'pronto-atendimento');
  const setorMaternidade = data.setores.filter(s => s.tipo === 'maternidade');
  const setorCentroCirurgico = data.setores.filter(s => s.tipo === 'centro-cirurgico');
  const setorAmbulatorio = data.setores.filter(s => s.tipo === 'ambulatorio');
  const setoresApoio = data.setores.filter(s => s.tipo === 'apoio');

  const getSetorIcon = (tipo: string) => {
    switch (tipo) {
      case 'internacao':
        return <Building2 className="w-5 h-5" />;
      case 'uti':
        return <Heart className="w-5 h-5" />;
      case 'pronto-atendimento':
        return <Ambulance className="w-5 h-5" />;
      case 'maternidade':
        return <Heart className="w-5 h-5" />;
      case 'centro-cirurgico':
        return <Stethoscope className="w-5 h-5" />;
      case 'ambulatorio':
        return <FileText className="w-5 h-5" />;
      case 'apoio':
        return <Building2 className="w-5 h-5" />;
      default:
        return <Building2 className="w-5 h-5" />;
    }
  };

  const getSetorBadge = (tipo: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      'internacao': { label: 'Internação', className: 'bg-blue-500 hover:bg-blue-600' },
      'uti': { label: 'UTI', className: 'bg-purple-500 hover:bg-purple-600' },
      'pronto-atendimento': { label: 'Emergência', className: 'bg-red-500 hover:bg-red-600' },
      'maternidade': { label: 'Maternidade', className: 'bg-pink-500 hover:bg-pink-600' },
      'centro-cirurgico': { label: 'Cirúrgico', className: 'bg-indigo-500 hover:bg-indigo-600' },
      'ambulatorio': { label: 'Ambulatório', className: 'bg-teal-500 hover:bg-teal-600' },
      'apoio': { label: 'Apoio', className: 'bg-gray-500 hover:bg-gray-600' },
    };
    
    const badge = badges[tipo] || badges['apoio'];
    return <Badge className={badge.className}>{badge.label}</Badge>;
  };

  const SetorCard: React.FC<{ setor: any }> = ({ setor }) => {
    // Garantir que indicadores existe
    const indicadores = setor.indicadores || {};
    
    return (
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#1e6a8f] bg-opacity-10 flex items-center justify-center text-[#1e6a8f]">
              {getSetorIcon(setor.tipo)}
            </div>
            <div>
              <h3 className="text-lg" style={{ color: '#0a2b3e' }}>{setor.nome}</h3>
              <p className="text-sm text-gray-500">{setor.mesReferencia}</p>
            </div>
          </div>
          {getSetorBadge(setor.tipo)}
        </div>

        <div className="space-y-2">
          {/* Indicadores principais baseados no tipo */}
          {setor.tipo === 'internacao' && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxa de Ocupação:</span>
                <span className="font-semibold" style={{ color: '#0a2b3e' }}>
                  {indicadores.taxaOcupacao ?? '-'}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Média Permanência:</span>
                <span className="font-semibold" style={{ color: '#0a2b3e' }}>
                  {indicadores.mediaPermanencia ?? '-'} dias
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Saídas:</span>
                <span className="font-semibold" style={{ color: '#0a2b3e' }}>
                  {indicadores.saidas ?? '-'}
                </span>
              </div>
            </>
          )}

          {setor.tipo === 'uti' && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxa Mortalidade:</span>
                <span className="font-semibold text-red-600">
                  {indicadores.taxaMortalidade24h ?? '-'}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Densidade ITU:</span>
                <span className="font-semibold" style={{ color: '#0a2b3e' }}>
                  {indicadores.densidadeITU ?? '-'}/1k
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Densidade Pneumonia:</span>
                <span className="font-semibold" style={{ color: '#0a2b3e' }}>
                  {indicadores.densidadePneumonia ?? '-'}/1k
                </span>
              </div>
            </>
          )}

          {setor.tipo === 'pronto-atendimento' && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tempo Vermelho:</span>
                <span className="font-semibold text-red-600">
                  {indicadores.tempoEsperaVermelho ?? '-'} min
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tempo Amarelo:</span>
                <span className="font-semibold text-yellow-600">
                  {indicadores.tempoEsperaAmarelo ?? '-'} min
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tempo Porta-Médico:</span>
                <span className="font-semibold" style={{ color: '#0a2b3e' }}>
                  {indicadores.tempoPortaMedico ?? '-'} min
                </span>
              </div>
            </>
          )}

          {setor.tipo === 'maternidade' && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Partos Normal:</span>
                <span className="font-semibold text-green-600">
                  {indicadores.taxaPartosNormal ?? '-'}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Partos Cesárea:</span>
                <span className="font-semibold text-orange-600">
                  {indicadores.taxaPartosCesarea ?? '-'}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Saídas:</span>
                <span className="font-semibold" style={{ color: '#0a2b3e' }}>
                  {indicadores.saidasMaternidade ?? '-'}
                </span>
              </div>
            </>
          )}

          {setor.tipo === 'centro-cirurgico' && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Cirurgias Eletivas:</span>
                <span className="font-semibold text-blue-600">
                  {indicadores.cirurgiasEletivas ?? '-'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Urgência/Emergência:</span>
                <span className="font-semibold text-red-600">
                  {indicadores.cirurgiasUrgenciaEmergencia ?? '-'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxa Suspensão:</span>
                <span className="font-semibold" style={{ color: '#0a2b3e' }}>
                  {indicadores.taxaSuspensaoOperacional ?? '-'}%
                </span>
              </div>
            </>
          )}

          {setor.tipo === 'ambulatorio' && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Consultas Ofertadas:</span>
                <span className="font-semibold text-blue-600">
                  {indicadores.razaoConsultasOfertadas ?? '-'}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Absenteísmo:</span>
                <span className="font-semibold text-red-600">
                  {indicadores.absenteismo ?? '-'}%
                </span>
              </div>
            </>
          )}

          {setor.tipo === 'apoio' && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold text-green-600">
                  Operacional
                </span>
              </div>
            </>
          )}

          {/* Indicadores coletivos (se aplicável) */}
          {setor.tipo !== 'apoio' && (
            <>
              <div className="border-t border-gray-200 my-3 pt-3">
                <p className="text-xs text-gray-500 mb-2">Indicadores Coletivos</p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Satisfação:</span>
                <span className="font-semibold text-green-600">
                  {indicadores.satisfacaoUsuarios ?? '-'}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Densidade Quedas:</span>
                <span className="font-semibold" style={{ color: '#0a2b3e' }}>
                  {indicadores.densidadeQuedas ?? '-'}/1k
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2" style={{ color: '#0a2b3e' }}>Setores Hospitalares</h1>
        <p className="text-gray-600">Visão detalhada por setor e tipo de atendimento</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8 mb-6">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="internacao">Internação</TabsTrigger>
          <TabsTrigger value="uti">UTI</TabsTrigger>
          <TabsTrigger value="ps">P.S.</TabsTrigger>
          <TabsTrigger value="maternidade">Maternidade</TabsTrigger>
          <TabsTrigger value="cirurgico">Cirúrgico</TabsTrigger>
          <TabsTrigger value="ambulatorio">Ambulatório</TabsTrigger>
          <TabsTrigger value="apoio">Apoio</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.setores.map(setor => (
              <SetorCard key={setor.id} setor={setor} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="internacao" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {setoresInternacao.map(setor => (
              <SetorCard key={setor.id} setor={setor} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="uti" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {setoresUTI.map(setor => (
              <SetorCard key={setor.id} setor={setor} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ps" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {setorPS.map(setor => (
              <SetorCard key={setor.id} setor={setor} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="maternidade" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {setorMaternidade.map(setor => (
              <SetorCard key={setor.id} setor={setor} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cirurgico" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {setorCentroCirurgico.map(setor => (
              <SetorCard key={setor.id} setor={setor} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ambulatorio" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {setorAmbulatorio.map(setor => (
              <SetorCard key={setor.id} setor={setor} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="apoio" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {setoresApoio.map(setor => (
              <SetorCard key={setor.id} setor={setor} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SetoresView;