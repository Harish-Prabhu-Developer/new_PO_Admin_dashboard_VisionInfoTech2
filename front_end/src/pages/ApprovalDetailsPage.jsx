// src/pages/ApprovalDetailsPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchApprovalDetails, clearApprovalDetails } from "../redux/Slice/ApprovalDetails.Slice";
import FilterForm from "../components/ApprovalDetails/FilterForm";
import DataTable from "../components/ApprovalDetails/DataTable";
import {
  Eye,
  ChevronDown,
  Layers,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
} from "lucide-react";
import toast from "react-hot-toast";

// Mock data remains the same for consistency
// Mock data removed in favor of Redux state


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
          className={`p-1 px-1.5 rounded transition-all border ${isExpanded
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
  {
    key: 'poType', label: 'PO Type', render: (value) => (
      <span className="px-2.5 py-1 text-[11px] font-bold rounded bg-emerald-100 text-emerald-700">
        {value}
      </span>
    )
  },
  { key: 'supplier', label: 'Supplier', render: (value) => <span className="text-[12px] font-bold text-slate-700 leading-tight uppercase max-w-[150px] block">{value}</span> },
  { key: 'product', label: 'Top 1 Product', responsiveClass: 'hidden lg:table-cell', render: (val) => <span className="text-slate-500 italic text-[12px]">{val}</span> },
  { key: 'company', label: 'Company', responsiveClass: 'hidden xl:table-cell' },
  { key: 'department', label: 'Department', responsiveClass: 'hidden md:table-cell' },
  { key: 'amount', label: 'PO Amount', render: (value) => <span className="font-black text-slate-900 text-[14px]">{value}</span> },
  { key: 'currency', label: 'Currency', render: (val) => <span className="text-slate-400 font-bold">{val}</span> },
  { key: 'requestedBy', label: 'Requested By', render: (val) => <span className="text-slate-500 text-[11px] font-semibold">{val}</span> },
  {
    key: 'pendingDays', label: 'Pending Days', render: (value) => (
      <div className="flex justify-center">
        <div className="w-7 h-7 bg-amber-100 text-amber-700 flex items-center justify-center rounded font-bold transition-transform hover:scale-110">
          {value}
        </div>
      </div>
    )
  },
  {
    key: 'finalStatus',
    label: 'Final Status',
    render: (value) => {
      const status = (value || 'PENDING').toUpperCase();
      let styles = "bg-slate-100 text-slate-600 border-slate-200";

      if (status.includes('APPROVED')) styles = "bg-emerald-50 text-emerald-700 border-emerald-200";
      else if (status.includes('PENDING')) styles = "bg-yellow-50 text-yellow-700 border-yellow-200";
      else if (status.includes('REJECTED')) styles = "bg-red-50 text-red-700 border-red-200";
      else if (status.includes('HOLD')) styles = "bg-blue-50 text-blue-700 border-blue-200";

      return (
        <span className={`px-2 py-1 text-[10px] font-black rounded border ${styles}`}>
          {value || 'PENDING'}
        </span>
      );
    }
  },
];


const ApprovalDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { approvalType } = useParams();

  // Extract ID from location state (Fixing previous mismatch)
  // Dashboard sends state: { id, title, value, ... }
  const stateData = location.state || {};
  const sno = stateData.id;
  const cardTitle = stateData.title;

  // Redux State
  const { data: approvalData, loading: reduxLoading } = useSelector((state) => state.approvalDetails);

  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isBulkDropdownOpen, setIsBulkDropdownOpen] = useState(false);

  // Fetch Data on Mount
  useEffect(() => {
    if (sno) {
      dispatch(fetchApprovalDetails(sno));
    }
    return () => {
      dispatch(clearApprovalDetails());
    };
  }, [sno, dispatch]);

  // Sync filtration loading with Redux loading
  useEffect(() => {
    setIsLoading(reduxLoading);
  }, [reduxLoading]);

  const pageTitle = useMemo(() => {
    if (cardTitle) return cardTitle;
    if (!approvalType) return "Approval Details";
    return approvalType.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }, [cardTitle, approvalType]);

  // Extract dynamic options from data
  const { companyOptions, supplierOptions, departmentOptions, purchaseTypeOptions, statusOptions } = useMemo(() => {
    const data = approvalData?.rows || [];
    const companies = new Set();
    const suppliers = new Set();
    const departments = new Set();
    const purchaseTypes = new Set();
    const statuses = new Set();

    data.forEach(item => {
      if (item.comp) companies.add(item.comp);
      if (item.supplier) suppliers.add(item.supplier);
      if (item.department) departments.add(item.department);
      if (item.poType) purchaseTypes.add(item.poType);
      if (item.finalStatus) statuses.add(item.finalStatus);
    });

    return {
      companyOptions: Array.from(companies).map(c => ({ value: c, label: c })),
      supplierOptions: Array.from(suppliers).map(s => ({ value: s, label: s })),
      departmentOptions: Array.from(departments).map(d => ({ value: d, label: d })),
      purchaseTypeOptions: Array.from(purchaseTypes).map(p => ({ value: p, label: p })),
      statusOptions: Array.from(statuses).map(s => ({ value: s, label: s })),
    };
  }, [approvalData]);

  // Combined Data Filtering logic for all parameters
  const filteredData = useMemo(() => {
    // Use Redux Data rows instead of mockTableData
    let data = approvalData?.rows || [];

    // Safety check if data is undefined
    if (!data) return [];

    if (Object.keys(filters).length === 0) return data;

    return data.filter(item => {
      // 1. Company Filter
      if (filters.company && item.comp) {
        if (item.comp.toLowerCase() !== filters.company.toLowerCase()) return false;
      }

      // 2. Purchase Type Filter
      if (filters.purchaseType && filters.purchaseType !== 'all') {
        if (!item.poType || item.poType.toLowerCase() !== filters.purchaseType.toLowerCase()) return false;
      }

      // 3. Supplier Filter
      if (filters.supplier && filters.supplier !== 'all') {
        if (!item.supplier || !item.supplier.toLowerCase().includes(filters.supplier.toLowerCase())) return false;
      }

      // 4. Department Filter
      if (filters.department && filters.department !== 'all') {
        if (!item.department || !item.department.toLowerCase().includes(filters.department.toLowerCase())) return false;
      }

      // 5. Status Filter
      if (filters.status && filters.status !== 'all') {
        const itemStatus = (item.finalStatus || 'PENDING').toLowerCase();
        if (itemStatus !== filters.status.toLowerCase()) return false;
      }

      // 6. PO Number / Roll No Search
      if (filters.poRollNo) {
        if (!item.poNo || !item.poNo.toLowerCase().includes(filters.poRollNo.toLowerCase())) return false;
      }

      // 7. Currency Filter
      if (filters.currency) {
        if (item.currency !== filters.currency) return false;
      }

      // 8. Amount Range Filters
      if (filters.minAmount || filters.maxAmount) {
        // Remove commas and convert to float
        const numericAmount = parseFloat((item.amount || '0').toString().replace(/,/g, ''));
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
  }, [filters, approvalData]);

  const handleBulkStatusChange = (ids, status) => {
    toast.success(`Broadcasting ${status} status for ${ids.length} requests...`);
    setSelectedRows([]);
    setIsBulkDropdownOpen(false);
  };

  const handleApplyFilters = (newFilters) => {
    setIsLoading(true);
    setFilters(newFilters);
    setTimeout(() => setIsLoading(false), 600);
  };

  const handleResetFilters = () => {
    setFilters({});
    toast.success('Filters cleared');
  };

  const handleViewDetails = React.useCallback((row) => {
    navigate(`${row.id}`, { state: { rowData: row, cardData: stateData } });
  }, [approvalType, navigate, stateData]);

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
          companyOptions={companyOptions}
          supplierOptions={supplierOptions}
          departmentOptions={departmentOptions}
          purchaseTypeOptions={purchaseTypeOptions}
          statusOptions={statusOptions}
        />

        {/* Dynamic Data Table Implementation */}
        <DataTable
          title={pageTitle}
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
                      <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full border ${row.response1Status === "APPROVED" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
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
                      <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full border ${row.response2Status === "APPROVED" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
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
                onClick={() => {
                  if (sno) {
                    dispatch(fetchApprovalDetails(sno));
                    toast.success("Refreshing data...");
                  }
                }}
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
            <div className="relative">
              <button
                onClick={() => setIsBulkDropdownOpen(!isBulkDropdownOpen)}
                className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center space-x-2 hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200"
              >
                <span>Change Status</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isBulkDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isBulkDropdownOpen && (
                <div className="absolute top-full mt-2 left-0 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <button
                    onClick={() => handleBulkStatusChange(ids, 'APPROVED')}
                    className="w-full text-left px-4 py-2.5 text-[12px] font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 flex items-center space-x-3 transition-colors"
                  >
                    <CheckCircle size={14} />
                    <span>Mark as Approved</span>
                  </button>
                  <button
                    onClick={() => handleBulkStatusChange(ids, 'PENDING')}
                    className="w-full text-left px-4 py-2.5 text-[12px] font-bold text-slate-600 hover:bg-amber-50 hover:text-amber-600 flex items-center space-x-3 transition-colors"
                  >
                    <Clock size={14} />
                    <span>Mark as Pending</span>
                  </button>
                  <button
                    onClick={() => handleBulkStatusChange(ids, 'HOLD')}
                    className="w-full text-left px-4 py-2.5 text-[12px] font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 flex items-center space-x-3 transition-colors"
                  >
                    <XCircle size={14} />
                    <span>Mark as Hold</span>
                  </button>
                </div>
              )}
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
