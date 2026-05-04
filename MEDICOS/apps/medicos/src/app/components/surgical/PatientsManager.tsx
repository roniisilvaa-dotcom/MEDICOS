import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Plus, Search, Edit, ShieldAlert } from 'lucide-react';
import { MaskedData } from './MaskedData';
import { Patient } from '../../types';
import { toast } from 'sonner';

export default function PatientsManager() {
  const { data, updateData } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Função para gerar código único do paciente
  const generatePatientCode = (recordNumber: string) => {
    const prefix = 'PAC';
    const year = new Date().getFullYear().toString().slice(-2);
    const hash = recordNumber.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const code = (hash % 10000).toString().padStart(4, '0');
    return `${prefix}${year}${code}`;
  };

  const filteredPatients = data.patients?.filter(p =>
    p.record_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const patient: Patient = {
      id: editingPatient?.id || `p${Date.now()}`,
      record_number: formData.get('record_number') as string,
      full_name: formData.get('full_name') as string,
      cpf: '', // Removido
      date_of_birth: formData.get('date_of_birth') as string,
      gender: formData.get('gender') as any,
      phone: formData.get('phone') as string,
      blood_type: 'O+', // Removido - valor padrão
      allergies: formData.get('allergies') as string,
      medical_history: formData.get('medical_history') as string,
      health_insurance: '', // Removido
      emergency_contact: formData.get('emergency_contact') as string,
      status: formData.get('status') as any
    };

    let updatedPatients;
    if (editingPatient) {
      updatedPatients = data.patients?.map(p => p.id === editingPatient.id ? patient : p) || [];
      toast.success('Paciente atualizado com sucesso');
    } else {
      updatedPatients = [...(data.patients || []), patient];
      toast.success('Paciente cadastrado com sucesso');
    }

    updateData({ patients: updatedPatients });
    setIsDialogOpen(false);
    setEditingPatient(null);
  };

  const statusBadge = (status: string) => {
    const config = {
      ativo: { variant: 'outline' as const, label: 'Ativo', className: 'border-green-500 text-green-700' },
      internado: { variant: 'default' as const, label: 'Internado', className: 'bg-blue-600' },
      alta: { variant: 'secondary' as const, label: 'Alta', className: '' },
      inativo: { variant: 'outline' as const, label: 'Inativo', className: 'border-slate-300 text-slate-500' }
    };
    const c = config[status as keyof typeof config] || config.ativo;
    return <Badge variant={c.variant} className={c.className}>{c.label}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header com Banner LGPD */}
      <Alert className="border-teal-200 bg-teal-50">
        <ShieldAlert className="h-4 w-4 text-teal-600" />
        <AlertDescription className="text-teal-800">
          <strong>Proteção de Dados (LGPD):</strong> Dados sensíveis (Nome, Telefone, Contato de Emergência) são mascarados por padrão. Use o código gerado (PAC) ou número de prontuário como identificador público.
        </AlertDescription>
      </Alert>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Pacientes</h2>
          <p className="text-slate-600 mt-1">Gerenciamento de pacientes do Centro Cirúrgico</p>
        </div>
        <Button onClick={() => { setEditingPatient(null); setIsDialogOpen(true); }} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Paciente
        </Button>
      </div>

      {/* Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar por prontuário ou nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes ({filteredPatients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Prontuário</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs bg-blue-50 border-blue-300">
                        {generatePatientCode(patient.record_number)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{patient.record_number}</TableCell>
                    <TableCell><MaskedData value={patient.full_name} type="text" /></TableCell>
                    <TableCell>{statusBadge(patient.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => { setEditingPatient(patient); setIsDialogOpen(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPatient ? 'Editar Paciente' : 'Novo Paciente'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="record_number">Prontuário *</Label>
                <Input id="record_number" name="record_number" required defaultValue={editingPatient?.record_number} />
              </div>
              <div>
                <Label htmlFor="full_name">Nome Completo *</Label>
                <Input id="full_name" name="full_name" required defaultValue={editingPatient?.full_name} />
              </div>
              <div>
                <Label htmlFor="date_of_birth">Data de Nascimento *</Label>
                <Input id="date_of_birth" name="date_of_birth" type="date" required defaultValue={editingPatient?.date_of_birth} />
              </div>
              <div>
                <Label htmlFor="gender">Gênero *</Label>
                <Select name="gender" defaultValue={editingPatient?.gender || 'masculino'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="phone">Telefone *</Label>
                <Input id="phone" name="phone" required defaultValue={editingPatient?.phone} />
              </div>
              <div>
                <Label htmlFor="emergency_contact">Contato de Emergência *</Label>
                <Input id="emergency_contact" name="emergency_contact" required defaultValue={editingPatient?.emergency_contact} />
              </div>
              <div>
                <Label htmlFor="status">Status *</Label>
                <Select name="status" defaultValue={editingPatient?.status || 'ativo'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="internado">Internado</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="allergies">Alergias</Label>
                <Input id="allergies" name="allergies" defaultValue={editingPatient?.allergies} />
              </div>
              <div className="col-span-2">
                <Label htmlFor="medical_history">Histórico Médico</Label>
                <Input id="medical_history" name="medical_history" defaultValue={editingPatient?.medical_history} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700">Salvar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}