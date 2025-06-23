
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Vehicle } from '@/pages/Index';
import { Loader2 } from 'lucide-react';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStock: (vehicleName: string, quantity: number) => Promise<void>;
  vehicles: Vehicle[];
}

const AddStockModal: React.FC<AddStockModalProps> = ({
  isOpen,
  onClose,
  onAddStock,
  vehicles,
}) => {
  const [vehicleName, setVehicleName] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ vehicleName?: string; quantity?: string }>({});
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleVehicleNameChange = (value: string) => {
    setVehicleName(value);
    setErrors(prev => ({ ...prev, vehicleName: undefined }));

    if (value.length > 0) {
      const allVehicles = vehicles; // In real app, this would include all vehicles from all types
      const filtered = allVehicles.filter(vehicle =>
        vehicle.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredVehicles(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value);
    setQuantity(num);
    setErrors(prev => ({ ...prev, quantity: undefined }));
  };

  const validateForm = () => {
    const newErrors: { vehicleName?: string; quantity?: string } = {};

    if (!vehicleName.trim()) {
      newErrors.vehicleName = 'Vehicle name is required';
    }

    if (!quantity || quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onAddStock(vehicleName, quantity);
      setVehicleName('');
      setQuantity(1);
      setErrors({});
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setVehicleName(vehicle.name);
    setShowSuggestions(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-800">
            Add Stock
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 relative">
            <Label htmlFor="vehicleName" className="text-sm font-medium text-slate-700">
              Vehicle Name
            </Label>
            <Input
              id="vehicleName"
              value={vehicleName}
              onChange={(e) => handleVehicleNameChange(e.target.value)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onFocus={() => vehicleName && setShowSuggestions(true)}
              placeholder="Start typing vehicle name..."
              className={`${errors.vehicleName ? 'border-red-300 focus:border-red-500' : ''}`}
            />
            
            {showSuggestions && filteredVehicles.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-10 bg-white border border-slate-200 rounded-md shadow-lg max-h-32 overflow-y-auto">
                {filteredVehicles.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    type="button"
                    onClick={() => handleSelectVehicle(vehicle)}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                  >
                    <div className="font-medium text-slate-800">{vehicle.name}</div>
                    <div className="text-xs text-slate-500">Class {vehicle.type}</div>
                  </button>
                ))}
              </div>
            )}
            
            {errors.vehicleName && (
              <p className="text-sm text-red-600">{errors.vehicleName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-sm font-medium text-slate-700">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className={`${errors.quantity ? 'border-red-300 focus:border-red-500' : ''}`}
            />
            {errors.quantity && (
              <p className="text-sm text-red-600">{errors.quantity}</p>
            )}
          </div>

          <DialogFooter className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Stock'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStockModal;
