import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle, XCircle, Plus, Trash2, Calendar as CalendarIcon, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { toast } from 'sonner';

export default function TeamDimensioning() {
  const { data, updateData } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    staff_id: '',
    date: selectedDate,
    shift: 'manha',
    status: 'confirmado'
  });

  const todaySchedule = data.shiftSchedule?.filter(s => s.date === selectedDate) || [];
  const availableStaff = data.medicalStaff || [];

  // Cobertura mínima necessária
  const minCoverage = {
    cirurgiao: 2,
    anestesista: 2,
    enfermeiro: 3,
    instrumentador: 2,
    auxiliar: 1
  };

  const getShiftCoverage = (shift: 'manha' | 'tarde' | 'noite') => {
    const shiftSchedule = todaySchedule.filter(s => s.shift === shift);
    const coverage = {
      cirurgiao: shiftSchedule.filter(s => s.role === 'cirurgiao').length,
      anestesista: shiftSchedule.filter(s => s.role === 'anestesista').length,
      enfermeiro: shiftSchedule.filter(s => s.role === 'enfermeiro').length,
      instrumentador: shiftSchedule.filter(s => s.role === 'instrumentador').length,
      auxiliar: shiftSchedule.filter(s => s.role === 'auxiliar').length
    };

    const isCompliant = Object.entries(coverage).every(
      ([role, count]) => count >= minCoverage[role as keyof typeof minCoverage]
    );

    return { coverage, isCompliant };
  };

  const handleAddToSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    
    const staff = availableStaff.find(s => s.id === formData.staff_id);
    if (!staff) {
      toast.error('Selecione um profissional válido');
      return;
    }

    // Verificar se já está escalado nesta data e turno
    const alreadyScheduled = data.shiftSchedule.some(
      s => s.staff_id === formData.staff_id && s.date === formData.date && s.shift === formData.shift
    );

    if (alreadyScheduled) {
      toast.error('Este profissional já está escalado neste turno');
      return;
    }

    const newSchedule = {
      id: `schedule${Date.now()}`,
      staff_id: formData.staff_id,
      staff_name: staff.full_name,
      role: staff.role,
      date: formData.date,
      shift: formData.shift,
      status: formData.status
    };

    updateData({ shiftSchedule: [...data.shiftSchedule, newSchedule] });
    toast.success(`${staff.full_name} adicionado à escala!`);
    setIsDialogOpen(false);
    setFormData({
      staff_id: '',
      date: selectedDate,
      shift: 'manha',
      status: 'confirmado'
    });
  };

  const handleRemoveFromSchedule = (scheduleId: string) => {
    if (confirm('Deseja remover este profissional da escala?')) {
      const updatedSchedule = data.shiftSchedule.filter(s => s.id !== scheduleId);
      updateData({ shiftSchedule: updatedSchedule });
      toast.success('Profissional removido da escala');
    }
  };

  const shifts = [
    { id: 'manha', label: 'Manhã', time: '07:00 - 13:00' },
    { id: 'tarde', label: 'Tarde', time: '13:00 - 19:00' },
    { id: 'noite', label: 'Noite', time: '19:00 - 07:00' }
  ];

  const roles = [
    { id: 'cirurgiao', label: 'Cirurgiões' },
    { id: 'anestesista', label: 'Anestesistas' },
    { id: 'enfermeiro', label: 'Enfermeiros' },
    { id: 'instrumentador', label: 'Instrumentadores' },
    { id: 'auxiliar', label: 'Auxiliares' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0a2b3e]">Dimensionamento de Equipe</h2>
          <p className="text-gray-600 mt-1">Controle de escalas e cobertura mínima por turno</p>
        </div>
        <Button 
          onClick={() => setIsDialogOpen(true)} 
          className="bg-[#1e6a8f] hover:bg-[#0a2b3e]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar à Escala
        </Button>
      </div>

      {/* Seletor de Data */}
      <Card className="border-[#1e6a8f]">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label htmlFor="date-select" className="text-base font-semibold text-[#0a2b3e] flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Data da Escala:
            </Label>
            <Input
              id="date-select"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="max-w-xs"
            />
            <span className="text-sm text-gray-600">
              ({todaySchedule.length} profissionais escalados)
            </span>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-[#1e6a8f] bg-blue-50">
        <AlertDescription className="text-[#0a2b3e]">
          <strong>Cobertura Mínima por Turno:</strong> 2 Cirurgiões, 2 Anestesistas, 3 Enfermeiros, 2 Instrumentadores, 1 Auxiliar
        </AlertDescription>
      </Alert>

      {shifts.map(shift => {
        const { coverage, isCompliant } = getShiftCoverage(shift.id as any);
        const shiftStaff = todaySchedule.filter(s => s.shift === shift.id);
        
        return (
          <Card key={shift.id} className="border-l-4" style={{ borderLeftColor: isCompliant ? '#10b981' : '#ef4444' }}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>
                  <span className="text-lg text-[#0a2b3e]">{shift.label}</span>
                  <span className="text-sm text-gray-500 ml-2">({shift.time})</span>
                </div>
                {isCompliant ? (
                  <Badge className="bg-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Conforme
                  </Badge>
                ) : (
                  <Badge className="bg-red-600">
                    <XCircle className="h-3 w-3 mr-1" />
                    Insuficiente
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Grid de Cobertura */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {roles.map(role => {
                  const current = coverage[role.id as keyof typeof coverage];
                  const required = minCoverage[role.id as keyof typeof minCoverage];
                  const isSufficient = current >= required;
                  
                  return (
                    <div 
                      key={role.id} 
                      className={`p-3 rounded-lg border-2 ${
                        isSufficient 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="text-xs text-gray-600 mb-1">{role.label}</div>
                      <div className={`text-xl font-bold ${isSufficient ? 'text-green-600' : 'text-red-600'}`}>
                        {current} / {required}
                      </div>
                      {!isSufficient && (
                        <div className="text-xs text-red-600 mt-1">Faltam {required - current}</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Lista de profissionais escalados */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-[#0a2b3e] mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Profissionais Escalados ({shiftStaff.length})
                </h4>
                <div className="space-y-2">
                  {shiftStaff.map(schedule => (
                    <div 
                      key={schedule.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1e6a8f] flex items-center justify-center text-white font-semibold">
                          {schedule.staff_name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{schedule.staff_name}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {schedule.role.charAt(0).toUpperCase() + schedule.role.slice(1)}
                          </Badge>
                          <div className="text-xs text-gray-500 mt-1">
                            Status: {schedule.status === 'confirmado' ? 'Confirmado' : schedule.status}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveFromSchedule(schedule.id)}
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {shiftStaff.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Nenhum profissional escalado para este turno</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Dialog de Adicionar à Escala */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#0a2b3e]">
              Adicionar Profissional à Escala
            </DialogTitle>
            <DialogDescription>
              Selecione o profissional, turno e data para adicionar à escala.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddToSchedule} className="space-y-4">
            <div>
              <Label htmlFor="staff">Profissional *</Label>
              <select
                id="staff"
                className="w-full h-10 px-3 rounded-md border border-gray-300"
                value={formData.staff_id}
                onChange={(e) => setFormData({ ...formData, staff_id: e.target.value })}
                required
              >
                <option value="">Selecione...</option>
                {availableStaff.map(staff => (
                  <option key={staff.id} value={staff.id}>
                    {staff.full_name} - {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="date">Data *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="shift">Turno *</Label>
              <select
                id="shift"
                className="w-full h-10 px-3 rounded-md border border-gray-300"
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                required
              >
                <option value="manha">Manhã (07:00 - 13:00)</option>
                <option value="tarde">Tarde (13:00 - 19:00)</option>
                <option value="noite">Noite (19:00 - 07:00)</option>
              </select>
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
                <option value="confirmado">Confirmado</option>
                <option value="pendente">Pendente</option>
                <option value="ausente">Ausente</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#1e6a8f] hover:bg-[#0a2b3e]">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
