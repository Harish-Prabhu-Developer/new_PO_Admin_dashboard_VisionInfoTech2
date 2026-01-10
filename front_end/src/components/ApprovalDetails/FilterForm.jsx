// src/components/ApprovalDetails/FilterForm.jsx
import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  ChevronDown, 
  RefreshCcw, 
  X, 
  Calendar, 
  RotateCcw
} from "lucide-react";

const COMPANY_OPTIONS = [
  { value: "az", label: "Choose Company" },
  { value: "ab", label: "AB" },
  { value: "bc", label: "BC" },
];

const PURCHASE_TYPE_OPTIONS = [
  { value: "domestic", label: "DOMESTIC" },
  { value: "import", label: "IMPORT" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "Choose Status" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "hold", label: "Hold" },
];

/**
 * Filter Form component matching the theme in the provided images.
 */
const FilterForm = ({ 
  filters = {}, 
  onFilterChange, 
  onReset,
  onApplyFilters,
  isLoading = false,
  title = "Filter Approval Requests"
}) => {
  const [localFilters, setLocalFilters] = useState({ ...filters });
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  useEffect(() => {
    setLocalFilters({ ...filters });
  }, [filters]);

  const handleChange = (field, value) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onApplyFilters?.(localFilters);
  };

  const handleReset = () => {
    const cleared = Object.keys(localFilters).reduce((acc, key) => ({ ...acc, [key]: "" }), {});
    setLocalFilters(cleared);
    onReset?.();
  };

  const InputWrapper = ({ label, children }) => (
    <div className="flex flex-col space-y-1.5 flex-1 min-w-[200px]">
      <label className="text-[13px] font-bold text-slate-500">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
      
      {/* Header */}
      <div className="bg-slate-50/50 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-3 text-indigo-600">
          <Filter size={18} className="stroke-[2.5]" />
          <h3 className="text-[15px] font-bold text-slate-800 tracking-tight">{title}</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleReset}
            className="px-4 py-2 text-[13px] font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors flex items-center space-x-2"
          >
            <RotateCcw size={14} />
            <span>Reset All</span>
          </button>
          <button 
            onClick={handleApply}
            disabled={isLoading}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-[13px] font-bold flex items-center space-x-2 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
          >
            <Search size={14} className="stroke-3" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InputWrapper label="Company">
             <div className="relative">
                <select 
                  value={localFilters.company || ""}
                  onChange={(e) => handleChange("company", e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Choose Company</option>
                  <option value="az">AZ Group</option>
                  <option value="ab">AB Logistics</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
             </div>
          </InputWrapper>

          <InputWrapper label="Purchase Type">
             <div className="relative">
                <select 
                  value={localFilters.purchaseType || ""}
                  onChange={(e) => handleChange("purchaseType", e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Choose Purchase Type</option>
                  <option value="domestic">DOMESTIC</option>
                  <option value="import">IMPORT</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
             </div>
          </InputWrapper>

          <InputWrapper label="Supplier">
             <div className="relative">
                <select 
                  value={localFilters.supplier || ""}
                  onChange={(e) => handleChange("supplier", e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Choose Supplier</option>
                  <option value="vision">Vision Infotech</option>
                  <option value="addamo">Addamo Hardware</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
             </div>
          </InputWrapper>

          <InputWrapper label="Department">
             <div className="relative">
                <select 
                  value={localFilters.department || ""}
                  onChange={(e) => handleChange("department", e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Choose Department</option>
                  <option value="medical">AZ Medical</option>
                  <option value="flexible">Flexible Packaging</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
             </div>
          </InputWrapper>

          {/* Second Row */}
          <InputWrapper label="Status">
             <div className="relative">
                <select 
                  value={localFilters.status || ""}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Choose Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="hold">Hold</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
             </div>
          </InputWrapper>

          <InputWrapper label="Search From Date">
             <div className="relative">
                <input 
                  type="date"
                  value={localFilters.searchFrom || ""}
                  onChange={(e) => handleChange("searchFrom", e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                />
             </div>
          </InputWrapper>

          <InputWrapper label="Search To Date">
             <div className="relative">
                <input 
                  type="date"
                  value={localFilters.searchTo || ""}
                  onChange={(e) => handleChange("searchTo", e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                />
             </div>
          </InputWrapper>

          <InputWrapper label="PO Roll No">
             <input 
               type="text"
               placeholder="Enter PO Roll No"
               value={localFilters.poRollNo || ""}
               onChange={(e) => handleChange("poRollNo", e.target.value)}
               className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-300"
             />
          </InputWrapper>
        </div>

        {/* Advanced Toggle */}
        <div className="pt-2 border-t border-slate-100">
           <button 
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="flex items-center space-x-2 text-[14px] font-bold text-slate-700 hover:text-indigo-600 transition-colors"
           >
             <span>Advanced Filters</span>
             <ChevronDown size={14} className={`transition-transform duration-300 ${isAdvancedOpen ? 'rotate-180' : ''}`} />
           </button>
           
           {isAdvancedOpen && (
             <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-2">
                <InputWrapper label="Currency">
                   <select 
                    value={localFilters.currency || ""}
                    onChange={(e) => handleChange("currency", e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] font-semibold text-slate-700 outline-none"
                   >
                     <option value="">All Currencies</option>
                     <option value="TSH">TSH</option>
                     <option value="USD">USD</option>
                   </select>
                </InputWrapper>
                <InputWrapper label="Min Amount">
                   <input 
                    type="number"
                    value={localFilters.minAmount || ""}
                    onChange={(e) => handleChange("minAmount", e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] font-semibold text-slate-700 outline-none"
                   />
                </InputWrapper>
                <InputWrapper label="Max Amount">
                   <input 
                    type="number"
                    value={localFilters.maxAmount || ""}
                    onChange={(e) => handleChange("maxAmount", e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] font-semibold text-slate-700 outline-none"
                   />
                </InputWrapper>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default FilterForm;
