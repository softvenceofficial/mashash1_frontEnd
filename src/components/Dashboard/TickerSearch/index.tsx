import { Label } from "@/components/ui/label";
import { SidebarInput } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Types
export interface TStockItem {
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  logo?: string;
}

interface TickerSearchProps {
  onSelect?: (stock: TStockItem) => void;
  placeholder?: string;
  className?: string;
  data?: TStockItem[];
}

const mockStockData: TStockItem[] = [
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    exchange: 'NASDAQ',
    currency: 'USD',
    logo: '🏢'
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    exchange: 'NASDAQ',
    currency: 'USD',
    logo: '🍎'
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com',
    exchange: 'NASDAQ',
    currency: 'USD',
    logo: '📦'
  },
  {
    symbol: 'NFLX',
    name: 'Netflix, Inc.',
    exchange: 'NASDAQ',
    currency: 'USD',
    logo: 'N'
  },
  {
    symbol: 'META',
    name: 'Meta',
    exchange: 'NASDAQ',
    currency: 'USD',
    logo: '∞'
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    exchange: 'NASDAQ',
    currency: 'USD',
    logo: 'G'
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    exchange: 'NASDAQ',
    currency: 'USD',
    logo: '⚡'
  }
];

// Stock item component
const StockItem: React.FC<{ stock: TStockItem; onClick: () => void }> = ({ stock, onClick }) => (
  <div
    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
    onClick={onClick}
  >
    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg text-sm font-medium">
      {stock.logo || stock.symbol.charAt(0)}
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-medium text-gray-900">{stock.symbol}</div>
    </div>
    <div className="text-right">
      <div className="text-sm truncate">{stock.name}</div>
      <div className="text-gray-500 text-sm flex justify-end gap-2">
        <div>{stock.exchange}</div>
        <div>{stock.currency}</div>
      </div>
    </div>
  </div>
);

export default function TickerSearch({
  onSelect,
  placeholder = "Search Ticker...",
  className = "",
  data = mockStockData
}: TickerSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredStocks, setFilteredStocks] = useState<TStockItem[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter stocks based on query
  useEffect(() => {
    if (!query.trim()) {
      setFilteredStocks([]);
      setIsOpen(false);
      return;
    }

    const filtered = data.filter(stock =>
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredStocks(filtered);
    setIsOpen(filtered.length > 0);
    setFocusedIndex(-1);
  }, [query, data]);

  // Handle stock selection
  const handleSelect = (stock: TStockItem) => {
    setQuery(stock.symbol);
    setIsOpen(false);
    setFocusedIndex(-1);
    onSelect?.(stock);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev =>
          prev < filteredStocks.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev =>
          prev > 0 ? prev - 1 : filteredStocks.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0) {
          handleSelect(filteredStocks[focusedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Label htmlFor="ticker-search" className="sr-only">
          Search Ticker
        </Label>
        <SidebarInput
          id="search"
          ref={inputRef}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          className="h-[3rem] pr-9 bg-sidebar"
        />
        <Search className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 opacity-50 select-none" />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto z-50"
        >
          {filteredStocks.map((stock, index) => (
            <div
              key={stock.symbol}
              className={cn(
                "transition-colors",
                index === focusedIndex ? "bg-blue-50" : ""
              )}
            >
              <StockItem
                stock={stock}
                onClick={() => handleSelect(stock)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
