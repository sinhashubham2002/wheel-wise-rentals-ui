
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Vehicle } from '@/pages/Index';

interface VehicleGridProps {
  vehicles: Vehicle[];
  isLoading: boolean;
}

const VehicleGrid: React.FC<VehicleGridProps> = ({ vehicles, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-slate-200 rounded mb-4"></div>
              <div className="h-6 bg-slate-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-400 text-lg">No vehicles found for this type</div>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'A': return 'bg-green-100 text-green-700 border-green-200';
      case 'B': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'C': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {vehicles.map((vehicle, index) => (
        <Card 
          key={vehicle.id} 
          className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/90 backdrop-blur-sm cursor-pointer"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                {vehicle.name}
              </h3>
              <Badge className={`${getTypeColor(vehicle.type)} border`}>
                Class {vehicle.type}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-500">
                Vehicle ID: {vehicle.id}
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VehicleGrid;
