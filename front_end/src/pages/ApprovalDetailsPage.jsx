// src/pages/ApprovalDetailsPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FilterForm from "../components/ApprovalDetails/FilterForm";
import DataTable from "../components/ApprovalDetails/DataTable";
import { 
  Eye, 
  ChevronUp, 
  ChevronDown, 
  Layers, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Settings, 
  Send,
  Trash2
} from "lucide-react";
import toast from "react-hot-toast";

// Mock data remains the same for consistency
const mockTableData = [
  {
    id: 1,
    cell: "A1",
    comp: "AZ",
    poNo: "AZ/MOFF/25-28/PO/2568",
    poType: "DOMESTIC",
    supplier: "ADDAMO MARINA HARDWARE",
    product: "RED SILICON B50/PC",
    company: "AZ",
    department: "ATOZ 1 DEPT",
    amount: "29,500",
    currency: "TSH",
    requestedBy: "raw / 07-Jan-2026",
    pendingDays: "0",
    response1Person: "Mr. Kalpesh",
    response1Status: "APPROVED",
    response1Remarks: "Quality checked",
    response2Person: "Shaaf",
    response2Status: "PENDING",
    response2Remarks: "",
    finalStatus: "HOLD",
  },
  ...Array.from({ length: 15 }, (_, i) => ({
    id: i + 2,
    cell: `A${i + 2}`,
    comp: "AZ",
    poNo: `AZ/MOFF/25-28/PO/25${60 + i}`,
    poType: i % 2 === 0 ? "DOMESTIC" : "IMPORT",
    supplier: i % 3 === 0 ? "ADDAMO MARINA HARDWARE" : i % 3 === 1 ? "VISION INFOTECH LTD" : "POLYFOAM LIMITED",
    product: `Industrial Part ${i + 101}`,
    company: "AZ",
    department: i % 2 === 0 ? "AZ MEDICAL" : "FLEXIBLE PACKAGING",
    amount: `${(Math.random() * 5000000).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
    currency: i % 2 === 0 ? "TSH" : "USD",
    requestedBy: `user${i} / ${i+1}-Jan-2026`,
    pendingDays: `${i}`,
    response1Person: i % 4 === 0 ? "Mr.Kalpesh / 07-Jan-2026 12:53:24" : "Mr. John",
    response1Status: i % 4 === 0 ? "APPROVED" : i % 5 === 0 ? "HOLD" : "APPROVED",
    response1Remarks: i % 6 === 0 ? "Some remarks here" : "",
    response2Person: i % 7 === 0 ? "Mr.Shaaf / 06-Jan-2026 09:36:30" : "Shaaf",
    response2Status: i % 7 === 0 ? "APPROVED" : "PENDING",
    response2Remarks: i % 8 === 0 ? "Additional remarks" : "",
    finalStatus: i % 4 === 0 ? "APPROVED" : i % 5 === 0 ? "HOLD" : "PENDING",
  }))
];

// Main Table columns matching the "Old Theme" images
const getTableColumns = (onViewDetails) => [
  { 
    key: 'action', 
    label: 'Action', 
    render: (_, row, { isExpanded, toggleExpansion }) => (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onViewDetails(row)}
          className="p-1 px-1.5 text-indigo-500 hover:bg-indigo-50 rounded transition-all border border-transparent hover:border-indigo-100"
          title="View Details"
        >
          <Eye size={16} strokeWidth={2.5} />
        </button>
        <button 
          onClick={toggleExpansion}
          className={`p-1 px-1.5 rounded transition-all border ${
            isExpanded 
              ? 'bg-indigo-600 text-white border-indigo-600 rotate-180' 
              : 'text-slate-400 hover:bg-slate-100 border-transparent'
          }`}
          title={isExpanded ? "Collapse" : "Expand"}
        >
          <ChevronDown size={14} strokeWidth={3} />
        </button>
      </div>
    )
  },
  { key: 'cell', label: 'Cell', render: (val) => <span className="font-bold text-slate-800">{val}</span> },
  { key: 'comp', label: 'Comp.', render: (val) => <span className="text-slate-500 font-semibold">{val}</span> },
  { key: 'poNo', label: 'PO NO', render: (value) => <span className="text-[13px] font-bold text-slate-700">{value}</span> },
  { key: 'poType', label: 'PO Type', render: (value) => (
    <span className="px-2.5 py-1 text-[11px] font-bold rounded bg-emerald-100 text-emerald-700">
      {value}
    </span>
  )},
  { key: 'supplier', label: 'Supplier', render: (value) => <span className="text-[12px] font-bold text-slate-700 leading-tight uppercase max-w-[150px] block">{value}</span> },
  { key: 'product', label: 'Top 1 Product', responsiveClass: 'hidden lg:table-cell', render: (val) => <span className="text-slate-500 italic text-[12px]">{val}</span> },
  { key: 'company', label: 'Company', responsiveClass: 'hidden xl:table-cell' },
  { key: 'department', label: 'Department', responsiveClass: 'hidden md:table-cell' },
  { key: 'amount', label: 'PO Amount', render: (value) => <span className="font-black text-slate-900 text-[14px]">{value}</span> },
  { key: 'currency', label: 'Currency', render: (val) => <span className="text-slate-400 font-bold">{val}</span> },
  { key: 'requestedBy', label: 'Requested By', render: (val) => <span className="text-slate-500 text-[11px] font-semibold">{val}</span> },
  { key: 'pendingDays', label: 'Pending Days', render: (value) => (
    <div className="flex justify-center">
      <div className="w-7 h-7 bg-amber-100 text-amber-700 flex items-center justify-center rounded font-bold transition-transform hover:scale-110">
        {value}
      </div>
    </div>
  )},
];

// Expanded Secondary columns (shown in the row expansion area)
const getExpandedColumns = () => [
  { key: 'comp', label: 'Company' },
  { key: 'department', label: 'Department' },
  { key: 'requestedBy', label: 'Requested By' },
  { key: 'pendingDays', label: 'Pending Since', render: (val) => `${val} Days` },
  { key: 'cell', label: 'Source Cell' },
  { key: 'currency', label: 'Base Currency' },
  { key: 'response1Person', label: 'Reviewer 1' },
  { key: 'response2Person', label: 'Director' },
];

const ApprovalDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { approvalType } = useParams();
  const { cardData } = location.state || {};
  
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const pageTitle = useMemo(() => {
    if (cardData?.title) return cardData.title;
    if (!approvalType) return "Approval Details";
    return approvalType.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }, [cardData, approvalType]);

  // Combined Data Filtering logic for all parameters
  const filteredData = useMemo(() => {
    let data = mockTableData;
    
    if (Object.keys(filters).length === 0) return data;

    return data.filter(item => {
      // 1. Company Filter
      if (filters.company && item.comp.toLowerCase() !== filters.company.toLowerCase()) return false;
      
      // 2. Purchase Type Filter
      if (filters.purchaseType && filters.purchaseType !== 'all' && item.poType.toLowerCase() !== filters.purchaseType.toLowerCase()) return false;
      
      // 3. Supplier Filter
      if (filters.supplier && filters.supplier !== 'all') {
        const supplierMatch = item.supplier.toLowerCase().includes(filters.supplier.toLowerCase());
        if (!supplierMatch) return false;
      }
      
      // 4. Department Filter
      if (filters.department && filters.department !== 'all') {
        const deptMatch = item.department.toLowerCase().includes(filters.department.replace('-', ' ').toLowerCase());
        if (!deptMatch) return false;
      }
      
      // 5. Status Filter
      if (filters.status && filters.status !== 'all') {
        const itemStatus = (item.finalStatus || 'PENDING').toLowerCase();
        if (itemStatus !== filters.status.toLowerCase()) return false;
      }
      
      // 6. PO Number / Roll No Search
      if (filters.poRollNo && !item.poNo.toLowerCase().includes(filters.poRollNo.toLowerCase())) return false;
      
      // 7. Currency Filter
      if (filters.currency && item.currency !== filters.currency) return false;
      
      // 8. Amount Range Filters
      if (filters.minAmount || filters.maxAmount) {
        const numericAmount = parseFloat(item.amount.replace(/,/g, ''));
        if (filters.minAmount && numericAmount < parseFloat(filters.minAmount)) return false;
        if (filters.maxAmount && numericAmount > parseFloat(filters.maxAmount)) return false;
      }

      // 9. Date Filters (Simulated logic for mock data)
      if (filters.searchFrom || filters.searchTo) {
        // In a real app we'd parse the date. Mock requestedBy is "User / Date"
        // For standard behavior, we assume everything passes mock for now unless specifically parsed
      }
      
      return true;
    });
  }, [filters]);

  const handleBulkApprove = (ids) => {
    toast.success(`Broadcasting approval for ${ids.length} requests...`);
    setSelectedRows([]);
  };

  const handleApplyFilters = (newFilters) => {
    setIsLoading(true);
    setFilters(newFilters);
    setTimeout(() => setIsLoading(false), 600);
  };

  const handleResetFilters = () => {
    setFilters({});
    toast('Filters cleared', { icon: '🧹' });
  };

  const handleViewDetails = React.useCallback((row) => {
    navigate(`${row.id}`, { state: { rowData: row, cardData } });
  }, [approvalType, navigate, cardData]);

  const tableColumns = useMemo(() => getTableColumns(handleViewDetails), [handleViewDetails]);

  return (
    <div className="min-h-screen bg-transparent pb-10">
      <div className="w-full space-y-6">
        
        {/* Advanced Filter Component */}
        <FilterForm
          filters={filters}
          onFilterChange={setFilters}
          onApplyFilters={handleApplyFilters}
          onReset={handleResetFilters}
          isLoading={isLoading}
          title={`Filter ${pageTitle} Requests`}
        />

        {/* Dynamic Data Table Implementation */}
        <DataTable
          title={`${pageTitle} Analysis`}
          subTitle={`Active View`}
          data={filteredData}
          totalRows={filteredData.length} // Explicit length property
          columns={tableColumns}
          isLoading={isLoading}
          showSearch={true}
          onSearch={setSearchTerm}
          
          // Selection Configuration
          selection={{
            enabled: true,
            selectedRows,
            onSelectedRowsChange: setSelectedRows
          }}
          
          // Expansion Configuration - Highly Enhanced "Neat & Clear" Design
          expansion={{
            enabled: true,
            expandedRows,
            hideExpansionColumn: true, // Merged into Action column
            onExpandedRowsChange: setExpandedRows,
            renderExpansion: (row) => (
              <div className="flex flex-col space-y-6 px-4 py-6 bg-slate-50/30 rounded-xl border border-slate-100 animate-in slide-in-from-top-2 duration-500">
                
                {/* --- Section 1: Request DNA (Metadata Summary) --- */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-x-12 gap-y-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Organization Unit</span>
                    <div className="flex items-center space-x-2">
                       <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                       <span className="text-[14px] font-bold text-slate-800">{row.comp} — {row.company}</span>
                    </div>
                  </div>
                  <div className="flex flex-col border-l border-slate-100 pl-8">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Financial Axis</span>
                    <p className="text-[14px] font-bold text-slate-800 uppercase">{row.currency} Base</p>
                  </div>
                  <div className="flex flex-col border-l border-slate-100 pl-8">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Operational Dept</span>
                    <p className="text-[14px] font-bold text-slate-800">{row.department}</p>
                  </div>
                  <div className="flex flex-col border-l border-slate-100 pl-8">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Source Record ID</span>
                    <p className="text-[14px] font-bold text-slate-800">#{row.id.toString().padStart(4, '0')}</p>
                  </div>
                </div>

                {/* --- Section 2: Workflow Lifecycle (Dual Tracking) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Enhanced Response 1 Log */}
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-indigo-50/50 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                         <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white">01</div>
                         <span className="text-[12px] font-black text-slate-800 uppercase tracking-tight">Technical Review</span>
                      </div>
                      <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full border ${
                        row.response1Status === "APPROVED" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        {row.response1Status || "AWAITING"}
                      </span>
                    </div>
                    
                    <div className="p-5 space-y-5">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                          <Eye className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Reviewing Authority</p>
                          <p className="text-[14px] font-bold text-slate-800">{row.response1Person || "Not Initiated"}</p>
                        </div>
                      </div>
                      
                      <div className="relative pl-4 border-l-2 border-slate-100 py-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Audit Remarks</p>
                        <p className="text-[13px] text-slate-600 leading-relaxed font-medium capitalize italic">
                          "{row.response1Remarks || "Pending technical validation of specific line items and supplier terms."}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Response 2 Log */}
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-indigo-50/50 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                         <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white">02</div>
                         <span className="text-[12px] font-black text-slate-800 uppercase tracking-tight">Executive Decision</span>
                      </div>
                      <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full border ${
                        row.response2Status === "APPROVED" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        {row.response2Status || "PENDING"}
                      </span>
                    </div>
                    
                    <div className="p-5 space-y-5">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                          <Settings className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Approving Authority</p>
                          <p className="text-[14px] font-bold text-slate-800">{row.response2Person || "Final Tier Pending"}</p>
                        </div>
                      </div>
                      
                      <div className="relative pl-4 border-l-2 border-slate-100 py-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Final Remarks</p>
                        <p className="text-[13px] text-slate-600 leading-relaxed font-medium capitalize italic">
                          "{row.response2Remarks || "Awaiting final sign-off from the department head to execute procurement."}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          }}
          
          // Custom Toolbar Actions
          toolbarActions={(
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsLoading(true) || setTimeout(() => setIsLoading(false), 800)}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-indigo-600 transition-all shadow-sm active:rotate-180 duration-500"
              >
                <RefreshCw size={16} />
              </button>
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 shadow-sm">
                <Settings size={16} />
              </button>
            </div>
          )}
          
          // Bulk Actions Implementation
          bulkActions={(ids) => (
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => handleBulkApprove(ids)}
                className="px-4 py-1 bg-white text-indigo-700 rounded text-xs font-black flex items-center space-x-2 hover:bg-indigo-50 transition-colors shadow-sm"
              >
                <Send size={12} />
                <span>Bulk Approve</span>
              </button>
              <button 
                className="px-4 py-1 bg-red-500 text-white rounded text-xs font-black flex items-center space-x-2 hover:bg-red-600 transition-colors shadow-sm"
              >
                <Trash2 size={12} />
                <span>Move to Archive</span>
              </button>
            </div>
          )}

          useInternalState={{
            selection: false, // Page manages selection
            expansion: false, // Page manages expansion
            pagination: true, // Table manages pagination
            sorting: true     // Table manages sorting
          }}
        />

        {/* Dynamic Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Filtered Volume', value: filteredData.length, color: 'indigo', icon: Layers },
            { label: 'Approved Ratio', value: `${Math.round((filteredData.filter(i => i.finalStatus === 'APPROVED').length / filteredData.length) * 100) || 0}%`, color: 'emerald', icon: CheckCircle },
            { label: 'Aging Average', value: '4.2 Days', color: 'amber', icon: Clock },
            { label: 'Priority Alerts', value: filteredData.filter(i => parseInt(i.pendingDays) > 7).length, color: 'rose', icon: XCircle }
          ].map((stat, i) => (stat &&
            <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-xl hover:border-indigo-100 transition-all cursor-default">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h5 className="text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{stat.value}</h5>
              </div>
              <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                <stat.icon size={20} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ApprovalDetailsPage;
