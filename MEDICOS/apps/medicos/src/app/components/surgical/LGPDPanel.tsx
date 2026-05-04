import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Shield, CheckCircle, XCircle, FileText } from 'lucide-react';

export default function LGPDPanel() {
  const { data } = useAuth();

  const totalConsents = data.lgpdConsents?.length || 0;
  const acceptedConsents = data.lgpdConsents?.filter(c => c.accepted).length || 0;
  const revokedConsents = totalConsents - acceptedConsents;

  const consentTypeBadge = (type: string) => {
    const config = {
      tratamento_dados: { label: 'Tratamento de Dados' },
      compartilhamento: { label: 'Compartilhamento' },
      pesquisa: { label: 'Pesquisa' },
      marketing: { label: 'Marketing' }
    };
    return <Badge variant="outline">{config[type as keyof typeof config]?.label || type}</Badge>;
  };

  const bases = [
    {
      article: 'Art. 7º, I',
      description: 'Consentimento do titular',
      use: 'Tratamento de dados pessoais para finalidades específicas'
    },
    {
      article: 'Art. 11',
      description: 'Dados sensíveis',
      use: 'Dados de saúde exigem consentimento específico e destacado'
    },
    {
      article: 'Art. 14',
      description: 'Dados de crianças e adolescentes',
      use: 'Tratamento com consentimento de um dos pais ou responsável legal'
    },
    {
      article: 'Art. 46',
      description: 'Responsabilidade e segurança',
      use: 'Adoção de medidas de segurança, técnicas e administrativas'
    }
  ];

  const practices = [
    'Usar o número de prontuário como identificador público principal',
    'Mascarar dados sensíveis (nome, CPF, telefone) por padrão',
    'Coletar consentimento específico para cada finalidade de tratamento',
    'Permitir revogação do consentimento a qualquer momento',
    'Manter registro de todos os consentimentos coletados',
    'Realizar backup regular dos dados com criptografia',
    'Definir período de retenção de dados conforme legislação',
    'Treinar equipe sobre proteção de dados e LGPD'
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Shield className="h-6 w-6 text-teal-600" />
          Painel LGPD
        </h2>
        <p className="text-slate-600 mt-1">Gestão de consentimentos e conformidade com a Lei Geral de Proteção de Dados</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600">{totalConsents}</div>
              <div className="text-sm text-slate-600 mt-1">Total de Consentimentos</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{acceptedConsents}</div>
              <div className="text-sm text-slate-600 mt-1">Aceitos</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{revokedConsents}</div>
              <div className="text-sm text-slate-600 mt-1">Revogados</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bases Legais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-teal-600" />
            Bases Legais da LGPD
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bases.map((base, idx) => (
              <div key={idx} className="border-l-4 border-l-teal-500 bg-teal-50 p-4 rounded">
                <div className="font-semibold text-teal-900">{base.article}</div>
                <div className="text-teal-800 mt-1">{base.description}</div>
                <div className="text-sm text-teal-700 mt-2">{base.use}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Consentimentos */}
      <Card>
        <CardHeader>
          <CardTitle>Registro de Consentimentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prontuário</TableHead>
                  <TableHead>Tipo de Consentimento</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Coletado Por</TableHead>
                  <TableHead>Observações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.lgpdConsents?.map(consent => (
                  <TableRow key={consent.id}>
                    <TableCell className="font-mono">{consent.record_number}</TableCell>
                    <TableCell>{consentTypeBadge(consent.consent_type)}</TableCell>
                    <TableCell>{new Date(consent.consent_date).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      {consent.accepted ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Aceito
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          <XCircle className="h-3 w-3 mr-1" />
                          Revogado
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{consent.collected_by}</TableCell>
                    <TableCell className="text-xs text-slate-600">{consent.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Boas Práticas */}
      <Card>
        <CardHeader>
          <CardTitle>Boas Práticas Obrigatórias</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {practices.map((practice, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">{practice}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
