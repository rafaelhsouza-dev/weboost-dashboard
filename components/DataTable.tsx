import React from 'react';
import { Search, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Input } from './Input';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title: string;
}

export function DataTable<T extends { id: string | number }>({ data, columns, title }: DataTableProps<T>) {

  return (

    <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border shadow-sm overflow-hidden">

      {/* Table Header */}

      <div className="p-4 border-b border-gray-100 dark:border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>

        <div className="relative w-full sm:w-64">

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />

          <input 

             type="text"

             placeholder="Pesquisar..."

             className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-dark-border rounded-lg bg-gray-50 dark:bg-dark-DEFAULT text-gray-900 dark:text-gray-100 focus:ring-primary focus:border-primary focus:outline-none transition-all"

          />

        </div>

      </div>



      {/* Table Content */}

      <div className="overflow-x-auto">

        <table className="w-full text-left text-sm">

          <thead className="bg-gray-50/50 dark:bg-dark-surface/50 border-b border-gray-100 dark:border-dark-border">

            <tr>

              {columns.map((col, idx) => (

                <th key={idx} className={`px-6 py-3 font-medium text-gray-500 dark:text-gray-400 ${col.className || ''}`}>

                  {col.header}

                </th>

              ))}

              <th className="px-6 py-3 text-right text-gray-500 dark:text-gray-400">Ações</th>

            </tr>

          </thead>

          <tbody className="divide-y divide-gray-50 dark:divide-dark-border">

            {data.map((row) => (

              <tr key={row.id} className="hover:bg-primary/[0.02] dark:hover:bg-primary/[0.02] transition-colors">

                {columns.map((col, idx) => (

                  <td key={idx} className="px-6 py-4 text-gray-700 dark:text-gray-300 whitespace-nowrap">

                    {typeof col.accessor === 'function' ? col.accessor(row) : (row[col.accessor] as any)}

                  </td>

                ))}

                <td className="px-6 py-4 text-right">

                  <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors text-gray-400 hover:text-primary">

                    <MoreHorizontal size={18} />

                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>



      {/* Pagination Mock */}

      <div className="p-4 border-t border-gray-100 dark:border-dark-border flex items-center justify-between">

        <span className="text-sm text-gray-500 dark:text-gray-400">Mostrando 1 a 5 de {data.length} resultados</span>

        <div className="flex items-center gap-2">

          <button className="p-2 rounded-lg border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border disabled:opacity-50 transition-colors">

            <ChevronLeft size={16} className="text-gray-600 dark:text-gray-400"/>

          </button>

          <button className="p-2 rounded-lg border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">

            <ChevronRight size={16} className="text-gray-600 dark:text-gray-400"/>

          </button>

        </div>

      </div>

    </div>

  );

}
