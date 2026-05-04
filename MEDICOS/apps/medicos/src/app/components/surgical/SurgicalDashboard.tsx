import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Calendar, Users, AlertTriangle, BedDouble, Stethoscope, 
  HeartPulse, Home, CheckCircle, Activity, Clock, X 
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

export default function SurgicalDashboard() {
  const { data } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  
  const today = format(new Date(), 'yyyy-MM-dd');
  
  // Cirurgias de hoje
  const todaySurgeries = data.surgeries?.filter(s => s.data === today) || [];
  
  // Organizar as salas por tipo
  const preOperatoryRooms = data.operatingRooms?.filter(r => r.tipo === 'pre_operatorio') || [];
  const surgicalRooms = data.operatingRooms?.filter(r => r.tipo === 'transoperatorio') || [];
  const rpaRooms = data.operatingRooms?.filter(r => r.tipo === 'rpa') || [];
  const postOpRooms = data.operatingRooms?.filter(r => r.tipo === 'pos_operatorio') || [];
  
  // Contar salas por status
  const roomsAvailable = data.operatingRooms?.filter(r => r.status === 'disponivel').length || 0;
  const roomsInUse = data.operatingRooms?.filter(r => r.status === 'em_uso').length || 0;
  const roomsCleaning = data.operatingRooms?.filter(r => r.status === 'limpeza').length || 0;
  const roomsMaintenance = data.operatingRooms?.filter(r => r.status === 'manutencao').length || 0;
  
  // Equipe disponível
  const availableStaff = data.medicalStaff?.filter(s => s.availability_status === 'disponivel').length || 0;
  
  // Alertas de estoque
  const lowStockItems = data.equipment?.filter(e => e.quantity < e.min_quantity).length || 0;

  const statusConfig = {
    disponivel: {
      bg: 'bg-green-100',
      border: 'border-green-600',
      text: 'text-green-800',
      icon: <CheckCircle className="h-6 w-6" />,
      label: 'Disponível',
      badgeClass: 'bg-green-600 text-white'
    },
    em_uso: {
      bg: 'bg-red-100',
      border: 'border-red-600',
      text: 'text-red-800',
      icon: <Activity className="h-6 w-6" />,
      label: 'Em Uso',
      badgeClass: 'bg-red-600 text-white'
    },
    limpeza: {
      bg: 'bg-amber-100',
      border: 'border-amber-600',
      text: 'text-amber-800',
      icon: <Clock className="h-6 w-6" />,
      label: 'Em Limpeza',
      badgeClass: 'bg-amber-600 text-white'
    },
    manutencao: {
      bg: 'bg-gray-100',
      border: 'border-gray-600',
      text: 'text-gray-800',
      icon: <AlertTriangle className="h-6 w-6" />,
      label: 'Manutenção',
      badgeClass: 'bg-gray-600 text-white'
    },
    reservada: {
      bg: 'bg-blue-100',
      border: 'border-blue-600',
      text: 'text-blue-800',
      icon: <Calendar className="h-6 w-6" />,
      label: 'Reservada',
      badgeClass: 'bg-blue-600 text-white'
    }
  };

  const tipoConfig = {
    pre_operatorio: {
      icon: BedDouble,
      label: 'Pré-Operatório',
      color: 'text-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    transoperatorio: {
      icon: Stethoscope,
      label: 'Transoperatório',
      color: 'text-[#1e6a8f]',
      bgGradient: 'from-[#e8f4f8] to-[#d1e9f0]'
    },
    rpa: {
      icon: HeartPulse,
      label: 'RPA',
      color: 'text-purple-600',
      bgGradient: 'from-purple-50 to-purple-100'
    },
    pos_operatorio: {
      icon: Home,
      label: 'Pós-Operatório',
      color: 'text-green-600',
      bgGradient: 'from-green-50 to-green-100'
    }
  };

  const getRoomDetails = (roomId: string) => {
    const room = data.operatingRooms?.find(r => r.id === roomId);
    if (!room) return null;

    const currentSurgery = room.current_surgery_id 
      ? data.surgeries?.find(s => s.id === room.current_surgery_id)
      : null;

    return { room, currentSurgery };
  };

  const selectedRoomDetails = selectedRoom ? getRoomDetails(selectedRoom) : null;

  const RoomCard = ({ room }: { room: any }) => {
    const config = statusConfig[room.status as keyof typeof statusConfig];
    const tipoInfo = tipoConfig[room.tipo as keyof typeof tipoConfig];
    const Icon = tipoInfo.icon;
    const surgery = room.current_surgery_id 
      ? data.surgeries?.find(s => s.id === room.current_surgery_id)
      : null;

    return (
      <Card 
        className={`cursor-pointer hover:shadow-lg transition-all border-2 ${config.border} bg-gradient-to-br ${tipoInfo.bgGradient}`}
        onClick={() => setSelectedRoom(room.id)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className={`h-5 w-5 ${tipoInfo.color}`} />
              <div>
                <CardTitle className="text-sm font-bold text-gray-900">{room.name}</CardTitle>
              </div>
            </div>
            <div className={config.text}>
              {config.icon}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Status:</span>
              <Badge className={config.badgeClass}>{config.label}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Capacidade:</span>
              <span className="text-sm font-semibold text-gray-900">{room.capacity} leito(s)</span>
            </div>
            {surgery && (
              <div className="mt-3 pt-3 border-t border-gray-300">
                <p className="text-xs font-semibold text-gray-700 mb-1">Em Andamento:</p>
                <p className="text-xs text-gray-600 truncate">{surgery.procedimento}</p>
                <p className="text-xs text-gray-500 mt-1">Dr(a): {surgery.cirurgiao}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const getTipoCirurgiaBadge = (tipo: string) => {
    const tipoMap = {
      'eletiva': { variant: 'outline' as const, label: 'Eletiva', className: 'border-[#0a2b3e] text-[#0a2b3e]' },
      'urgencia': { variant: 'default' as const, label: 'Urgência', className: 'bg-amber-600' },
      'emergencia': { variant: 'destructive' as const, label: 'Emergência' }
    };
    const config = tipoMap[tipo as keyof typeof tipoMap] || tipoMap.eletiva;
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'agendada': { variant: 'outline' as const, label: 'Agendada', className: 'border-[#1e6a8f] text-[#1e6a8f]' },
      'em_andamento': { variant: 'default' as const, label: 'Em Andamento', className: 'bg-[#1e6a8f]' },
      'em_preparacao': { variant: 'outline' as const, label: 'Em Preparação', className: 'border-blue-500 text-blue-700' },
      'concluida': { variant: 'secondary' as const, label: 'Concluída', className: 'bg-green-600 text-white' },
      'cancelada': { variant: 'destructive' as const, label: 'Cancelada', className: '' }
    };
    const config = statusMap[status as keyof typeof statusMap] || statusMap.agendada;
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header com data */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-[#0a2b3e]">Dashboard do Centro Cirúrgico</h2>
        <p className="text-gray-600 mt-1">{format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
      </div>

      {/* Cards de Resumo do Centro Cirúrgico */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-green-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Salas Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{roomsAvailable}</div>
            <div className="text-xs text-gray-500 mt-1">prontas para uso</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Salas em Uso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{roomsInUse}</div>
            <div className="text-xs text-gray-500 mt-1">cirurgias em andamento</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Em Limpeza
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{roomsCleaning}</div>
            <div className="text-xs text-gray-500 mt-1">preparação em andamento</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#1e6a8f]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Equipe Disponível
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#1e6a8f]">{availableStaff}</div>
            <div className="text-xs text-gray-500 mt-1">profissionais</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Cirurgias Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{todaySurgeries.length}</div>
            <div className="text-xs text-gray-500 mt-1">agendadas para hoje</div>
          </CardContent>
        </Card>
      </div>

      {/* Pré-Operatório */}
      <div>
        <h3 className="text-lg font-bold text-[#0a2b3e] mb-3 flex items-center gap-2">
          <BedDouble className="h-5 w-5 text-blue-600" />
          Pré-Operatório
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {preOperatoryRooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>

      {/* Salas Cirúrgicas (Transoperatório) */}
      <div>
        <h3 className="text-lg font-bold text-[#0a2b3e] mb-3 flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-[#1e6a8f]" />
          Salas Cirúrgicas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {surgicalRooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>

      {/* RPA - Recuperação Pós-Anestésica */}
      <div>
        <h3 className="text-lg font-bold text-[#0a2b3e] mb-3 flex items-center gap-2">
          <HeartPulse className="h-5 w-5 text-purple-600" />
          RPA - Recuperação Pós-Anestésica
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rpaRooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>

      {/* Pós-Operatório */}
      <div>
        <h3 className="text-lg font-bold text-[#0a2b3e] mb-3 flex items-center gap-2">
          <Home className="h-5 w-5 text-green-600" />
          Pós-Operatório
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {postOpRooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>

      {/* Cirurgias Agendadas para Hoje */}
      {todaySurgeries.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-[#0a2b3e] mb-4">Cirurgias Agendadas para Hoje</h3>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ordem</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horário</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Procedimento</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sala</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cirurgião</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {todaySurgeries.map((surgery) => (
                      <tr key={surgery.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {surgery.ordem}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {surgery.hora_inicio}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {surgery.iniciais_paciente}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {surgery.procedimento}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {surgery.sala_operatoria}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {surgery.cirurgiao}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {getTipoCirurgiaBadge(surgery.tipo_cirurgia)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {getStatusBadge(surgery.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Dialog de Detalhes da Sala */}
      <Dialog open={!!selectedRoom} onOpenChange={() => setSelectedRoom(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedRoomDetails && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-[#0a2b3e] flex items-center gap-2">
                  {selectedRoomDetails.room.name}
                  <Badge className={statusConfig[selectedRoomDetails.room.status as keyof typeof statusConfig].badgeClass}>
                    {statusConfig[selectedRoomDetails.room.status as keyof typeof statusConfig].label}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Informações da Sala */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base text-gray-900">Informações da Sala</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Tipo</p>
                        <p className="font-semibold">{tipoConfig[selectedRoomDetails.room.tipo as keyof typeof tipoConfig].label}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Capacidade</p>
                        <p className="font-semibold">{selectedRoomDetails.room.capacity} leito(s)</p>
                      </div>
                    </div>
                    {selectedRoomDetails.room.notes && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-gray-600">Observações</p>
                        <p className="text-sm text-gray-900 mt-1">{selectedRoomDetails.room.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Equipamentos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base text-gray-900">Equipamentos Disponíveis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {selectedRoomDetails.room.equipment_list.map((equipment: string, index: number) => (
                        <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          {equipment}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Cirurgia em Andamento */}
                {selectedRoomDetails.currentSurgery && (
                  <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                      <CardTitle className="text-base text-red-900">Cirurgia em Andamento</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Procedimento</p>
                        <p className="font-semibold text-gray-900">{selectedRoomDetails.currentSurgery.procedimento}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Paciente</p>
                          <p className="font-semibold">{selectedRoomDetails.currentSurgery.iniciais_paciente}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Prontuário</p>
                          <p className="font-semibold">{selectedRoomDetails.currentSurgery.prontuario}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Cirurgião</p>
                          <p className="font-semibold">{selectedRoomDetails.currentSurgery.cirurgiao}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Anestesista</p>
                          <p className="font-semibold">{selectedRoomDetails.currentSurgery.anestesista}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Início</p>
                          <p className="font-semibold">{selectedRoomDetails.currentSurgery.hora_inicio}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Fim Previsto</p>
                          <p className="font-semibold">{selectedRoomDetails.currentSurgery.hora_fim}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Duração</p>
                          <p className="font-semibold">{selectedRoomDetails.currentSurgery.duracao_estimada_min} min</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="flex justify-end mt-4">
                <Button onClick={() => setSelectedRoom(null)} variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Fechar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}