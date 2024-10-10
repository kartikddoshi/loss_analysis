import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { getItems } from '@/lib/analysisQueries';

interface ItemListProps {
  onItemSelect: (item: string) => void;
}

const ItemList: React.FC<ItemListProps> = ({ onItemSelect }) => {
  // State to manage sorting option
  const [sortBy, setSortBy] = useState<'item_no' | 'loss'>('item_no');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch items data using React Query
  const { data: items, isLoading, error } = useQuery({
    queryKey: ['items-with-loss'],
    queryFn: getItems
  });

  // Memoized filtered and sorted items array
  const filteredAndSortedItems = useMemo(() => {
    if (!items) return [];
    return [...items]
      .filter(item => item.item_no.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'loss') return b.loss_percentage - a.loss_percentage;
        return a.item_no.localeCompare(b.item_no);
      });
  }, [items, sortBy, searchTerm]);

  // Calculate maximum loss percentage for color scaling
  const maxLossPercentage = useMemo(() => {
    if (!items) return 0;
    return Math.max(...items.map(item => item.loss_percentage));
  }, [items]);

  // Function to determine color based on loss percentage
  const getColorForLossPercentage = (lossPercentage: number) => {
    if (lossPercentage <= 12) {
      // Green to red gradient for 0-12%
      const hue = (1 - lossPercentage / 12) * 120;
      return `hsl(${hue}, 100%, 35%)`;
    } else {
      // Darker shades of red for >12%
      const lightness = Math.max(20, 50 - (lossPercentage - 12) * 2);
      return `hsl(0, 100%, ${lightness}%)`;
    }
  };

  // Loading state
  if (isLoading) return <div>Loading items...</div>;

  // Error state
  if (error) {
    console.error('Error loading items:', error);
    return <div>Error loading items. Please check the console for details.</div>;
  }

  // No data state
  if (!items || items.length === 0) {
    console.log('No items available');
    return <div>No items available</div>;
  }

  // Render the component
  return (
    <div className="w-64 bg-white dark:bg-gray-800 p-4 shadow-lg flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4">Items</h2>
      {/* Sorting dropdown */}
      <Select onValueChange={(value: 'item_no' | 'loss') => setSortBy(value)} value={sortBy}>
        <SelectTrigger className="w-full mb-4">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item_no">Item Number</SelectItem>
          <SelectItem value="loss">Loss Percentage</SelectItem>
        </SelectContent>
      </Select>
      {/* Search box */}
      <Input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {/* Scrollable list of items */}
      <div className="space-y-2 overflow-y-auto flex-grow" style={{ maxHeight: 'calc(100vh - 250px)' }}>
        {filteredAndSortedItems.map((item) => (
          <Button
            key={item.item_no}
            variant="ghost"
            className="w-full justify-start text-white"
            style={{ backgroundColor: getColorForLossPercentage(item.loss_percentage) }}
            onClick={() => onItemSelect(item.item_no)}
          >
            {item.item_no} - {item.loss_percentage.toFixed(2)}%
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ItemList;
