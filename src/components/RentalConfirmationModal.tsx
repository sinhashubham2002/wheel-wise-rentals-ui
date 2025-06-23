
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, Clock, MapPin, DollarSign } from 'lucide-react';
import { RentalPreview } from '@/pages/Index';

interface RentalConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  preview: RentalPreview | null;
}

const RentalConfirmationModal: React.FC<RentalConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  preview,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsConfirming(false);
    }
  };

  const getClassColor = (vehicleClass: string) => {
    switch (vehicleClass) {
      case 'A': return 'bg-green-100 text-green-700 border-green-200';
      case 'B': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'C': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (!preview) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Confirm Rental
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Rental Summary Card */}
          <Card className="border-2 border-blue-100 bg-blue-50/50">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Vehicle Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      {preview.vehicleName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`${getClassColor(preview.class)} border`}>
                        Class {preview.class}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-200">
                  {/* Duration */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Duration</div>
                      <div className="font-semibold text-slate-800">
                        {preview.hours} {preview.hours === 1 ? 'hour' : 'hours'}
                      </div>
                    </div>
                  </div>

                  {/* Distance */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Distance</div>
                      <div className="font-semibold text-slate-800">
                        {preview.kilometers} km
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Cost */}
                <div className="flex items-center justify-center gap-3 pt-4 border-t border-blue-200">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-600">Total Cost</div>
                    <div className="text-2xl font-bold text-green-600">
                      ${preview.totalCost.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Breakdown */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-slate-700 mb-3">Pricing Breakdown</h4>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Base rate ({preview.hours} hours × $25)</span>
              <span className="text-slate-800">${(preview.hours * 25).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Distance fee ({preview.kilometers} km × $0.50)</span>
              <span className="text-slate-800">${(preview.kilometers * 0.5).toFixed(2)}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 mt-3">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-700">Total</span>
                <span className="text-green-600">${preview.totalCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isConfirming}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isConfirming}
            className="bg-green-600 hover:bg-green-700 min-w-[120px]"
          >
            {isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Confirming...
              </>
            ) : (
              'Confirm Rental'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RentalConfirmationModal;
