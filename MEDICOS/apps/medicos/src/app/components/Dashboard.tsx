import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useAuth } from '../context/AuthContext';
import { ArrowDown, MoreVertical } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard: React.FC = () => {
  const { data } = useAuth();

  // Calcular totais
  const totalIncidentes = data.historicoMensal[data.historicoMensal.length - 1]?.incidentes || 284;
  const taxaMedia = 14.1;
  const ocupacaoMedia = 89;
  const tempoResposta = 52;

  // Dados do gráfico de linha (Evolução Mensal por Setor)
  const lineData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        label: 'UCINCO',
        data: [80, 120, 100, 200, 150, 100, 150, 180, 210, 200, 190, 205],
        borderColor: '#0066cc',
        backgroundColor: 'rgba(0, 102, 204, 0.1)',
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: 'Pronto Atendimento',
        data: [60, 80, 70, 90, 110, 80, 90, 100, 120, 110, 115, 125],
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: 'Enfermaria',
        data: [40, 50, 45, 60, 70, 50, 60, 65, 75, 70, 72, 78],
        borderColor: '#51cf66',
        backgroundColor: 'rgba(81, 207, 102, 0.1)',
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: 'Maternidade',
        data: [90, 110, 100, 130, 150, 120, 140, 160, 180, 170, 175, 185],
        borderColor: '#ffd43b',
        backgroundColor: 'rgba(255, 212, 59, 0.1)',
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: 'UTI Adulto',
        data: [70, 90, 80, 110, 130, 100, 120, 140, 150, 140, 145, 155],
        borderColor: '#9775fa',
        backgroundColor: 'rgba(151, 117, 250, 0.1)',
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: 'Centro Cirúrgico',
        data: [50, 60, 55, 70, 80, 60, 70, 75, 85, 80, 82, 88],
        borderColor: '#ff922b',
        backgroundColor: 'rgba(255, 146, 43, 0.1)',
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  // Dados do gráfico de rosca (Distribuição de Ocorrências por Setor)
  const donutData = {
    labels: ['UCINCO', 'Enfermaria', 'UTI', 'Maternidade', 'Centro Cirúrg.', 'Outros'],
    datasets: [
      {
        data: [35.3, 25.3, 15.7, 13.8, 6.3, 3.6],
        backgroundColor: [
          '#0066cc',
          '#51cf66',
          '#9775fa',
          '#ff6b6b',
          '#ff922b',
          '#20c997',
        ],
        borderWidth: 0,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 11,
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 250,
        ticks: {
          stepSize: 50,
        },
        grid: {
          color: '#f0f0f0',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 12,
          font: {
            size: 11,
          },
        },
      },
    },
    cutout: '65%',
  };

  // Dados da tabela de resumo
  const resumoSetores = [
    { setor: 'UCINCO', taxa: '26.4 Taxa', evitavel: '93,5%', tempo: '52 min', ocupacao: '89%', status: 'Crítico' },
    { setor: 'Pronto Atendimento', taxa: '15.4 Taxa', evitavel: '93,3%', tempo: '52 min', ocupacao: '32%', status: 'Atenção' },
    { setor: 'Enfermaria', taxa: '12.8 Taxa', evitavel: '94,0%', tempo: '50 min', ocupacao: '89%', status: 'Bom' },
    { setor: 'Maternidade', taxa: '14.1 Taxa', evitavel: '92,0%', tempo: '52 min', ocupacao: '89%', status: 'Bom' },
    { setor: 'UTI Adulto', taxa: '13.7 Taxa', evitavel: '93,6%', tempo: '50 min', ocupacao: '43%', status: 'Atenção' },
    { setor: 'Centro Cirúrgico', taxa: '12.4 Taxa', evitavel: '93,3%', tempo: '52 min', ocupacao: '52%', status: 'Crítico' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Crítico':
        return 'bg-red-500';
      case 'Atenção':
        return 'bg-orange-500';
      case 'Bom':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="p-8 bg-[#f5f7fa]">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Incidentes */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-2">Total Incidentes (Mês)</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">{totalIncidentes}</h2>
          <div className="h-12 flex items-center justify-center">
            <svg viewBox="0 0 100 30" className="w-full h-full">
              <path
                d="M 0 15 Q 25 10, 50 12 T 100 8"
                fill="none"
                stroke="#3498db"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Taxa Média / 1K */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-2">Taxa Média / 1K Atendimentos</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">{taxaMedia}</h2>
          <div className="flex items-center justify-center h-12">
            <svg width="80" height="80" viewBox="0 0 100 100" className="transform -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" strokeWidth="12" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#ff6b6b"
                strokeWidth="12"
                strokeDasharray={`${(taxaMedia / 20) * 251.2} 251.2`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Ocupação Média */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-2">Ocupação Média (%)</p>
          <h2 className="text-4xl font-bold text-[#0066cc] mb-3">{ocupacaoMedia}%</h2>
          <div className="flex items-center justify-center h-12">
            <svg width="80" height="80" viewBox="0 0 100 100" className="transform -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" strokeWidth="12" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#0066cc"
                strokeWidth="12"
                strokeDasharray={`${(ocupacaoMedia / 100) * 251.2} 251.2`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Tempo Médio de Resposta */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-2">Tempo Médio de Resposta (min)</p>
          <div className="flex items-end gap-2 mb-3">
            <h2 className="text-4xl font-bold text-gray-900">{tempoResposta}</h2>
            <div className="flex items-center text-green-600 mb-2">
              <ArrowDown className="w-4 h-4" />
            </div>
          </div>
          <div className="h-12 flex items-end gap-1">
            {[40, 55, 50, 48, 52, 45, 42, 52].map((height, i) => (
              <div
                key={i}
                className="flex-1 rounded-t transition-all hover:opacity-80"
                style={{ 
                  height: `${(height / 60) * 100}%`,
                  backgroundColor: height > 50 ? '#ff6b6b' : '#51cf66'
                }}
                title={`${height} min`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Evolução Mensal por Setor */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-lg">📊</span>
            Evolução Mensal por Setor
          </h3>
          <div style={{ height: '300px' }}>
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        {/* Distribuição de Ocorrências por Setor */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-lg">🥧</span>
            Distribuição de Ocorrências por Setor
          </h3>
          <div style={{ height: '300px' }}>
            <Doughnut data={donutData} options={donutOptions} />
          </div>
        </div>
      </div>

      {/* Tabela de Resumo por Setor */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <span className="text-lg">📋</span>
            Resumo por Setor (Último Registro)
          </h3>
          <button className="p-1 hover:bg-gray-100 rounded transition-all">
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  SETOR
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  TAXA/1K ▼
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  % EVITÁVEL
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  TEMPO RESP.
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  OCUPAÇÃO
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {resumoSetores.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.setor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.taxa}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.evitavel}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.tempo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.ocupacao}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)} text-white`}>
                      {item.status}
                    </span>
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

export default Dashboard;