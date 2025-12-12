import React from 'react';

const UserSettingsPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-0">
          Configurações do Utilizador
        </h1>
      </div>
      
      <div className="flex flex-col items-center justify-center h-[50vh] text-center bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-2xl">
          ⚙️
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Página em desenvolvimento
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
          Esta página está em desenvolvimento. Em breve você poderá gerenciar as suas preferências.
        </p>
      </div>
    </div>
  );
};

export default UserSettingsPage;
