
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import VehicleTypeSelector from '@/components/VehicleTypeSelector';
import VehicleGrid from '@/components/VehicleGrid';
import AddStockModal from '@/components/AddStockModal';
import InventoryTable from '@/components/InventoryTable';
import RentalForm from '@/components/RentalForm';
import RentalConfirmationModal from '@/components/RentalConfirmationModal';

export interface Vehicle {
  id: string;
  name: string;
  type: 'A' | 'B' | 'C';
}

export interface InventoryItem {
  name: string;
  type: 'A' | 'B' | 'C';
  availableCount: number;
}

export interface RentalPreview {
  vehicleName: string;
  class: string;
  totalCost: number;
  hours: number;
  kilometers: number;
}

const Index = () => {
  const [selectedType, setSelectedType] = useState<'A' | 'B' | 'C'>('A');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
  const [rentalPreview, setRentalPreview] = useState<RentalPreview | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const { toast } = useToast();

  // Simulate API call for vehicles by type
  const fetchVehiclesByType = async (type: 'A' | 'B' | 'C') => {
    setIsLoadingVehicles(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data - replace with actual API call
      const mockVehicles: Vehicle[] = [
        { id: '1', name: `Economy Car ${type}1`, type },
        { id: '2', name: `Standard Car ${type}2`, type },
        { id: '3', name: `Premium Car ${type}3`, type },
      ];
      
      setVehicles(mockVehicles);
      console.log(`Fetched vehicles for type ${type}:`, mockVehicles);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch vehicles",
        variant: "destructive",
      });
    } finally {
      setIsLoadingVehicles(false);
    }
  };

  // Simulate API call for inventory
  const fetchInventory = async () => {
    setIsLoadingInventory(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockInventory: InventoryItem[] = [
        { name: "Economy Car A1", type: "A", availableCount: 15 },
        { name: "Standard Car A2", type: "A", availableCount: 8 },
        { name: "Premium Car B1", type: "B", availableCount: 12 },
        { name: "Luxury Car C1", type: "C", availableCount: 5 },
      ];
      
      setInventory(mockInventory);
      console.log('Fetched inventory:', mockInventory);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch inventory",
        variant: "destructive",
      });
    } finally {
      setIsLoadingInventory(false);
    }
  };

  // Handle adding stock
  const handleAddStock = async (vehicleName: string, quantity: number) => {
    try {
      console.log('Adding stock:', { vehicleName, quantity });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Success",
        description: `Added ${quantity} units of ${vehicleName} to inventory`,
      });
      
      // Refresh inventory
      fetchInventory();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add stock",
        variant: "destructive",
      });
    }
  };

  // Handle rental preview
  const handleRentalPreview = async (vehicleName: string, hours: number, kilometers: number) => {
    try {
      console.log('Getting rental preview:', { vehicleName, hours, kilometers });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock calculation
      const baseRate = 25;
      const kmRate = 0.5;
      const totalCost = (hours * baseRate) + (kilometers * kmRate);
      
      const preview: RentalPreview = {
        vehicleName,
        class: vehicles.find(v => v.name === vehicleName)?.type || 'A',
        totalCost,
        hours,
        kilometers,
      };
      
      setRentalPreview(preview);
      setIsConfirmationOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get rental preview",
        variant: "destructive",
      });
    }
  };

  // Handle rental confirmation
  const handleRentalConfirm = async () => {
    if (!rentalPreview) return;
    
    try {
      console.log('Confirming rental:', rentalPreview);
      
      await new Promise(resolve => setTimeout(resolve, 600));
      
      toast({
        title: "Rental Confirmed",
        description: `Successfully rented ${rentalPreview.vehicleName}`,
      });
      
      setIsConfirmationOpen(false);
      setRentalPreview(null);
      
      // Refresh inventory to reflect the rental
      fetchInventory();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to confirm rental",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchVehiclesByType(selectedType);
  }, [selectedType]);

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
            Vehicle Rental System
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Manage your fleet with ease. Browse vehicles, manage inventory, and process rentals.
          </p>
        </div>

        {/* Vehicle Browser Section */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-slate-800 flex items-center gap-3">
              Browse Vehicles
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Live Data
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <VehicleTypeSelector
              selectedType={selectedType}
              onTypeChange={setSelectedType}
            />
            <VehicleGrid
              vehicles={vehicles}
              isLoading={isLoadingVehicles}
            />
          </CardContent>
        </Card>

        {/* Inventory Management Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-slate-800">
                    Current Inventory
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setIsAddStockOpen(true)}
                      className="bg-green-600 hover:bg-green-700 transition-colors"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Stock
                    </Button>
                    <Button
                      onClick={fetchInventory}
                      variant="outline"
                      size="sm"
                      disabled={isLoadingInventory}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingInventory ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <InventoryTable
                  inventory={inventory}
                  isLoading={isLoadingInventory}
                />
              </CardContent>
            </Card>
          </div>

          {/* Rental Form Section */}
          <div>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-slate-800">
                  Rental Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RentalForm
                  vehicles={vehicles}
                  onPreview={handleRentalPreview}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modals */}
        <AddStockModal
          isOpen={isAddStockOpen}
          onClose={() => setIsAddStockOpen(false)}
          onAddStock={handleAddStock}
          vehicles={vehicles}
        />

        <RentalConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={() => setIsConfirmationOpen(false)}
          onConfirm={handleRentalConfirm}
          preview={rentalPreview}
        />
      </div>
    </div>
  );
};

export default Index;
