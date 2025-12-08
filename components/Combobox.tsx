import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

export interface Option {
  value: string;
  label: string;
}

interface ComboboxProps {
  label?: string;
  options: Option[];
  value: string | string[]; // Single value or array of values for multi
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  multi?: boolean;
  className?: string;
}

export const Combobox: React.FC<ComboboxProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Selecione...',
  multi = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    return options.filter(opt => 
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const handleSelect = (optionValue: string) => {
    if (multi) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(optionValue)) {
        onChange(currentValues.filter(v => v !== optionValue));
      } else {
        onChange([...currentValues, optionValue]);
      }
      // Keep open for multi select
      setSearchTerm(''); 
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const removeValue = (e: React.MouseEvent, valToRemove: string) => {
    e.stopPropagation();
    if (Array.isArray(value)) {
      onChange(value.filter(v => v !== valToRemove));
    }
  };

  // Display logic
  const getDisplay = () => {
    if (multi && Array.isArray(value) && value.length > 0) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map(val => {
            const opt = options.find(o => o.value === val);
            return (
              <span key={val} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                {opt?.label || val}
                <X 
                  size={12} 
                  className="ml-1 cursor-pointer hover:text-red-500" 
                  onClick={(e) => removeValue(e, val)}
                />
              </span>
            );
          })}
        </div>
      );
    }
    
    if (!multi && value) {
      const opt = options.find(o => o.value === value);
      return <span className="text-gray-900 dark:text-white truncate">{opt?.label}</span>;
    }

    return <span className="text-gray-400">{placeholder}</span>;
  };

  return (
    <div className={`w-full relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      
      {/* Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative min-h-[42px] w-full cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 
          bg-white dark:bg-gray-800 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none 
          ${isOpen ? 'ring-2 ring-primary/20 border-primary' : ''}
        `}
      >
        <div className="block truncate text-sm">
          {getDisplay()}
        </div>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
        </span>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-[#1a1a1a] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-gray-200 dark:border-gray-700">
          
          {/* Search Input */}
          <div className="sticky top-0 z-10 bg-white dark:bg-[#1a1a1a] px-2 py-2 border-b border-gray-100 dark:border-gray-700">
             <input
               type="text"
               className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 py-1.5 px-3 text-sm focus:border-primary focus:outline-none dark:text-white"
               placeholder="Pesquisar..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               autoFocus
               onClick={(e) => e.stopPropagation()}
             />
          </div>

          {filteredOptions.length === 0 ? (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-500 dark:text-gray-400">
              Nenhum resultado encontrado.
            </div>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = multi 
                ? Array.isArray(value) && value.includes(option.value)
                : value === option.value;

              return (
                <div
                  key={option.value}
                  className={`
                    relative cursor-default select-none py-2 pl-10 pr-4 
                    ${isSelected ? 'bg-primary/5 text-primary' : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}
                  `}
                  onClick={() => handleSelect(option.value)}
                >
                  <span className={`block truncate ${isSelected ? 'font-medium' : 'font-normal'}`}>
                    {option.label}
                  </span>
                  {isSelected && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};