// src/components/ApprovalDetails/FilterForm.jsx
import React, { useState, useEffect } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";

// Sample data for dropdowns (you would fetch this from API)
const COMPANY_OPTIONS = [
  { value: "az", label: "AZ (15)" },
  { value: "ab", label: "AB" },
  { value: "bc", label: "BC" },
];

const PURCHASE_TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "domestic", label: "DOMESTIC" },
  { value: "import", label: "IMPORT" },
  { value: "export", label: "EXPORT" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "hold", label: "Hold" },
  { value: "rejected", label: "Rejected" },
];

const DEPARTMENT_OPTIONS = [
  { value: "all", label: "All Departments" },
  { value: "az-medical", label: "AZ MEDICAL" },
  { value: "flexible-packaging", label: "FLEXIBLE PACKAGING" },
  { value: "workshop", label: "WORKSHOP" },
  { value: "mover", label: "MOVER" },
  { value: "az-garage", label: "AZ GARAGE" },
  { value: "central-store", label: "CENTRAL STORE" },
];

const SUPPLIER_OPTIONS = [
  { value: "all", label: "All Suppliers" },
  { value: "addamo", label: "ADDAMO MARINA HARDWARE" },
  { value: "makello", label: "MAKELLO GENERAL SUPPLY" },
  { value: "vision", label: "VISION INFOTECH LTD" },
  { value: "polyfoam", label: "POLYFOAM LIMITED" },
  { value: "complex", label: "COMPLICATED TECHNOLOGIES LTD" },
  { value: "phica", label: "PHICA AUTO CENTER" },
];

const FilterForm = ({ 
  filters = {}, 
  onFilterChange, 
  onReset,
  onApplyFilters,
  isLoading = false,
  title = "Filter Options"
}) => {
  const [localFilters, setLocalFilters] = useState({
    company: filters.company || "",
    purchaseType: filters.purchaseType || "",
    supplier: filters.supplier || "",
    department: filters.department || "",
    status: filters.status || "",
    searchFrom: filters.searchFrom || "",
    searchTo: filters.searchTo || "",
    poRollNo: filters.poRollNo || "",
    currency: filters.currency || "",
    minAmount: filters.minAmount || "",
    maxAmount: filters.maxAmount || "",
    ...filters
  });

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters({
      company: filters.company || "",
      purchaseType: filters.purchaseType || "",
      supplier: filters.supplier || "",
      department: filters.department || "",
      status: filters.status || "",
      searchFrom: filters.searchFrom || "",
      searchTo: filters.searchTo || "",
      poRollNo: filters.poRollNo || "",
      currency: filters.currency || "",
      minAmount: filters.minAmount || "",
      maxAmount: filters.maxAmount || "",
      ...filters
    });
  }, [filters]);

  const handleInputChange = (field, value) => {
    const updated = { ...localFilters, [field]: value };
    setLocalFilters(updated);
    // Only notify parent on field change if you want real-time filtering
    // onFilterChange?.(updated);
  };

  const handleReset = () => {
    const resetFilters = {
      company: "",
      purchaseType: "",
      supplier: "",
      department: "",
      status: "",
      searchFrom: "",
      searchTo: "",
      poRollNo: "",
      currency: "",
      minAmount: "",
      maxAmount: "",
    };
    setLocalFilters(resetFilters);
    onReset?.(resetFilters);
  };

  const handleApplyFilters = () => {
    onApplyFilters?.(localFilters);
  };

  const SelectField = ({ label, value, options, field, placeholder = "Choose Below" }) => (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => handleInputChange(field, e.target.value)}
          disabled={isLoading}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white disabled:bg-gray-100"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );

  const DateField = ({ label, value, field, placeholder = "YYYY-MM-DD" }) => (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-700">
        {label}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => handleInputChange(field, e.target.value)}
        disabled={isLoading}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
        placeholder={placeholder}
      />
    </div>
  );

  // Helper to get display value for active filters
  const getDisplayValue = (key, value) => {
    if (!value) return "";
    
    const optionMaps = {
      company: COMPANY_OPTIONS,
      purchaseType: PURCHASE_TYPE_OPTIONS,
      status: STATUS_OPTIONS,
      department: DEPARTMENT_OPTIONS,
      supplier: SUPPLIER_OPTIONS,
    };
    
    if (optionMaps[key]) {
      const option = optionMaps[key].find(opt => opt.value === value);
      return option ? option.label : value;
    }
    
    return value;
  };

  const hasActiveFilters = Object.values(localFilters).some(val => val && val !== "");

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          <Filter className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 disabled:opacity-50"
          >
            Reset All
          </button>
          <button
            onClick={handleApplyFilters}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center space-x-1 disabled:opacity-50"
          >
            <Search className="w-3 h-3" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>

      {/* Filter Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Row 1 */}
          <SelectField
            label="Company"
            value={localFilters.company}
            options={COMPANY_OPTIONS}
            field="company"
            placeholder="Choose Company"
          />
          
          <SelectField
            label="Purchase Type"
            value={localFilters.purchaseType}
            options={PURCHASE_TYPE_OPTIONS}
            field="purchaseType"
            placeholder="Choose Purchase Type"
          />
          
          <SelectField
            label="Supplier"
            value={localFilters.supplier}
            options={SUPPLIER_OPTIONS}
            field="supplier"
            placeholder="Choose Supplier"
          />
          
          <SelectField
            label="Department"
            value={localFilters.department}
            options={DEPARTMENT_OPTIONS}
            field="department"
            placeholder="Choose Department"
          />

          {/* Row 2 */}
          <SelectField
            label="Status"
            value={localFilters.status}
            options={STATUS_OPTIONS}
            field="status"
            placeholder="Choose Status"
          />
          
          <DateField
            label="Search From Date"
            value={localFilters.searchFrom}
            field="searchFrom"
            placeholder="From Date"
          />
          
          <DateField
            label="Search To Date"
            value={localFilters.searchTo}
            field="searchTo"
            placeholder="To Date"
          />
          
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">
              PO Roll No
            </label>
            <input
              type="text"
              value={localFilters.poRollNo}
              onChange={(e) => handleInputChange("poRollNo", e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
              placeholder="Enter PO Roll No"
            />
          </div>
        </div>

        {/* Additional filters (collapsible) */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-gray-700">
              <span>Advanced Filters</span>
              <ChevronDown className="w-4 h-4 transform group-open:rotate-180 transition-transform" />
            </summary>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">
                  Currency
                </label>
                <select
                  value={localFilters.currency || ""}
                  onChange={(e) => handleInputChange("currency", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Currencies</option>
                  <option value="TSH">TSH</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">
                  Min Amount
                </label>
                <input
                  type="number"
                  value={localFilters.minAmount || ""}
                  onChange={(e) => handleInputChange("minAmount", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Min Amount"
                  min="0"
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">
                  Max Amount
                </label>
                <input
                  type="number"
                  value={localFilters.maxAmount || ""}
                  onChange={(e) => handleInputChange("maxAmount", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Max Amount"
                  min="0"
                />
              </div>
            </div>
          </details>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="px-4 py-2 bg-blue-50 border-t border-blue-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-800 font-medium">Active Filters:</span>
            <button
              onClick={handleReset}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {Object.entries(localFilters)
              .filter(([_, value]) => value && value !== "")
              .map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                >
                  {key === 'minAmount' || key === 'maxAmount' 
                    ? `${key.replace('min', 'Min ').replace('max', 'Max ')}: ${value}` 
                    : `${key}: ${getDisplayValue(key, value)}`
                  }
                  <button
                    onClick={() => handleInputChange(key, "")}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterForm;