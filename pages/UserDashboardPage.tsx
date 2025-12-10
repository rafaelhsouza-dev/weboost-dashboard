import React from 'react';

export const UserDashboardPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] text-center">
      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-2xl">
        📈
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Dashboard do Utilizador</h1>
      <p className="text-gray-500 dark:text-gray-400 max-w-md">
        Esta página está em desenvolvimento. Aqui você terá acesso rápido às suas ferramentas.
      </p>
    </div>
  );
};

export default UserDashboardPage;
