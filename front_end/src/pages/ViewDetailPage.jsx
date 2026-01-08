// src/pages/ViewDetailPage.jsx
import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Download, Printer, Mail, Calendar, FileText, CheckCircle, Clock, AlertCircle, ArrowLeft, Share2, Tag } from "lucide-react";

const ViewDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { approvalType, id } = useParams();
  const rowData = location.state?.rowData;
  const cardData = location.state?.cardData;

  // If no row data, show error
  if (!rowData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Not Found</h2>
          <p className="text-gray-600 mb-6">
            The requested details could not be found. Please go back and try again.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center justify-center mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Format currency amount
  const formatAmount = (amount, currency) => {
    if (!amount) return "N/A";
    return `${amount} ${currency}`;
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusText = status || "PENDING";
    let bgColor = "bg-gray-100";
    let textColor = "text-gray-800";
    
    switch (statusText.toUpperCase()) {
      case "APPROVED":
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        break;
      case "HOLD":
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
        break;
      case "REJECTED":
        bgColor = "bg-red-100";
        textColor = "text-red-800";
        break;
      case "IN PROGRESS":
        bgColor = "bg-blue-100";
        textColor = "text-blue-800";
        break;
      default:
        bgColor = "bg-gray-100";
        textColor = "text-gray-800";
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {statusText}
      </span>
    );
  };

  // Get icon for status
  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "HOLD":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case "REJECTED":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  // Action buttons
  const actionButtons = [
    {
      label: "Download",
      icon: <Download className="w-4 h-4" />,
      onClick: () => console.log("Download PO", rowData.poNo),
      variant: "outline"
    },
    
  ];

  // Main details sections
  const detailSections = [
    {
      title: "Purchase Order Information",
      items: [
        { label: "PO Number", value: rowData.poNo },
        { label: "PO Type", value: rowData.poType },
        { label: "Cell", value: rowData.cell },
        { label: "Company", value: rowData.company },
        { label: "Department", value: rowData.department },
        { label: "Currency", value: rowData.currency },
        { label: "PO Amount", value: formatAmount(rowData.amount, rowData.currency) },
        { label: "Pending Days", value: `${rowData.pendingDays} days` },
      ]
    },
    {
      title: "Supplier & Product Details",
      items: [
        { label: "Supplier", value: rowData.supplier },
        { label: "Top Product", value: rowData.product },
        { label: "Requested By", value: rowData.requestedBy },
        { label: "Request Date", value: rowData.requestedBy?.split("/")[1]?.trim() || "N/A" },
      ]
    }
  ];

  // Approval details sections
  const approvalSections = [
    {
      title: "First Approval",
      items: [
        { label: "Approver", value: rowData.response1Person || "Not Assigned" },
        { label: "Status", value: rowData.response1Status || "PENDING", isStatus: true },
        { label: "Remarks", value: rowData.response1Remarks || "No remarks provided" },
      ]
    },
    {
      title: "Second Approval",
      items: [
        { label: "Approver", value: rowData.response2Person || "Not Assigned" },
        { label: "Status", value: rowData.response2Status || "PENDING", isStatus: true },
        { label: "Remarks", value: rowData.response2Remarks || "No remarks provided" },
      ]
    }
  ];

  // Get page title
  const pageTitle = cardData?.title || approvalType?.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {rowData.poNo}
            </h1>
            <p className="text-gray-600 mt-1">
              {pageTitle} • ID: {rowData.id} • {getStatusBadge(rowData.finalStatus)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
            {actionButtons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center space-x-2 ${
                  button.variant === "outline" 
                    ? "border border-gray-300 text-gray-700 hover:bg-gray-50" 
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {button.icon}
                <span>{button.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Purchase Order Details */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">Purchase Order Details</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {detailSections[0].items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900 text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Supplier & Product Details */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">Supplier & Product</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {detailSections[1].items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900 text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Approval Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {approvalSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                    {item.isStatus ? (
                      <div className="mb-3">{getStatusBadge(item.value)}</div>
                    ) : (
                      <div className={`text-sm ${item.label === "Remarks" ? "italic text-gray-700 bg-gray-50 p-3 rounded" : "font-medium text-gray-900"}`}>
                        {item.value}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ViewDetailPage;