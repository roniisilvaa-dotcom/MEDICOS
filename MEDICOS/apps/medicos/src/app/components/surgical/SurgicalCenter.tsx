import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { LayoutDashboard, Map, Calendar, Users, Stethoscope, ClipboardList, Package, Shield } from 'lucide-react';
import SurgicalDashboard from './SurgicalDashboard';
import SurgicalMap from './SurgicalMap';
import PatientsManager from './PatientsManager';
import SchedulingManager from './SchedulingManager';
import MedicalTeamManager from './MedicalTeamManager';
import EquipmentControl from './EquipmentControl';
import TeamDimensioning from './TeamDimensioning';
import LGPDPanel from './LGPDPanel';

export default function SurgicalCenter() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header do Centro Cirúrgico com tema VITALLIS */}
      <div className="bg-gradient-to-r from-[#0a2b3e] to-[#1e6a8f] text-white px-8 py-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Centro Cirúrgico</h1>
          <p className="text-blue-200 mt-1">Sistema de Gestão - VITALLIS</p>
        </div>
      </div>

      {/* Tabs de Navegação */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start bg-transparent p-0 h-auto gap-1 flex-nowrap overflow-x-auto">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent data-[state=active]:border-[#1e6a8f] data-[state=active]:text-[#1e6a8f] data-[state=active]:bg-blue-50/50 rounded-t-lg hover:bg-gray-50"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="mapa" 
                className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent data-[state=active]:border-[#1e6a8f] data-[state=active]:text-[#1e6a8f] data-[state=active]:bg-blue-50/50 rounded-t-lg hover:bg-gray-50"
              >
                <Map className="h-4 w-4" />
                <span>Mapa Cirúrgico</span>
              </TabsTrigger>
              <TabsTrigger 
                value="agendamento" 
                className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent data-[state=active]:border-[#1e6a8f] data-[state=active]:text-[#1e6a8f] data-[state=active]:bg-blue-50/50 rounded-t-lg hover:bg-gray-50"
              >
                <Calendar className="h-4 w-4" />
                <span>Agendamento</span>
              </TabsTrigger>
              <TabsTrigger 
                value="pacientes" 
                className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent data-[state=active]:border-[#1e6a8f] data-[state=active]:text-[#1e6a8f] data-[state=active]:bg-blue-50/50 rounded-t-lg hover:bg-gray-50"
              >
                <Users className="h-4 w-4" />
                <span>Pacientes</span>
              </TabsTrigger>
              <TabsTrigger 
                value="equipe" 
                className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent data-[state=active]:border-[#1e6a8f] data-[state=active]:text-[#1e6a8f] data-[state=active]:bg-blue-50/50 rounded-t-lg hover:bg-gray-50"
              >
                <Stethoscope className="h-4 w-4" />
                <span>Equipe Médica</span>
              </TabsTrigger>
              <TabsTrigger 
                value="dimensionamento" 
                className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent data-[state=active]:border-[#1e6a8f] data-[state=active]:text-[#1e6a8f] data-[state=active]:bg-blue-50/50 rounded-t-lg hover:bg-gray-50"
              >
                <ClipboardList className="h-4 w-4" />
                <span>Dimensionamento</span>
              </TabsTrigger>
              <TabsTrigger 
                value="equipamentos" 
                className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent data-[state=active]:border-[#1e6a8f] data-[state=active]:text-[#1e6a8f] data-[state=active]:bg-blue-50/50 rounded-t-lg hover:bg-gray-50"
              >
                <Package className="h-4 w-4" />
                <span>Equipamentos</span>
              </TabsTrigger>
              <TabsTrigger 
                value="lgpd" 
                className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent data-[state=active]:border-[#1e6a8f] data-[state=active]:text-[#1e6a8f] data-[state=active]:bg-blue-50/50 rounded-t-lg hover:bg-gray-50"
              >
                <Shield className="h-4 w-4" />
                <span>LGPD</span>
              </TabsTrigger>
            </TabsList>

            {/* Content */}
            <div className="p-8">
              <TabsContent value="dashboard" className="mt-0">
                <SurgicalDashboard />
              </TabsContent>
              <TabsContent value="mapa" className="mt-0">
                <SurgicalMap />
              </TabsContent>
              <TabsContent value="agendamento" className="mt-0">
                <SchedulingManager />
              </TabsContent>
              <TabsContent value="pacientes" className="mt-0">
                <PatientsManager />
              </TabsContent>
              <TabsContent value="equipe" className="mt-0">
                <MedicalTeamManager />
              </TabsContent>
              <TabsContent value="dimensionamento" className="mt-0">
                <TeamDimensioning />
              </TabsContent>
              <TabsContent value="equipamentos" className="mt-0">
                <EquipmentControl />
              </TabsContent>
              <TabsContent value="lgpd" className="mt-0">
                <LGPDPanel />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}