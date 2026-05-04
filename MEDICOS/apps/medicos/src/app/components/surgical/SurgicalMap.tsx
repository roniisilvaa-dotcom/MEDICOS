import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Activity, Clock, AlertTriangle, CheckCircle, Calendar, X, 
  BedDouble, Stethoscope, HeartPulse, Home, RefreshCw, Wrench, Sparkles, Unlock
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { toast } from 'sonner';

export default function SurgicalMap() {
  const { data, updateData } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const handleChangeRoomStatus = (roomId: string, newStatus: string) => {
    const updatedRooms = data.operatingRooms.map(room => {
      if (room.id === roomId) {
        return { ...room, status: newStatus };
      }
      return room;
    });

    updateData({ operatingRooms: updatedRooms });
    
    const statusLabels = {
      disponivel: 'Disponível',
      limpeza: 'Em Limpeza',
      manutencao: 'Em Manutenção',
      em_uso: 'Em Uso',
      reservada: 'Reservada'
    };
    
    toast.success(`Sala alterada para: ${statusLabels[newStatus as keyof typeof statusLabels]}`);
  };

  // Organizar as salas por tipo
  const preOperatoryRooms = data.operatingRooms?.filter(r => r.tipo === 'pre_operatorio') || [];
  const surgicalRooms = data.operatingRooms?.filter(r => r.tipo === 'transoperatorio') || [];
  const rpaRooms = data.operatingRooms?.filter(r => r.tipo === 'rpa') || [];
  const postOpRooms = data.operatingRooms?.filter(r => r.tipo === 'pos_operatorio') || [];

  const statusConfig = {
    disponivel: {
      bg: 'bg-green-100',
      border: 'border-green-600',
      text: 'text-green-800',
      icon: <CheckCircle className="h-8 w-8" />,
      label: 'Disponível',
      badgeClass: 'bg-green-600 text-white'
    },
    em_uso: {
      bg: 'bg-red-100',
      border: 'border-red-600',
      text: 'text-red-800',
      icon: <Activity className="h-8 w-8" />,
      label: 'Em Uso',
      badgeClass: 'bg-red-600 text-white'
    },
    limpeza: {
      bg: 'bg-amber-100',
      border: 'border-amber-600',
      text: 'text-amber-800',
      icon: <Clock className="h-8 w-8" />,
      label: 'Em Limpeza',
      badgeClass: 'bg-amber-600 text-white'
    },
    manutencao: {
      bg: 'bg-gray-100',
      border: 'border-gray-600',
      text: 'text-gray-800',
      icon: <AlertTriangle className="h-8 w-8" />,
      label: 'Manutenção',
      badgeClass: 'bg-gray-600 text-white'
    },
    reservada: {
      bg: 'bg-blue-100',
      border: 'border-blue-600',
      text: 'text-blue-800',
      icon: <Calendar className="h-8 w-8" />,
      label: 'Reservada',
      badgeClass: 'bg-blue-600 text-white'
    }
  };

  const tipoConfig = {
    pre_operatorio: {
      icon: BedDouble,
      label: 'Pré-Operatório',
      description: 'Preparação pré-cirúrgica',
      color: 'text-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    transoperatorio: {
      icon: Stethoscope,
      label: 'Transoperatório',
      description: 'Sala cirúrgica',
      color: 'text-[#1e6a8f]',
      bgGradient: 'from-[#e8f4f8] to-[#d1e9f0]'
    },
    rpa: {
      icon: HeartPulse,
      label: 'RPA',
      description: 'Recuperação Pós-Anestésica',
      color: 'text-purple-600',
      bgGradient: 'from-purple-50 to-purple-100'
    },
    pos_operatorio: {
      icon: Home,
      label: 'Pós-Operatório',
      description: 'Recuperação intermediária',
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
            <div className="flex items-center gap-3">
              <Icon className={`h-6 w-6 ${tipoInfo.color}`} />
              <div>
                <CardTitle className="text-base font-bold text-gray-900">{room.name}</CardTitle>
                <p className="text-xs text-gray-600 mt-1">{tipoInfo.description}</p>
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
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-1">Em Andamento:</p>
                <p className="text-xs text-gray-600">{surgery.procedimento}</p>
                <p className="text-xs text-gray-500 mt-1">Cirurgião: {surgery.cirurgiao}</p>
                <p className="text-xs text-gray-500">Início: {surgery.hora_inicio}</p>
              </div>
            )}
            {room.notes && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500 italic">{room.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-[#0a2b3e]">Mapa Cirúrgico - Painel Eletrônico</h2>
        <p className="text-gray-600 mt-1">Visualização em tempo real das salas do Centro Cirúrgico</p>
      </div>

      {/* Legenda */}
      <Card className="border-[#1e6a8f]">
        <CardHeader>
          <CardTitle className="text-base text-[#0a2b3e]">Legenda de Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {Object.entries(statusConfig).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${config.bg} border-2 ${config.border}`}></div>
                <span className="text-sm text-gray-700">{config.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pré-Operatório */}
      <div>
        <h3 className="text-lg font-bold text-[#0a2b3e] mb-3 flex items-center gap-2">
          <BedDouble className="h-5 w-5 text-blue-600" />
          Pré-Operatório
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {postOpRooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>

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

                {/* Controle de Status da Sala */}
                <Card className="border-[#1e6a8f] bg-gradient-to-br from-blue-50 to-white">
                  <CardHeader>
                    <CardTitle className="text-base text-[#0a2b3e] flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Gerenciar Status da Sala
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Altere o status da sala conforme necessário:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => handleChangeRoomStatus(selectedRoomDetails.room.id, 'disponivel')}
                        disabled={selectedRoomDetails.room.status === 'disponivel'}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Unlock className="h-4 w-4 mr-2" />
                        Liberar Sala
                      </Button>
                      <Button
                        onClick={() => handleChangeRoomStatus(selectedRoomDetails.room.id, 'limpeza')}
                        disabled={selectedRoomDetails.room.status === 'limpeza'}
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Em Limpeza
                      </Button>
                      <Button
                        onClick={() => handleChangeRoomStatus(selectedRoomDetails.room.id, 'manutencao')}
                        disabled={selectedRoomDetails.room.status === 'manutencao'}
                        className="bg-gray-600 hover:bg-gray-700 text-white"
                      >
                        <Wrench className="h-4 w-4 mr-2" />
                        Em Manutenção
                      </Button>
                      <Button
                        onClick={() => handleChangeRoomStatus(selectedRoomDetails.room.id, 'em_uso')}
                        disabled={selectedRoomDetails.room.status === 'em_uso'}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Activity className="h-4 w-4 mr-2" />
                        Em Uso
                      </Button>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-800">
                        <strong>Status Atual:</strong> {statusConfig[selectedRoomDetails.room.status as keyof typeof statusConfig].label}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
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