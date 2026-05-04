import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calendar, Clock, User, Plus, X, Edit, Trash2, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { toast } from 'sonner';

export default function SchedulingManager() {
  const { data, updateData } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    ordem: '',
    data: '',
    sala_operatoria: '',
    especialidade: '',
    prontuario: '',
    iniciais_paciente: '',
    data_nascimento: '',
    procedimento: '',
    tipo_cirurgia: 'eletiva',
    nivel_contaminacao: 'limpa',
    cirurgiao: '',
    auxiliar: '',
    anestesista: '',
    tipo_anestesia: 'geral',
    enfermeira: '',
    instrumentadora: '',
    circulante: '',
    status: 'agendada',
    hora_inicio: '',
    hora_fim: '',
    duracao_estimada_min: '',
    observacoes: ''
  });

  const salas = data.operatingRooms?.filter(r => r.tipo === 'transoperatorio').map(r => r.name) || [];
  const cirurgioes = data.medicalStaff?.filter(s => s.role === 'cirurgiao').map(s => s.full_name) || [];
  const anestesistas = data.medicalStaff?.filter(s => s.role === 'anestesista').map(s => s.full_name) || [];
  const enfermeiros = data.medicalStaff?.filter(s => s.role === 'enfermeiro').map(s => s.full_name) || [];
  const tecnicos = data.medicalStaff?.filter(s => ['instrumentador', 'tecnico_enfermagem'].includes(s.role)).map(s => s.full_name) || [];

  const resetForm = () => {
    setFormData({
      ordem: '',
      data: '',
      sala_operatoria: '',
      especialidade: '',
      prontuario: '',
      iniciais_paciente: '',
      data_nascimento: '',
      procedimento: '',
      tipo_cirurgia: 'eletiva',
      nivel_contaminacao: 'limpa',
      cirurgiao: '',
      auxiliar: '',
      anestesista: '',
      tipo_anestesia: 'geral',
      enfermeira: '',
      instrumentadora: '',
      circulante: '',
      status: 'agendada',
      hora_inicio: '',
      hora_fim: '',
      duracao_estimada_min: '',
      observacoes: ''
    });
    setEditingId(null);
  };

  const handleOpenDialog = (surgery?: any) => {
    if (surgery) {
      setFormData({
        ordem: surgery.ordem?.toString() || '',
        data: surgery.data || '',
        sala_operatoria: surgery.sala_operatoria || '',
        especialidade: surgery.especialidade || '',
        prontuario: surgery.prontuario || '',
        iniciais_paciente: surgery.iniciais_paciente || '',
        data_nascimento: surgery.data_nascimento || '',
        procedimento: surgery.procedimento || '',
        tipo_cirurgia: surgery.tipo_cirurgia || 'eletiva',
        nivel_contaminacao: surgery.nivel_contaminacao || 'limpa',
        cirurgiao: surgery.cirurgiao || '',
        auxiliar: surgery.auxiliar || '',
        anestesista: surgery.anestesista || '',
        tipo_anestesia: surgery.tipo_anestesia || 'geral',
        enfermeira: surgery.enfermeira || '',
        instrumentadora: surgery.instrumentadora || '',
        circulante: surgery.circulante || '',
        status: surgery.status || 'agendada',
        hora_inicio: surgery.hora_inicio || '',
        hora_fim: surgery.hora_fim || '',
        duracao_estimada_min: surgery.duracao_estimada_min?.toString() || '',
        observacoes: surgery.observacoes || ''
      });
      setEditingId(surgery.id);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSurgery = {
      id: editingId || `surg${Date.now()}`,
      ordem: parseInt(formData.ordem) || 0,
      data: formData.data,
      sala_operatoria: formData.sala_operatoria,
      especialidade: formData.especialidade,
      prontuario: formData.prontuario,
      iniciais_paciente: formData.iniciais_paciente,
      data_nascimento: formData.data_nascimento,
      procedimento: formData.procedimento,
      tipo_cirurgia: formData.tipo_cirurgia,
      nivel_contaminacao: formData.nivel_contaminacao,
      cirurgiao: formData.cirurgiao,
      auxiliar: formData.auxiliar,
      anestesista: formData.anestesista,
      tipo_anestesia: formData.tipo_anestesia,
      enfermeira: formData.enfermeira,
      instrumentadora: formData.instrumentadora,
      circulante: formData.circulante,
      status: formData.status,
      hora_inicio: formData.hora_inicio,
      hora_fim: formData.hora_fim,
      duracao_estimada_min: parseInt(formData.duracao_estimada_min) || 0,
      observacoes: formData.observacoes
    };

    const updatedSurgeries = editingId
      ? data.surgeries.map(s => s.id === editingId ? newSurgery : s)
      : [...data.surgeries, newSurgery];

    updateData({ surgeries: updatedSurgeries });
    toast.success(editingId ? 'Cirurgia atualizada com sucesso!' : 'Cirurgia agendada com sucesso!');
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      const updatedSurgeries = data.surgeries.filter(s => s.id !== id);
      updateData({ surgeries: updatedSurgeries });
      toast.success('Agendamento excluído com sucesso!');
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      agendada: { variant: 'outline' as const, label: 'Agendada', className: 'border-[#1e6a8f] text-[#1e6a8f]' },
      em_andamento: { variant: 'default' as const, label: 'Em Andamento', className: 'bg-[#1e6a8f]' },
      em_preparacao: { variant: 'outline' as const, label: 'Em Preparação', className: 'border-blue-500 text-blue-700' },
      concluida: { variant: 'secondary' as const, label: 'Concluída', className: 'bg-green-600 text-white' },
      cancelada: { variant: 'destructive' as const, label: 'Cancelada' }
    };
    const c = config[status as keyof typeof config] || config.agendada;
    return <Badge variant={c.variant} className={c.className}>{c.label}</Badge>;
  };

  const getTipoBadge = (tipo: string) => {
    const config = {
      eletiva: { variant: 'outline' as const, label: 'Eletiva', className: 'border-[#0a2b3e] text-[#0a2b3e]' },
      urgencia: { variant: 'default' as const, label: 'Urgência', className: 'bg-amber-600' },
      emergencia: { variant: 'destructive' as const, label: 'Emergência' }
    };
    const c = config[tipo as keyof typeof config] || config.eletiva;
    return <Badge variant={c.variant} className={c.className}>{c.label}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0a2b3e]">Agendamento de Cirurgias</h2>
          <p className="text-gray-600 mt-1">Gestão completa de agendamentos cirúrgicos</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-[#1e6a8f] hover:bg-[#0a2b3e]">
          <Plus className="h-4 w-4 mr-2" />
          Nova Cirurgia
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {data.surgeries?.sort((a, b) => {
          const dateCompare = new Date(b.data).getTime() - new Date(a.data).getTime();
          if (dateCompare !== 0) return dateCompare;
          return (b.ordem || 0) - (a.ordem || 0);
        }).map(surgery => (
          <Card key={surgery.id} className="border-l-4 border-l-[#1e6a8f]">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-bold text-[#0a2b3e]">#{surgery.ordem}</span>
                    <h3 className="text-lg font-semibold text-gray-900">{surgery.procedimento}</h3>
                  </div>
                  <p className="text-sm text-gray-600">Paciente: {surgery.iniciais_paciente} - Prontuário: {surgery.prontuario}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getTipoBadge(surgery.tipo_cirurgia)}
                  {getStatusBadge(surgery.status)}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenDialog(surgery)}
                    className="border-[#1e6a8f] text-[#1e6a8f] hover:bg-[#1e6a8f] hover:text-white"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(surgery.id)}
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4 text-[#1e6a8f]" />
                  <span>{new Date(surgery.data).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4 text-[#1e6a8f]" />
                  <span>{surgery.hora_inicio} - {surgery.hora_fim}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="h-4 w-4 text-[#1e6a8f]" />
                  <span>{surgery.cirurgiao}</span>
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">Sala:</span> {surgery.sala_operatoria}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm bg-gray-50 p-3 rounded-lg">
                <div>
                  <span className="text-gray-600">Especialidade:</span>
                  <span className="ml-2 font-medium text-gray-900">{surgery.especialidade}</span>
                </div>
                <div>
                  <span className="text-gray-600">Anestesista:</span>
                  <span className="ml-2 font-medium text-gray-900">{surgery.anestesista}</span>
                </div>
                <div>
                  <span className="text-gray-600">Tipo Anestesia:</span>
                  <span className="ml-2 font-medium text-gray-900 capitalize">{surgery.tipo_anestesia}</span>
                </div>
                <div>
                  <span className="text-gray-600">Enfermeira:</span>
                  <span className="ml-2 font-medium text-gray-900">{surgery.enfermeira}</span>
                </div>
                <div>
                  <span className="text-gray-600">Instrumentadora:</span>
                  <span className="ml-2 font-medium text-gray-900">{surgery.instrumentadora}</span>
                </div>
                <div>
                  <span className="text-gray-600">Duração:</span>
                  <span className="ml-2 font-medium text-gray-900">{surgery.duracao_estimada_min} min</span>
                </div>
              </div>

              {surgery.observacoes && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Observações:</span> {surgery.observacoes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de Cadastro/Edição */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#0a2b3e]">
              {editingId ? 'Editar Cirurgia' : 'Agendar Nova Cirurgia'}
            </DialogTitle>
            <DialogDescription>
              {editingId ? 'Atualize as informações da cirurgia agendada.' : 'Preencha os dados para agendar uma nova cirurgia.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#0a2b3e] border-b pb-2">Informações Básicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="ordem">Ordem *</Label>
                  <Input
                    id="ordem"
                    type="number"
                    value={formData.ordem}
                    onChange={(e) => setFormData({ ...formData, ordem: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="data">Data *</Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sala">Sala Operatória *</Label>
                  <select
                    id="sala"
                    className="w-full h-10 px-3 rounded-md border border-gray-300"
                    value={formData.sala_operatoria}
                    onChange={(e) => setFormData({ ...formData, sala_operatoria: e.target.value })}
                    required
                  >
                    <option value="">Selecione...</option>
                    {salas.map(sala => (
                      <option key={sala} value={sala}>{sala}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hora_inicio">Hora Início *</Label>
                  <Input
                    id="hora_inicio"
                    type="time"
                    value={formData.hora_inicio}
                    onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="hora_fim">Hora Fim *</Label>
                  <Input
                    id="hora_fim"
                    type="time"
                    value={formData.hora_fim}
                    onChange={(e) => setFormData({ ...formData, hora_fim: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Informações do Paciente */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#0a2b3e] border-b pb-2">Informações do Paciente</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="prontuario">Prontuário *</Label>
                  <Input
                    id="prontuario"
                    value={formData.prontuario}
                    onChange={(e) => setFormData({ ...formData, prontuario: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="iniciais">Iniciais do Paciente *</Label>
                  <Input
                    id="iniciais"
                    value={formData.iniciais_paciente}
                    onChange={(e) => setFormData({ ...formData, iniciais_paciente: e.target.value })}
                    placeholder="Ex: M.S.S."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="data_nascimento">Data de Nascimento *</Label>
                  <Input
                    id="data_nascimento"
                    type="date"
                    value={formData.data_nascimento}
                    onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Informações Cirúrgicas */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#0a2b3e] border-b pb-2">Informações Cirúrgicas</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="procedimento">Procedimento *</Label>
                  <Input
                    id="procedimento"
                    value={formData.procedimento}
                    onChange={(e) => setFormData({ ...formData, procedimento: e.target.value })}
                    placeholder="Ex: Colecistectomia Videolaparoscópica"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="especialidade">Especialidade *</Label>
                  <Input
                    id="especialidade"
                    value={formData.especialidade}
                    onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                    placeholder="Ex: Cirurgia Geral"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="tipo_cirurgia">Tipo de Cirurgia *</Label>
                  <select
                    id="tipo_cirurgia"
                    className="w-full h-10 px-3 rounded-md border border-gray-300"
                    value={formData.tipo_cirurgia}
                    onChange={(e) => setFormData({ ...formData, tipo_cirurgia: e.target.value })}
                    required
                  >
                    <option value="eletiva">Eletiva</option>
                    <option value="urgencia">Urgência</option>
                    <option value="emergencia">Emergência</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="nivel_contaminacao">Nível de Contaminação *</Label>
                  <select
                    id="nivel_contaminacao"
                    className="w-full h-10 px-3 rounded-md border border-gray-300"
                    value={formData.nivel_contaminacao}
                    onChange={(e) => setFormData({ ...formData, nivel_contaminacao: e.target.value })}
                    required
                  >
                    <option value="limpa">Limpa</option>
                    <option value="potencialmente_contaminada">Potencialmente Contaminada</option>
                    <option value="contaminada">Contaminada</option>
                    <option value="infectada">Infectada</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="duracao">Duração Estimada (min) *</Label>
                  <Input
                    id="duracao"
                    type="number"
                    value={formData.duracao_estimada_min}
                    onChange={(e) => setFormData({ ...formData, duracao_estimada_min: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Equipe */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#0a2b3e] border-b pb-2">Equipe Cirúrgica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cirurgiao">Cirurgião *</Label>
                  <select
                    id="cirurgiao"
                    className="w-full h-10 px-3 rounded-md border border-gray-300"
                    value={formData.cirurgiao}
                    onChange={(e) => setFormData({ ...formData, cirurgiao: e.target.value })}
                    required
                  >
                    <option value="">Selecione...</option>
                    {cirurgioes.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="auxiliar">Auxiliar</Label>
                  <Input
                    id="auxiliar"
                    value={formData.auxiliar}
                    onChange={(e) => setFormData({ ...formData, auxiliar: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="anestesista">Anestesista *</Label>
                  <select
                    id="anestesista"
                    className="w-full h-10 px-3 rounded-md border border-gray-300"
                    value={formData.anestesista}
                    onChange={(e) => setFormData({ ...formData, anestesista: e.target.value })}
                    required
                  >
                    <option value="">Selecione...</option>
                    {anestesistas.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="tipo_anestesia">Tipo de Anestesia *</Label>
                  <select
                    id="tipo_anestesia"
                    className="w-full h-10 px-3 rounded-md border border-gray-300"
                    value={formData.tipo_anestesia}
                    onChange={(e) => setFormData({ ...formData, tipo_anestesia: e.target.value })}
                    required
                  >
                    <option value="geral">Geral</option>
                    <option value="raquidiana">Raquidiana</option>
                    <option value="peridural">Peridural</option>
                    <option value="local">Local</option>
                    <option value="sedacao">Sedação</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="enfermeira">Enfermeira *</Label>
                  <select
                    id="enfermeira"
                    className="w-full h-10 px-3 rounded-md border border-gray-300"
                    value={formData.enfermeira}
                    onChange={(e) => setFormData({ ...formData, enfermeira: e.target.value })}
                    required
                  >
                    <option value="">Selecione...</option>
                    {enfermeiros.map(e => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="instrumentadora">Instrumentadora *</Label>
                  <select
                    id="instrumentadora"
                    className="w-full h-10 px-3 rounded-md border border-gray-300"
                    value={formData.instrumentadora}
                    onChange={(e) => setFormData({ ...formData, instrumentadora: e.target.value })}
                    required
                  >
                    <option value="">Selecione...</option>
                    {tecnicos.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="circulante">Circulante</Label>
                  <Input
                    id="circulante"
                    value={formData.circulante}
                    onChange={(e) => setFormData({ ...formData, circulante: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <select
                    id="status"
                    className="w-full h-10 px-3 rounded-md border border-gray-300"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                  >
                    <option value="agendada">Agendada</option>
                    <option value="em_preparacao">Em Preparação</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="concluida">Concluída</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Observações */}
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <textarea
                id="observacoes"
                className="w-full min-h-[80px] px-3 py-2 rounded-md border border-gray-300"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Informações adicionais sobre a cirurgia..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#1e6a8f] hover:bg-[#0a2b3e]">
                <Save className="h-4 w-4 mr-2" />
                {editingId ? 'Atualizar' : 'Agendar'} Cirurgia
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}