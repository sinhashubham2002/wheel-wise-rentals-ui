
import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import { InventoryItem } from '@/pages/Index';

interface InventoryTableProps {
  inventory: InventoryItem[];
  isLoading: boolean;
}

type SortField = 'name' | 'type' | 'availableCount';
type SortDirection = 'asc' | 'desc';

const InventoryTable: React.FC<InventoryTableProps> = ({ inventory, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedInventory = useMemo(() => {
    let filtered = inventory.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let aValue: string | number = a[sortField];
      let bValue: string | number = b[sortField];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [inventory, searchTerm, sortField, sortDirection]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'A': return 'bg-green-100 text-green-700 border-green-200';
      case 'B': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'C': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStockStatus = (count: number) => {
    if (count === 0) return { color: 'bg-red-100 text-red-700 border-red-200', text: 'Out of Stock' };
    if (count <= 5) return { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', text: 'Low Stock' };
    return { color: 'bg-green-100 text-green-700 border-green-200', text: 'In Stock' };
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4 ml-1" /> : 
      <ChevronDown className="w-4 h-4 ml-1" />;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-10 bg-slate-200 rounded mb-4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-12 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="Search vehicles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold text-slate-700 hover:text-slate-900"
                  onClick={() => handleSort('name')}
                >
                  Vehicle Name
                  <SortIcon field="name" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold text-slate-700 hover:text-slate-900"
                  onClick={() => handleSort('type')}
                >
                  Type
                  <SortIcon field="type" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold text-slate-700 hover:text-slate-900"
                  onClick={() => handleSort('availableCount')}
                >
                  Available Count
                  <SortIcon field="availableCount" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedInventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                  {searchTerm ? 'No vehicles match your search' : 'No inventory data available'}
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedInventory.map((item, index) => {
                const stockStatus = getStockStatus(item.availableCount);
                return (
                  <TableRow 
                    key={`${item.name}-${item.type}`} 
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <TableCell className="font-medium text-slate-800">
                      {item.name}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getTypeColor(item.type)} border`}>
                        Class {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700">
                      {item.availableCount}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${stockStatus.color} border`}>
                        {stockStatus.text}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {filteredAndSortedInventory.length > 0 && (
        <div className="text-sm text-slate-500 text-center">
          Showing {filteredAndSortedInventory.length} of {inventory.length} vehicles
        </div>
      )}
    </div>
  );
};

export default InventoryTable;
