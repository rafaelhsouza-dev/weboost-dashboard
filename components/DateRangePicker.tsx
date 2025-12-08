import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Clock } from 'lucide-react';
import { Button } from './Button';

export const DateRangePicker: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize with dates formatted for datetime-local input
  const formatDateTime = (date: Date) => {
    return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
  };

  const getPastDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
  };

  const [startDate, setStartDate] = useState(formatDateTime(getPastDate(30)));
  const [endDate, setEndDate] = useState(formatDateTime(new Date()));
  const [displayLabel, setDisplayLabel] = useState('Últimos 30 dias');

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePreset = (days: number, label: string) => {
    const end = new Date();
    const start = getPastDate(days);
    
    setEndDate(formatDateTime(end));
    setStartDate(formatDateTime(start));
    setDisplayLabel(label);
    setIsOpen(false);
  };

  const handleApply = () => {
    // Basic formatting for display
    const start = new Date(startDate);
    const end = new Date(endDate);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    setDisplayLabel(`${start.toLocaleDateString('pt-PT', options)} - ${end.toLocaleDateString('pt-PT', options)}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <Calendar size={16} className="text-gray-500" />
        <span className="text-sm text-gray-600 dark:text-gray-300 min-w-[140px] text-left">
          {displayLabel}
        </span>
        <ChevronDown size={14} className="text-gray-400" />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 z-50 p-4">
          
          {/* Presets */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <button 
              onClick={() => handlePreset(7, 'Últimos 7 dias')}
              className="px-2 py-1.5 text-xs font-medium bg-gray-50 dark:bg-gray-800 hover:bg-primary/10 hover:text-primary rounded-md border border-gray-100 dark:border-gray-700 transition-colors"
            >
              7 dias
            </button>
            <button 
              onClick={() => handlePreset(15, 'Últimos 15 dias')}
              className="px-2 py-1.5 text-xs font-medium bg-gray-50 dark:bg-gray-800 hover:bg-primary/10 hover:text-primary rounded-md border border-gray-100 dark:border-gray-700 transition-colors"
            >
              15 dias
            </button>
            <button 
              onClick={() => handlePreset(30, 'Últimos 30 dias')}
              className="px-2 py-1.5 text-xs font-medium bg-gray-50 dark:bg-gray-800 hover:bg-primary/10 hover:text-primary rounded-md border border-gray-100 dark:border-gray-700 transition-colors"
            >
              1 mês
            </button>
          </div>

          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Data/Hora Inicial</label>
              <div className="relative">
                <input 
                  type="datetime-local" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1.5 dark:text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Data/Hora Final</label>
              <div className="relative">
                 <input 
                  type="datetime-local" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1.5 dark:text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-gray-100 dark:border-gray-800">
             <Button size="sm" onClick={handleApply} className="text-xs px-3 py-1.5">
               Aplicar Filtro
             </Button>
          </div>
        </div>
      )}
    </div>
  );
};