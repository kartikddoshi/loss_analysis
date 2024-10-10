import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { getItems } from '@/lib/analysisQueries';
import { ChevronRight, ChevronDown } from 'lucide-react'; // Import icons

interface ItemListProps {
  onItemSelect: (item: string) => void;
}

interface ItemData {
  item_no: string;
  loss_percentage: number;
  date: string; // Changed from Date to string
}

const ItemList: React.FC<ItemListProps> = ({ onItemSelect }) => {
  const [sortBy, setSortBy] = useState<'item_no' | 'loss'>('item_no');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const { data: items, isLoading, error } = useQuery<ItemData[]>({
    queryKey: ['items-with-loss'],
    queryFn: getItems
  });

  const groupedAndSortedItems = useMemo(() => {
    if (!items) return {};

    const filtered = items.filter(item => 
      item.item_no.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const grouped = filtered.reduce((acc, item) => {
      const date = new Date(item.date);
      const monthYear = !isNaN(date.getTime())
        ? `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`
        : 'Unknown Date';
      
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(item);
      return acc;
    }, {} as Record<string, ItemData[]>);

    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => {
        if (sortBy === 'loss') {
          return sortOrder === 'asc' 
            ? a.loss_percentage - b.loss_percentage
            : b.loss_percentage - a.loss_percentage;
        }
        return sortOrder === 'asc'
          ? a.item_no.localeCompare(b.item_no)
          : b.item_no.localeCompare(a.item_no);
      });
    });

    return Object.fromEntries(
      Object.entries(grouped).sort((a, b) => {
        if (a[0] === 'Unknown Date') return 1;
        if (b[0] === 'Unknown Date') return -1;
        return sortOrder === 'asc'
          ? new Date(a[0]).getTime() - new Date(b[0]).getTime()
          : new Date(b[0]).getTime() - new Date(a[0]).getTime();
      })
    );
  }, [items, sortBy, sortOrder, searchTerm]);

  const toggleGroup = (monthYear: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [monthYear]: !prev[monthYear]
    }));
  };

  const getColorForLossPercentage = (lossPercentage: number) => {
    if (lossPercentage <= 12) {
      const hue = (1 - lossPercentage / 12) * 120;
      return `hsl(${hue}, 100%, 35%)`;
    } else {
      const lightness = Math.max(20, 50 - (lossPercentage - 12) * 2);
      return `hsl(0, 100%, ${lightness}%)`;
    }
  };

  if (isLoading) return <div>Loading items...</div>;

  if (error) {
    console.error('Error loading items:', error);
    return <div>Error loading items. Please check the console for details.</div>;
  }

  if (!items || items.length === 0) {
    console.log('No items available');
    return <div>No items available</div>;
  }

  return (
    <div className="w-64 bg-white dark:bg-gray-800 p-4 shadow-lg flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4">Items</h2>
      <Select onValueChange={(value: 'item_no' | 'loss') => setSortBy(value)} value={sortBy}>
        <SelectTrigger className="w-full mb-4">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item_no">Item Number</SelectItem>
          <SelectItem value="loss">Loss Percentage</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)} value={sortOrder}>
        <SelectTrigger className="w-full mb-4">
          <SelectValue placeholder="Sort order" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">Ascending</SelectItem>
          <SelectItem value="desc">Descending</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div className="space-y-4 overflow-y-auto flex-grow" style={{ maxHeight: 'calc(100vh - 250px)' }}>
        {Object.entries(groupedAndSortedItems).map(([monthYear, monthItems]) => (
          <div key={monthYear} className="border-b border-gray-200 dark:border-gray-700 pb-2">
            <button
              onClick={() => toggleGroup(monthYear)}
              className="flex items-center justify-between w-full text-left font-semibold mb-2 focus:outline-none"
            >
              <span>{monthYear}</span>
              {expandedGroups[monthYear] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            {expandedGroups[monthYear] && (
              <div className="space-y-2 ml-4">
                {monthItems.map((item) => (
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemList;