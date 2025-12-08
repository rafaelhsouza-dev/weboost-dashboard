import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
}

export const RetentixLogo: React.FC<LogoProps> = ({ className = '', variant = 'full' }) => {
  return (
    <svg 
      viewBox="0 0 200 50" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="Retentix Logo"
    >
      <defs>
        <linearGradient id="logo_gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1f3ab9" />
          <stop offset="1" stopColor="#992091" />
        </linearGradient>
      </defs>

      {/* Ícone (Sempre visível) - Estilizado 'R' abstrato com gráfico */}
      <g transform="translate(0, 5)">
        <rect x="0" y="0" width="40" height="40" rx="10" fill="url(#logo_gradient)" fillOpacity="0.1" />
        <path 
          d="M12 28L18 20L24 26L32 14" 
          stroke="url(#logo_gradient)" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <circle cx="12" cy="28" r="2" fill="#1f3ab9" />
        <circle cx="32" cy="14" r="2" fill="#992091" />
      </g>

      {/* Texto (Apenas visível na variante 'full') */}
      {variant === 'full' && (
        <g transform="translate(50, 0)">
          <text 
            x="0" 
            y="33" 
            fontFamily="'Inter', sans-serif" 
            fontWeight="700" 
            fontSize="28" 
            className="fill-gray-900 dark:fill-white"
          >
            Retentix
          </text>
          {/* Ponto colorido no final */}
          <circle cx="125" cy="30" r="3" fill="#992091" />
        </g>
      )}
    </svg>
  );
};