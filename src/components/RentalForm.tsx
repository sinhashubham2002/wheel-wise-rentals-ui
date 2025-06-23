
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Calculator } from 'lucide-react';
import { Vehicle } from '@/pages/Index';

interface RentalFormProps {
  vehicles: Vehicle[];
  onPreview: (vehicleName: string, hours: number, kilometers: number) => Promise<void>;
}

const RentalForm: React.FC<RentalFormProps> = ({ vehicles, onPreview }) => {
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [hours, setHours] = useState<number>(1);
  const [kilometers, setKilometers] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ vehicle?: string; hours?: string; kilometers?: string }>({});

  const validateForm = () => {
    const newErrors: { vehicle?: string; hours?: string; kilometers?: string } = {};

    if (!selectedVehicle) {
      newErrors.vehicle = 'Please select a vehicle';
    }

    if (!hours || hours < 1) {
      newErrors.hours = 'Hours must be at least 1';
    }

    if (kilometers < 0) {
      newErrors.kilometers = 'Kilometers cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onPreview(selectedVehicle, hours, kilometers);
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsLoading(false);
    }
  };

  const handleHoursChange = (value: string) => {
    const num = parseFloat(value);
    setHours(num);
    setErrors(prev => ({ ...prev, hours: undefined }));
  };

  const handleKilometersChange = (value: string) => {
    const num = parseFloat(value);
    setKilometers(num);
    setErrors(prev => ({ ...prev, kilometers: undefined }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">
          Select Vehicle
        </Label>
        <Select
          value={selectedVehicle}
          onValueChange={(value) => {
            setSelectedVehicle(value);
            setErrors(prev => ({ ...prev, vehicle: undefined }));
          }}
        >
          <SelectTrigger className={`${errors.vehicle ? 'border-red-300 focus:border-red-500' : ''}`}>
            <SelectValue placeholder="Choose a vehicle..." />
          </SelectTrigger>
          <SelectContent>
            {vehicles.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.name}>
                <div className="flex items-center gap-2">
                  <span>{vehicle.name}</span>
                  <span className="text-xs text-slate-500">
                    (Class {vehicle.type})
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.vehicle && (
          <p className="text-sm text-red-600">{errors.vehicle}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hours" className="text-sm font-medium text-slate-700">
            Hours
          </Label>
          <Input
            id="hours"
            type="number"
            min="1"
            step="0.5"
            value={hours}
            onChange={(e) => handleHoursChange(e.target.value)}
            className={`${errors.hours ? 'border-red-300 focus:border-red-500' : ''}`}
          />
          {errors.hours && (
            <p className="text-sm text-red-600">{errors.hours}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="kilometers" className="text-sm font-medium text-slate-700">
            Kilometers
          </Label>
          <Input
            id="kilometers"
            type="number"
            min="0"
            value={kilometers}
            onChange={(e) => handleKilometersChange(e.target.value)}
            className={`${errors.kilometers ? 'border-red-300 focus:border-red-500' : ''}`}
          />
          {errors.kilometers && (
            <p className="text-sm text-red-600">{errors.kilometers}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading || vehicles.length === 0}
        className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Calculating...
          </>
        ) : (
          <>
            <Calculator className="w-4 h-4 mr-2" />
            Preview Rental Cost
          </>
        )}
      </Button>

      {vehicles.length === 0 && (
        <p className="text-sm text-slate-500 text-center">
          Select a vehicle type above to see available vehicles
        </p>
      )}
    </form>
  );
};

export default RentalForm;
