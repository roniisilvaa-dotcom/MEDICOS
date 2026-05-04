import React from 'react';
import { exportData } from '../utils/storage';
import { Download, Database, FileJson } from 'lucide-react';
import { toast } from 'sonner';

const BackupView: React.FC = () => {
  const handleExport = () => {
    try {
      const jsonData = exportData();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
      
      link.href = url;
      link.download = `isac_backup_${dateStr}_${timeStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Backup exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar backup');
      console.error(error);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2" style={{ color: '#0a2b3e' }}>Backup de Dados</h1>
        <p className="text-gray-600">Exportar dados do sistema em formato JSON</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-4">
              <Database className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl mb-2" style={{ color: '#0a2b3e' }}>Exportar Backup</h2>
            <p className="text-gray-600">
              Faça backup de todos os dados do sistema, incluindo usuários, setores e histórico de incidentes.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <FileJson className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm text-blue-800 mb-1">Informações do Backup</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Formato: JSON</li>
                  <li>• Inclui: Usuários, Setores, Incidentes e Histórico</li>
                  <li>• Armazenamento: Local (navegador)</li>
                  <li>• Recomendação: Realizar backup mensalmente</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-lg text-white transition-all duration-200 hover:shadow-lg"
            style={{ backgroundColor: '#1e6a8f' }}
          >
            <Download className="w-5 h-5" />
            <span className="text-lg">Exportar Backup</span>
          </button>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm mb-3" style={{ color: '#0a2b3e' }}>Observações Importantes</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>O arquivo exportado contém todos os dados armazenados localmente no navegador.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Guarde o arquivo em local seguro como backup de recuperação.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Senhas são exportadas no formato original - mantenha o arquivo seguro.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupView;
