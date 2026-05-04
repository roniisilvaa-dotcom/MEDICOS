import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { MedicalStaff } from '../../types';
import { toast } from 'sonner';

export default function MedicalTeamManager() {
  const { data, updateData } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<MedicalStaff | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const staff: MedicalStaff = {
      id: editingStaff?.id || `ms${Date.now()}`,
      full_name: formData.get('full_name') as string,
      role: formData.get('role') as any,
      crm_coren: formData.get('crm_coren') as string,
      specialty: formData.get('specialty') as string,
      shift: formData.get('shift') as any,
      availability_status: formData.get('availability_status') as any,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string
    };

    let updatedStaff;
    if (editingStaff) {
      updatedStaff = data.medicalStaff?.map(s => s.id === editingStaff.id ? staff : s) || [];
      toast.success('Profissional atualizado com sucesso');
    } else {
      updatedStaff = [...(data.medicalStaff || []), staff];
      toast.success('Profissional cadastrado com sucesso');
    }

    updateData({ medicalStaff: updatedStaff });
    setIsDialogOpen(false);
    setEditingStaff(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este profissional?')) {
      const updatedStaff = data.medicalStaff?.filter(s => s.id !== id) || [];
      updateData({ medicalStaff: updatedStaff });
      toast.success('Profissional excluído');
    }
  };

  const availabilityBadge = (status: string) => {
    const config = {
      disponivel: { variant: 'outline' as const, label: 'Disponível', className: 'border-green-500 text-green-700' },
      em_cirurgia: { variant: 'default' as const, label: 'Em Cirurgia', className: 'bg-red-600' },
      indisponivel: { variant: 'outline' as const, label: 'Indisponível', className: 'border-slate-400 text-slate-600' },
      ferias: { variant: 'secondary' as const, label: 'Férias', className: '' },
      plantao: { variant: 'default' as const, label: 'Plantão', className: 'bg-blue-600' }
    };
    const c = config[status as keyof typeof config] || config.disponivel;
    return <Badge variant={c.variant} className={c.className}>{c.label}</Badge>;
  };

  const shiftBadge = (shift: string) => {
    const config = {
      manha: { label: 'Manhã' },
      tarde: { label: 'Tarde' },
      noite: { label: 'Noite' },
      integral: { label: 'Integral' }
    };
    return <Badge variant="outline">{config[shift as keyof typeof config]?.label || shift}</Badge>;
  };

  const roleBadge = (role: string) => {
    const config = {
      cirurgiao: { label: 'Cirurgião', className: 'bg-teal-100 text-teal-800' },
      anestesista: { label: 'Anestesista', className: 'bg-purple-100 text-purple-800' },
      enfermeiro: { label: 'Enfermeiro', className: 'bg-blue-100 text-blue-800' },
      instrumentador: { label: 'Instrumentador', className: 'bg-green-100 text-green-800' },
      auxiliar: { label: 'Auxiliar', className: 'bg-amber-100 text-amber-800' }
    };
    const c = config[role as keyof typeof config] || config.auxiliar;
    return <Badge className={c.className}>{c.label}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Equipe Médica</h2>
          <p className="text-slate-600 mt-1">Gerenciamento de profissionais do Centro Cirúrgico</p>
        </div>
        <Button 
          onClick={() => { 
            setEditingStaff(null); 
            setIsDialogOpen(true); 
          }} 
          className="bg-teal-600 hover:bg-teal-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Profissional
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profissionais Cadastrados ({data.medicalStaff?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>CRM/COREN</TableHead>
                  <TableHead>Especialidade</TableHead>
                  <TableHead>Turno</TableHead>
                  <TableHead>Disponibilidade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.medicalStaff?.map(staff => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">{staff.full_name}</TableCell>
                    <TableCell>{roleBadge(staff.role)}</TableCell>
                    <TableCell>{staff.crm_coren}</TableCell>
                    <TableCell>{staff.specialty}</TableCell>
                    <TableCell>{shiftBadge(staff.shift)}</TableCell>
                    <TableCell>{availabilityBadge(staff.availability_status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => { 
                            setEditingStaff(staff); 
                            setIsDialogOpen(true); 
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(staff.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingStaff ? 'Editar Profissional' : 'Novo Profissional'}</DialogTitle>
            <DialogDescription>
              {editingStaff ? 'Atualize as informações do profissional.' : 'Preencha as informações do novo profissional.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Nome Completo *</Label>
                <Input id="full_name" name="full_name" defaultValue={editingStaff?.full_name} required />
              </div>
              <div>
                <Label htmlFor="role">Função *</Label>
                <Select name="role" defaultValue={editingStaff?.role || 'enfermeiro'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cirurgiao">Cirurgião</SelectItem>
                    <SelectItem value="anestesista">Anestesista</SelectItem>
                    <SelectItem value="enfermeiro">Enfermeiro</SelectItem>
                    <SelectItem value="instrumentador">Instrumentador</SelectItem>
                    <SelectItem value="auxiliar">Auxiliar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="crm_coren">CRM/COREN *</Label>
                <Input id="crm_coren" name="crm_coren" defaultValue={editingStaff?.crm_coren} required />
              </div>
              <div>
                <Label htmlFor="specialty">Especialidade *</Label>
                <Input id="specialty" name="specialty" defaultValue={editingStaff?.specialty} required />
              </div>
              <div>
                <Label htmlFor="shift">Turno *</Label>
                <Select name="shift" defaultValue={editingStaff?.shift || 'manha'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manha">Manhã</SelectItem>
                    <SelectItem value="tarde">Tarde</SelectItem>
                    <SelectItem value="noite">Noite</SelectItem>
                    <SelectItem value="integral">Integral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="availability_status">Disponibilidade *</Label>
                <Select name="availability_status" defaultValue={editingStaff?.availability_status || 'disponivel'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponivel">Disponível</SelectItem>
                    <SelectItem value="em_cirurgia">Em Cirurgia</SelectItem>
                    <SelectItem value="indisponivel">Indisponível</SelectItem>
                    <SelectItem value="ferias">Férias</SelectItem>
                    <SelectItem value="plantao">Plantão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="phone">Telefone *</Label>
                <Input id="phone" name="phone" defaultValue={editingStaff?.phone} required />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" defaultValue={editingStaff?.email} required />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                {editingStaff ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}