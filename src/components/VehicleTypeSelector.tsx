
import React from 'react';
import { Button } from '@/components/ui/button';

interface VehicleTypeSelectorProps {
  selectedType: 'A' | 'B' | 'C';
  onTypeChange: (type: 'A' | 'B' | 'C') => void;
}

const VehicleTypeSelector: React.FC<VehicleTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
}) => {
  const types = [
    { value: 'A' as const, label: 'Class A', description: 'Economy vehicles' },
    { value: 'B' as const, label: 'Class B', description: 'Standard vehicles' },
    { value: 'C' as const, label: 'Class C', description: 'Premium vehicles' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-slate-700">Select Vehicle Type</h3>
      <div className="flex flex-wrap gap-2">
        {types.map((type) => (
          <Button
            key={type.value}
            onClick={() => onTypeChange(type.value)}
            variant={selectedType === type.value ? "default" : "outline"}
            className={`
              flex-1 min-w-[140px] transition-all duration-200 
              ${selectedType === type.value
                ? 'bg-blue-600 hover:bg-blue-700 shadow-lg scale-105 border-blue-600'
                : 'hover:bg-blue-50 hover:border-blue-300 hover:scale-102'
              }
            `}
          >
            <div className="text-center">
              <div className="font-semibold">{type.label}</div>
              <div className="text-xs opacity-75">{type.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default VehicleTypeSelector;
