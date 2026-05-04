import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { AlertTriangle } from 'lucide-react';

export default function EquipmentControl() {
  const { data } = useAuth();

  const lowStockItems = data.equipment?.filter(e => e.quantity < e.min_quantity) || [];

  const statusBadge = (status: string) => {
    const config = {
      disponivel: { variant: 'outline' as const, label: 'Disponível', className: 'border-green-500 text-green-700' },
      em_uso: { variant: 'default' as const, label: 'Em Uso', className: 'bg-red-600' },
      manutencao: { variant: 'outline' as const, label: 'Manutenção', className: 'border-amber-500 text-amber-700' },
      esterilizacao: { variant: 'default' as const, label: 'Esterilização', className: 'bg-blue-600' },
      baixa: { variant: 'secondary' as const, label: 'Baixa', className: '' }
    };
    const c = config[status as keyof typeof config] || config.disponivel;
    return <Badge variant={c.variant} className={c.className}>{c.label}</Badge>;
  };

  const categoryBadge = (category: string) => {
    const labels = {
      equipamento_fixo: 'Equipamento Fixo',
      equipamento_movel: 'Equipamento Móvel',
      material_descartavel: 'Material Descartável',
      instrumental: 'Instrumental',
      medicamento: 'Medicamento',
      implante: 'Implante'
    };
    return <Badge variant="outline">{labels[category as keyof typeof labels] || category}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Controle de Equipamentos</h2>
        <p className="text-slate-600 mt-1">Gestão de equipamentos, materiais e insumos</p>
      </div>

      {lowStockItems.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Atenção!</strong> {lowStockItems.length} item(ns) com estoque abaixo do mínimo.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Equipamentos e Materiais ({data.equipment?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Observações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.equipment?.map(eq => {
                  const isLowStock = eq.quantity < eq.min_quantity;
                  return (
                    <TableRow key={eq.id} className={isLowStock ? 'bg-amber-50' : ''}>
                      <TableCell className="font-medium">{eq.name}</TableCell>
                      <TableCell>{eq.code}</TableCell>
                      <TableCell>{categoryBadge(eq.category)}</TableCell>
                      <TableCell>{eq.location}</TableCell>
                      <TableCell>
                        <span className={isLowStock ? 'text-amber-600 font-bold' : ''}>
                          {eq.quantity} / {eq.min_quantity}
                        </span>
                        {isLowStock && <Badge variant="destructive" className="ml-2">Baixo</Badge>}
                      </TableCell>
                      <TableCell>{statusBadge(eq.status)}</TableCell>
                      <TableCell className="text-xs text-slate-600">{eq.notes}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
