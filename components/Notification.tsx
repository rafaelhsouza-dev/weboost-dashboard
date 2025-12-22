import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
  duration?: number;
}

export const Notification: React.FC<NotificationProps> = ({ 
  message, 
  type, 
  onClose, 
  duration = 5000 
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300); // Wait for animation
  };

  const styles = {
    success: "bg-white dark:bg-dark-surface border-primary/20 text-gray-900 dark:text-white",
    error: "bg-gray-900 text-white border-gray-800",
    info: "bg-white dark:bg-dark-surface border-gray-200 text-gray-900 dark:text-white"
  };

  const icons = {
    success: <CheckCircle2 className="text-primary" size={20} />,
    error: <AlertCircle className="text-primary" size={20} />,
    info: <AlertCircle className="text-gray-400" size={20} />
  };

  return (
    <div className={`
      fixed top-6 right-6 z-[100] flex items-center gap-3 p-4 rounded-xl border shadow-2xl min-w-[320px] max-w-md
      transition-all duration-300 transform
      ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      animate-in slide-in-from-right-8
      ${styles[type]}
    `}>
      <div className="shrink-0">
        {icons[type]}
      </div>
      <div className="flex-1 text-sm font-bold tracking-tight">
        {message}
      </div>
      <button 
        onClick={handleClose}
        className="shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors text-gray-400"
      >
        <X size={16} />
      </button>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-primary/20 rounded-full overflow-hidden w-full">
        <div 
          className="h-full bg-primary transition-all linear" 
          style={{ 
            animation: `shrink-width ${duration}ms linear forwards`,
            width: '100%'
          }} 
        />
      </div>

      <style>{`
        @keyframes shrink-width {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};
