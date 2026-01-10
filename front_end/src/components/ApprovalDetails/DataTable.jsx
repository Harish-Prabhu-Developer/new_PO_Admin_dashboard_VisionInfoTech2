// src/components/ApprovalDetails/DataTable.jsx
import React, { useState, useMemo } from "react";
import { 
  ChevronUp, 
  ChevronDown, 
  Download, 
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Eye,
  Settings,
  Filter as FilterIcon
} from "lucide-react";
import PaginationComponent from "./Pagination";

/**
 * A highly reusable and dynamic DataTable component.
 * Implements the "Old Theme" style from the provided images.
 */
const DataTable = ({ 
  data = [], 
  columns = [], 
  rowKey = "id",
  title,
  subTitle,
  isLoading = false,
  
  // Selection
  selection = {
    enabled: true,
    selectedRows: [],
    onSelectedRowsChange: () => {}
  },
  
  // Expansion
  expansion = {
    enabled: false,
    expandedRows: [],
    expandedColumns: [],
    onExpandedRowsChange: () => {},
    renderExpansion: null
  },
  
  totalRows = null,
  
  // Pagination
  pagination = {
    enabled: true,
    currentPage: 1,
    itemsPerPage: 10,
    onPageChange: () => {},
    onItemsPerPageChange: () => {}
  },
  
  // Sorting
  sorting = {
    enabled: true,
    sortConfig: { key: null, direction: 'asc' },
    onSortChange: () => {}
  },
  
  // Export
  exportOptions = {
    enabled: true,
    onExport: (format) => console.log(`Export as ${format}`),
    formats: ['csv', 'excel', 'pdf']
  },
  
  // Custom Components/Elements
  bulkActions = null,
  toolbarActions = null,
  emptyMessage = "No records found",
  showSearch = false,
  onSearch = () => {},
  
  // Internal State Fallbacks
  useInternalState = {
    selection: true,
    expansion: true,
    pagination: true,
    sorting: true
  }
}) => {
  // --- Internal State ---
  const [internalSelectedRows, setInternalSelectedRows] = useState([]);
  const [internalExpandedRows, setInternalExpandedRows] = useState([]);
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalItemsPerPage, setInternalItemsPerPage] = useState(pagination.itemsPerPage || 10);
  const [internalSortConfig, setInternalSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState("");
  const [showExportMenu, setShowExportMenu] = useState(false);

  // --- Effective State ---
  const effectiveSelectedRows = useInternalState.selection ? internalSelectedRows : selection.selectedRows;
  const effectiveExpandedRows = useInternalState.expansion ? internalExpandedRows : expansion.expandedRows;
  const effectiveCurrentPage = useInternalState.pagination ? internalCurrentPage : pagination.currentPage;
  const effectiveItemsPerPage = useInternalState.pagination ? internalItemsPerPage : pagination.itemsPerPage;
  const effectiveSortConfig = useInternalState.sorting ? internalSortConfig : sorting.sortConfig;

  // --- Data Processing ---
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter(row => 
      Object.values(row).some(val => 
        String(val).toLowerCase().includes(lowerSearch)
      )
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    if (!effectiveSortConfig.key) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[effectiveSortConfig.key];
      const bValue = b[effectiveSortConfig.key];
      
      if (aValue === bValue) return 0;
      if (aValue < bValue) return effectiveSortConfig.direction === 'asc' ? -1 : 1;
      return effectiveSortConfig.direction === 'asc' ? 1 : -1;
    });
  }, [filteredData, effectiveSortConfig]);

  const effectiveTotalItems = totalRows !== null ? totalRows : sortedData.length;
  const isPaginationAll = effectiveItemsPerPage === 'all';
  const totalPages = isPaginationAll ? 1 : Math.ceil(effectiveTotalItems / effectiveItemsPerPage);
  
  const paginatedData = useMemo(() => {
    if (isPaginationAll || !pagination.enabled) return sortedData;
    const start = (effectiveCurrentPage - 1) * effectiveItemsPerPage;
    return sortedData.slice(start, start + effectiveItemsPerPage);
  }, [sortedData, effectiveCurrentPage, effectiveItemsPerPage, pagination.enabled, isPaginationAll]);

  const startIndex = isPaginationAll ? 0 : (effectiveCurrentPage - 1) * effectiveItemsPerPage;
  const endIndex = isPaginationAll ? effectiveTotalItems : Math.min(startIndex + effectiveItemsPerPage, effectiveTotalItems);

  // --- Handlers ---
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    if (useInternalState.pagination) setInternalCurrentPage(page);
    pagination.onPageChange?.(page);
  };

  const handleItemsPerPageChange = (e) => {
    const value = e.target.value === 'all' ? 'all' : parseInt(e.target.value);
    if (useInternalState.pagination) {
      setInternalItemsPerPage(value);
      setInternalCurrentPage(1);
    }
    pagination.onItemsPerPageChange?.(value);
  };

  const handleSort = (key) => {
    if (!sorting.enabled) return;
    let direction = 'asc';
    if (effectiveSortConfig.key === key && effectiveSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    const newConfig = { key, direction };
    if (useInternalState.sorting) setInternalSortConfig(newConfig);
    sorting.onSortChange?.(newConfig);
  };

  const handleRowSelect = (id) => {
    const newSelected = effectiveSelectedRows.includes(id)
      ? effectiveSelectedRows.filter(rowId => rowId !== id)
      : [...effectiveSelectedRows, id];
    
    if (useInternalState.selection) setInternalSelectedRows(newSelected);
    selection.onSelectedRowsChange?.(newSelected);
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const pageIds = paginatedData.map(row => row[rowKey]);
    
    let newSelected;
    if (isChecked) {
      newSelected = [...new Set([...effectiveSelectedRows, ...pageIds])];
    } else {
      newSelected = effectiveSelectedRows.filter(id => !pageIds.includes(id));
    }
    
    if (useInternalState.selection) setInternalSelectedRows(newSelected);
    selection.onSelectedRowsChange?.(newSelected);
  };

  const toggleRowExpansion = (id) => {
    const newExpanded = effectiveExpandedRows.includes(id) 
      ? effectiveExpandedRows.filter(rowId => rowId !== id) 
      : [...effectiveExpandedRows, id];
    
    if (useInternalState.expansion) setInternalExpandedRows(newExpanded);
    expansion.onExpandedRowsChange?.(newExpanded);
  };

  // Combined expansion columns
  const effectiveExpansionColumns = useMemo(() => {
    const hidden = columns.filter(col => col.responsiveClass && col.responsiveClass.includes('hidden'));
    return [...(expansion.expandedColumns || []), ...hidden];
  }, [expansion.expandedColumns, columns]);

  return (
    <div className="flex flex-col w-full bg-white rounded-lg border border-gray-200 overflow-hidden">
      
      {/* Table Toolbar (Matching Image) */}
      <div className="bg-white px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100">
        <div>
          <h3 className="text-[17px] font-bold text-slate-800 tracking-tight">
            {title} <span className="mx-1.5 opacity-40">•</span> <span className="text-[15px] font-semibold text-slate-500">{effectiveTotalItems} records found</span>
          </h3>
          <p className="text-[13px] text-slate-400 font-medium">
            {effectiveTotalItems} records found <span className="mx-1">•</span> {effectiveSelectedRows.length} selected
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-[13px] text-slate-500 font-semibold">Show:</span>
            <div className="relative">
              <select 
                value={effectiveItemsPerPage}
                onChange={handleItemsPerPageChange}
                className="appearance-none bg-gray-50/50 border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-[13px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
              >
                {[10, 25, 50, 'all'].map(val => (
                  <option key={val} value={val}>{val === 'all' ? 'All' : val}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {exportOptions.enabled && (
            <div className="relative">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center space-x-2 px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-all outline-none"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Export</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in zoom-in-95 duration-200 origin-top-right">
                  {exportOptions.formats.map(format => (
                    <button
                      key={format}
                      onClick={() => {
                        exportOptions.onExport(format);
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-[13px] font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors capitalize"
                    >
                      Export as {format}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {toolbarActions}
        </div>
      </div>

      {/* Bulk Actions */}
      {effectiveSelectedRows.length > 0 && bulkActions && (
        <div className="bg-indigo-600 text-white px-4 py-2.5 flex items-center justify-between">
          <span className="text-[13px] font-bold">{effectiveSelectedRows.length} items selected</span>
          {bulkActions(effectiveSelectedRows)}
        </div>
      )}

      {/* Main Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#c7d2fe]/50 border-b border-gray-200">
            <tr>
              {selection.enabled && (
                <th className="w-12 px-4 py-3.5 text-center">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={paginatedData.length > 0 && paginatedData.every(row => effectiveSelectedRows.includes(row[rowKey]))}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </th>
              )}
              
              {columns.map((col, idx) => (
                <th 
                  key={col.key || idx}
                  onClick={() => handleSort(col.key)}
                  className={`px-4 py-3.5 text-[11px] font-black text-slate-600 uppercase tracking-widest cursor-pointer hover:bg-indigo-100/50 transition-colors whitespace-nowrap ${col.responsiveClass || ''}`}
                >
                  <div className="flex items-center space-x-1.5">
                    <span>{col.label}</span>
                    <div className="flex flex-col opacity-20">
                      <ChevronUp className={`w-2 h-2 ${effectiveSortConfig.key === col.key && effectiveSortConfig.direction === 'asc' ? 'opacity-100 text-indigo-700' : ''}`} />
                      <ChevronDown className={`w-2 h-2 ${effectiveSortConfig.key === col.key && effectiveSortConfig.direction === 'desc' ? 'opacity-100 text-indigo-700' : ''}`} />
                    </div>
                  </div>
                </th>
              ))}

              {expansion.enabled && !expansion.hideExpansionColumn && (
                <th className="w-12 px-4 py-3.5">
                  <span className="sr-only">Details</span>
                </th>
              )}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={columns.length + (selection.enabled ? 1 : 0) + (expansion.enabled ? 1 : 0)} className="p-4">
                    <div className="h-4 bg-slate-50 rounded w-full"></div>
                  </td>
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selection.enabled ? 1 : 0) + (expansion.enabled ? 1 : 0)} className="py-20 text-center text-slate-400 font-medium">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIdx) => (
                <React.Fragment key={row[rowKey] || rowIdx}>
                  <tr className={`hover:bg-slate-50/50 transition-colors ${effectiveSelectedRows.includes(row[rowKey]) ? 'bg-indigo-50/30' : ''}`}>
                    {selection.enabled && (
                      <td className="px-4 py-3.5 text-center">
                        <input 
                          type="checkbox" 
                          checked={effectiveSelectedRows.includes(row[rowKey])}
                          onChange={() => handleRowSelect(row[rowKey])}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>
                    )}
                    
                    {columns.map((col, colIdx) => (
                      <td 
                        key={col.key || colIdx}
                        className={`px-4 py-3.5 text-[13px] text-slate-700 ${col.responsiveClass || ''}`}
                      >
                        {col.render ? col.render(row[col.key], row, { 
                          isExpanded: effectiveExpandedRows.includes(row[rowKey]),
                          toggleExpansion: () => toggleRowExpansion(row[rowKey])
                        }) : (
                          <span className={`${col.key === 'id' || col.key === 'amount' ? 'font-bold text-slate-800' : 'font-medium'}`}>
                            {row[col.key] || '-'}
                          </span>
                        )}
                      </td>
                    ))}

                    {expansion.enabled && !expansion.hideExpansionColumn && (
                      <td className="px-4 py-3.5 text-center">
                        <button 
                          onClick={() => toggleRowExpansion(row[rowKey])}
                          className={`p-1.5 rounded-full transition-transform ${effectiveExpandedRows.includes(row[rowKey]) ? 'rotate-180 text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-500 hover:bg-slate-100'}`}
                        >
                          <ChevronDown size={16} />
                        </button>
                      </td>
                    )}
                  </tr>

                  {/* Expansion Card (Matching structural split from last request) */}
                  {expansion.enabled && effectiveExpandedRows.includes(row[rowKey]) && (
                    <tr className="bg-slate-50/30 border-l-2 border-indigo-400">
                      <td colSpan={columns.length + (selection.enabled ? 1 : 0) + (expansion.enabled ? 1 : 0)} className="p-5">
                        {expansion.renderExpansion ? expansion.renderExpansion(row, effectiveExpansionColumns) : (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-10 p-4 bg-white rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-top-2">
                            {effectiveExpansionColumns.map((eCol, eIdx) => (
                              <div key={eCol.key || eIdx} className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{eCol.label}</p>
                                <p className="text-[13px] font-bold text-slate-800">
                                  {eCol.render ? eCol.render(row[eCol.key], row) : row[eCol.key] || '-'}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Refined Modular Pagination Footer */}
      {pagination.enabled && (
        <PaginationComponent 
          currentPage={effectiveCurrentPage}
          totalPages={totalPages}
          totalFilteredCount={effectiveTotalItems}
          entriesPerPage={isPaginationAll ? effectiveTotalItems : effectiveItemsPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default DataTable;