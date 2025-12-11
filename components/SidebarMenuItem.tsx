import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface SidebarMenuItemProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  children?: { id: string; label: string; icon: React.ReactNode; path: string }[];
  onClick?: () => void;
  isOpen?: boolean;
}

export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  id,
  label,
  icon,
  path,
  children,
  onClick,
  isOpen = false
}) => {
  return (
    <div className="w-full">
      <div 
        className={`flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors ${isOpen ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
        onClick={onClick}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span>{label}</span>
        </div>
        {children && (
          <div className="transform transition-transform duration-200">
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </div>
        )}
      </div>
      {isOpen && children && (
        <div className="ml-4 space-y-2 py-2">
          {children.map((child) => (
            <div 
              key={child.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = child.path;
              }}
            >
              {child.icon}
              <span>{child.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarMenuItem;
