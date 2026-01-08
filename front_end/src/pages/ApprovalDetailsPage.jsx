// src/pages/ApprovalDetailsPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FilterForm from "../components/ApprovalDetails/FilterForm";
import DataTable from "../components/ApprovalDetails/DataTable";
import { Eye } from "lucide-react";

// Mock data for the table (replace with API call)
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
    response1Person: "",
    response1Status: "",
    response1Remarks: "",
    response2Person: "",
    response2Status: "",
    response2Remarks: "",
    finalStatus: "",
  },
  {
    id: 2,
    cell: "A2",
    comp: "AZ",
    poNo: "AZ/MOFF/25-28/PO/2564",
    poType: "DOMESTIC",
    supplier: "MAKELLO GENERAL SUPPLY",
    product: "ALLMINIUM TYPE 3 INCH",
    company: "AZ",
    department: "AZ MEDICAL",
    amount: "8,850,000",
    currency: "TSH",
    requestedBy: "raw / 07-Jan-2026",
    pendingDays: "0",
    response1Person: "",
    response1Status: "",
    response1Remarks: "",
    response2Person: "",
    response2Status: "",
    response2Remarks: "",
    finalStatus: "",
  },
  // Add 15 more records as per the screenshot
  ...Array.from({ length: 13 }, (_, i) => ({
    id: i + 3,
    cell: `A${i + 3}`,
    comp: "AZ",
    poNo: `AZ/MOFF/25-28/PO/25${60 + i}`,
    poType: i % 2 === 0 ? "DOMESTIC" : "IMPORT",
    supplier: i % 3 === 0 ? "ADDAMO MARINA HARDWARE" : i % 3 === 1 ? "VISION INFOTECH LTD" : "POLYFOAM LIMITED",
    product: `Product ${i + 1}`,
    company: "AZ",
    department: i % 2 === 0 ? "AZ MEDICAL" : "FLEXIBLE PACKAGING",
    amount: `${(Math.random() * 10000000).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
    currency: i % 2 === 0 ? "TSH" : "USD",
    requestedBy: `user${i} / ${i+1}-Jan-2026`,
    pendingDays: `${i}`,
    response1Person: i % 4 === 0 ? "Mr.Kalpesh / 07-Jan-2026 12:53:24" : "",
    response1Status: i % 4 === 0 ? "APPROVED" : i % 5 === 0 ? "HOLD" : "",
    response1Remarks: i % 6 === 0 ? "Some remarks here" : "",
    response2Person: i % 7 === 0 ? "Mr.Shaaf / 06-Jan-2026 09:36:30" : "",
    response2Status: i % 7 === 0 ? "APPROVED" : "",
    response2Remarks: i % 8 === 0 ? "Additional remarks" : "",
    finalStatus: i % 4 === 0 ? "APPROVED" : i % 5 === 0 ? "HOLD" : "PENDING",
  }))
];

// Table columns configuration
const getTableColumns = (approvalType, onViewDetails) => {
  const baseColumns = [
    { 
      key: 'action', 
      label: 'Action', 
      render: (_, row) => (
        <button
          onClick={() => onViewDetails(row)}
          className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      )
    },
    { key: 'cell', label: 'Cell', render: (value) => <span className="font-medium">{value}</span> },
    { key: 'comp', label: 'Comp.', render: (value) => <span className="text-xs">{value}</span> },
    { key: 'poNo', label: 'PO No', render: (value) => <span className="text-xs font-mono">{value}</span> },
    { key: 'poType', label: 'PO Type', render: (value) => (
      <span className={`px-2 py-1 text-xs rounded ${value === 'DOMESTIC' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
        {value}
      </span>
    )},
    { key: 'supplier', label: 'Supplier', render: (value) => <span className="text-xs">{value}</span> },
    { key: 'product', label: 'Top 1 Product', render: (value) => <span className="text-xs">{value}</span> },
    { key: 'company', label: 'Company', render: (value) => <span className="text-xs">{value}</span> },
    { key: 'department', label: 'Department', render: (value) => <span className="text-xs">{value}</span> },
    { key: 'amount', label: 'PO Amount', render: (value) => <span className="font-medium">{value}</span> },
    { key: 'currency', label: 'Currency', render: (value) => <span className="text-xs">{value}</span> },
    { key: 'requestedBy', label: 'Requested By', render: (value) => <span className="text-xs">{value}</span> },
    { key: 'pendingDays', label: 'Pending Days', render: (value) => (
      <span className={`px-2 py-1 text-xs rounded ${parseInt(value) > 7 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
        {value}
      </span>
    )},
  ];

  // Add approval-specific columns
  if (approvalType.includes('Approval')) {
    baseColumns.push(
      { key: 'response1Person', label: 'Response 1 Person', render: (value) => <span className="text-xs">{value || '-'}</span> },
      { key: 'response1Status', label: 'Response 1 Status', render: (value) => (
        <span className={`px-2 py-1 text-xs rounded ${
          value === 'APPROVED' ? 'bg-green-100 text-green-800' :
          value === 'HOLD' ? 'bg-yellow-100 text-yellow-800' :
          value === 'REJECTED' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value || 'PENDING'}
        </span>
      )},
      { key: 'response1Remarks', label: 'Response 1 Remarks', render: (value) => <span className="text-xs">{value || '-'}</span> },
      { key: 'response2Person', label: 'Response 2 Person', render: (value) => <span className="text-xs">{value || '-'}</span> },
      { key: 'response2Status', label: 'Response 2 Status', render: (value) => (
        <span className={`px-2 py-1 text-xs rounded ${
          value === 'APPROVED' ? 'bg-green-100 text-green-800' :
          value === 'HOLD' ? 'bg-yellow-100 text-yellow-800' :
          value === 'REJECTED' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value || 'PENDING'}
        </span>
      )},
      { key: 'response2Remarks', label: 'Response 2 Remarks', render: (value) => <span className="text-xs">{value || '-'}</span> },
      { key: 'finalStatus', label: 'Final Status', render: (value) => (
        <span className={`px-2 py-1 text-xs rounded font-medium ${
          value === 'APPROVED' ? 'bg-green-100 text-green-800' :
          value === 'HOLD' ? 'bg-yellow-100 text-yellow-800' :
          value === 'REJECTED' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value || 'IN PROGRESS'}
        </span>
      )}
    );
  }

  return baseColumns;
};

// Helper function to filter data
const filterData = (data, filters) => {
  if (!data || !filters) return data;
  
  return data.filter(item => {
    // Company filter
    if (filters.company && item.company !== filters.company) return false;
    
    // Purchase Type filter
    if (filters.purchaseType && filters.purchaseType !== 'all' && item.poType !== filters.purchaseType.toUpperCase()) return false;
    
    // Supplier filter
    if (filters.supplier && filters.supplier !== 'all') {
      const supplierMatch = item.supplier.toLowerCase().includes(filters.supplier.toLowerCase());
      if (!supplierMatch) return false;
    }
    
    // Department filter
    if (filters.department && filters.department !== 'all') {
      const departmentMatch = item.department.toLowerCase().includes(filters.department.replace('-', ' ').toLowerCase());
      if (!departmentMatch) return false;
    }
    
    // Status filter
    if (filters.status && filters.status !== 'all') {
      const itemStatus = item.finalStatus ? item.finalStatus.toLowerCase() : 'pending';
      if (itemStatus !== filters.status.toLowerCase()) return false;
    }
    
    // Currency filter
    if (filters.currency && item.currency !== filters.currency) return false;
    
    // PO Roll No filter (search in PO No)
    if (filters.poRollNo && !item.poNo.toLowerCase().includes(filters.poRollNo.toLowerCase())) return false;
    
    // Amount filters
    if (filters.minAmount) {
      const amount = parseFloat(item.amount.replace(/,/g, ''));
      if (amount < parseFloat(filters.minAmount)) return false;
    }
    
    if (filters.maxAmount) {
      const amount = parseFloat(item.amount.replace(/,/g, ''));
      if (amount > parseFloat(filters.maxAmount)) return false;
    }
    
    // Date filters (simplified - would need proper date parsing in real app)
    if (filters.searchFrom || filters.searchTo) {
      // In a real app, you would parse the dates from requestedBy
      // For now, we'll just pass all items
    }
    
    return true;
  });
};

const ApprovalDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { approvalType } = useParams();
  const { cardData } = location.state || {};
  
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filteredData, setFilteredData] = useState(mockTableData);

  // Format title from URL
  const formatTitle = (type) => {
    if (!type) return "Approval Details";
    return type
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  const pageTitle = cardData?.title || formatTitle(approvalType);

  // If no data was passed, redirect back
  useEffect(() => {
    if (!cardData && approvalType) {
      // You could fetch data based on approvalType here
      console.log("Fetching data for:", approvalType);
    } else if (!cardData && !approvalType) {
      navigate("/");
    }
  }, [cardData, approvalType, navigate]);

  // Apply filters when filters change
  useEffect(() => {
    const filtered = filterData(mockTableData, filters);
    setFilteredData(filtered);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    console.log("Applying filters:", newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
    setFilteredData(mockTableData);
    console.log("Filters reset");
  };

  const handleRowSelect = (selectedIds) => {
    setSelectedRows(selectedIds);
    console.log("Selected rows:", selectedIds);
  };

  const handleViewDetails = (row) => {
    console.log("Viewing details for:", row);
    
    // Navigate to details page
    navigate(`/${approvalType}/${row.id}`, { 
      state: { 
        rowData: row,
        cardData: cardData
      } 
    });
  };

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(val => val && val !== "").length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full space-y-6">
        {/* Page Header - Removed duplicate header since Layout handles it */}
        
        {/* Filter Form */}
        <FilterForm
          filters={filters}
          onFilterChange={handleFilterChange}
          onApplyFilters={handleFilterChange}
          onReset={handleResetFilters}
          isLoading={isLoading}
          title={`Filter ${pageTitle} Requests`}
        />

        {/* Data Table */}
        <DataTable
          TableHeaderClassName="bg-indigo-200"
          data={filteredData}
          columns={getTableColumns(pageTitle, handleViewDetails)}
          title={`${pageTitle} Pending Requests • ${filteredData.length} records found`}
          onRowSelect={handleRowSelect}
          isLoading={isLoading}
          pagination={true}
          itemsPerPage={10}
        />

        {/* Stats Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600">Total Records</div>
              <div className="text-2xl font-bold text-blue-600">{mockTableData.length}</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600">Approved</div>
              <div className="text-2xl font-bold text-green-600">
                {mockTableData.filter(item => item.finalStatus === 'APPROVED').length}
              </div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-sm text-gray-600">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">
                {mockTableData.filter(item => !item.finalStatus || item.finalStatus === 'PENDING').length}
              </div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-sm text-gray-600">On Hold</div>
              <div className="text-2xl font-bold text-red-600">
                {mockTableData.filter(item => item.finalStatus === 'HOLD').length}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ApprovalDetailsPage;
