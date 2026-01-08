// src/components/ApprovalDetails/DataTable.jsx
import React, { useState } from "react";
import { 
  ChevronUp, 
  ChevronDown, 
  MoreVertical, 
  Download, 
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";

const DataTable = ({ 
  data = [], 
  columns = [], 
  title = "Data Table",
  onRowSelect,
  TableHeaderClassName = "bg-gray-50",
  isLoading = false,
  pagination = true,
  itemsPerPage = 10,
  onItemsPerPageChange,
  exportOptions = {
    enable: true,
    onExport: () => console.log("Export data"),
    formats: ['csv', 'excel', 'pdf']
  }
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState([]);
  const [recordsPerPage, setRecordsPerPage] = useState(itemsPerPage);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const recordsOptions = [10, 20, 30, 50, 100, { value: 'all', label: 'All' }];

  // Calculate pagination
  const totalItems = data.length;
  const totalPages = recordsPerPage === 'all' ? 1 : Math.ceil(totalItems / recordsPerPage);
  const startIndex = recordsPerPage === 'all' ? 0 : (currentPage - 1) * recordsPerPage;
  const endIndex = recordsPerPage === 'all' ? totalItems : startIndex + recordsPerPage;
  const currentData = recordsPerPage === 'all' ? data : data.slice(startIndex, endIndex);

  // Handle records per page change
  const handleRecordsPerPageChange = (value) => {
    const newValue = value === 'all' ? 'all' : parseInt(value);
    setRecordsPerPage(newValue);
    setCurrentPage(1); // Reset to first page
    onItemsPerPageChange?.(newValue);
  };

  // Handle sort
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle row selection
  const handleRowSelect = (id) => {
    const newSelected = selectedRows.includes(id)
      ? selectedRows.filter(rowId => rowId !== id)
      : [...selectedRows, id];
    setSelectedRows(newSelected);
    onRowSelect?.(newSelected);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.length === currentData.length) {
      setSelectedRows([]);
      onRowSelect?.([]);
    } else {
      const allIds = currentData.map(item => item.id);
      setSelectedRows(allIds);
      onRowSelect?.(allIds);
    }
  };

  // Sort data if sortConfig is set
  const sortedData = [...currentData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    
    return pages;
  };

  // Cell renderer function for consistent styling
  const renderCellContent = (value, row, column) => {
    if (column.render) {
      return column.render(value, row);
    }
    
    // Default cell styling - making it reusable
    return (
      <div className="min-h-10 flex items-center">
        <span className="text-sm text-gray-900 line-clamp-2">{value}</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {totalItems} records found • {selectedRows.length} selected
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          {/* Records per page dropdown */}
          <div className="relative">
            <label className="text-xs text-gray-600 mr-2">Show:</label>
            <select
              value={recordsPerPage}
              onChange={(e) => handleRecordsPerPageChange(e.target.value)}
              className="px-5 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
            >
              {recordsOptions.map((option) => {
                const value = typeof option === 'object' ? option.value : option;
                const label = typeof option === 'object' ? option.label : option;
                return (
                  <option key={value} value={value}>
                    {label}
                  </option>
                );
              })}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Export button with dropdown */}
          {exportOptions.enable && (
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 flex items-center space-x-1"
              >
                <Download className="w-3 h-3" />
                <span>Export</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {showExportMenu && (
                <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  {exportOptions.formats.includes('csv') && (
                    <button
                      onClick={() => {
                        exportOptions.onExport?.('csv');
                        setShowExportMenu(false);
                      }}
                      className="w-full px-3 py-2 text-xs text-left text-gray-700 hover:bg-gray-50"
                    >
                      Export as CSV
                    </button>
                  )}
                  {exportOptions.formats.includes('excel') && (
                    <button
                      onClick={() => {
                        exportOptions.onExport?.('excel');
                        setShowExportMenu(false);
                      }}
                      className="w-full px-3 py-2 text-xs text-left text-gray-700 hover:bg-gray-50"
                    >
                      Export as Excel
                    </button>
                  )}
                  {exportOptions.formats.includes('pdf') && (
                    <button
                      onClick={() => {
                        exportOptions.onExport?.('pdf');
                        setShowExportMenu(false);
                      }}
                      className="w-full px-3 py-2 text-xs text-left text-gray-700 hover:bg-gray-50"
                    >
                      Export as PDF
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Table Container with auto layout for full text visibility */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          <thead className={TableHeaderClassName}>
            <tr>
              <th className="w-16 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedRows.length === currentData.length && currentData.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {sortConfig.key === column.key && (
                      sortConfig.direction === 'asc' 
                        ? <ChevronUp className="w-3 h-3 shrink-0" />
                        : <ChevronDown className="w-3 h-3 shrink-0" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            ) : (
              sortedData.map((row) => (
                <tr 
                  key={row.id} 
                  className={`hover:bg-gray-50 ${selectedRows.includes(row.id) ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                  {columns.map((column) => (
                    <td 
                      key={column.key} 
                      className="px-3 py-3 text-sm whitespace-normal"
                    >
                      {renderCellContent(row[column.key], row, column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && recordsPerPage !== 'all' && totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-2 sm:mb-0">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{Math.min(endIndex, totalItems)}</span> of{' '}
              <span className="font-medium">{totalItems}</span> results
              {recordsPerPage && ` • ${recordsPerPage} per page`}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            {/* First page */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              title="First page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Previous page */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`min-w-8 px-2 py-1 text-sm rounded ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next page */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Last page */}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              title="Last page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;