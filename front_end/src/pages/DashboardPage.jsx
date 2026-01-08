// src/pages/DashboardPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();
  
  const CardData = [
    { id: 1, title: "PO Approval", value: 0 },
    { id: 2, title: "Cash Advance Approval", value: 10 },
    { id: 3, title: "Credit Limit Approval", value: 5 },
    { id: 4, title: "Price Approval", value: 8 },
    { id: 5, title: "Goods Request Approval", value: 2 },
    { id: 6, title: "Inter-company Approval", value: 4 },
    { id: 7, title: "Sales Return Approval", value: 1 },
    { id: 8, title: "Gate Pass Approval", value: 3 },
    { id: 9, title: "Product Creation Approval", value: 6 },
    { id: 10, title: "Customer Creation Approval", value: 7 },
    { id: 11, title: "Wastage Delivery Approval", value: 9 },
    { id: 12, title: "Work Order Approval", value: 11 },
    { id: 13, title: "PFL Work Order Approval", value: 12 },
    { id: 14, title: "PPRB Roll Cutt Templates", value: 13 },
    { id: 15, title: "Expat Travel Leave Approval", value: 14 },
    { id: 16, title: "SALES PI Approval", value: 15 },
    { id: 17, title: "PURCHASE PI Approval", value: 16 },
    { id: 18, title: "Apparels Dashboard", value: 17 },
    { id: 19, title: "PO Approval Head", value: 18 },
    { id: 20, title: "Overtime Approval", value: 19 },
    { id: 21, title: "Expat Leave Encashment", value: 20 },
    { id: 22, title: "Bonce Purchase Order Approval", value: 21 },
    { id: 23, title: "Bond Release Request Approval", value: 22 },
  ];

  const handleCardClick = (card) => {
    // Convert title to URL-friendly format
    const urlFriendlyTitle = card.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')          // Replace spaces with hyphens
      .replace(/-+/g, '-');          // Replace multiple hyphens with single
    
    navigate(`/${urlFriendlyTitle}`, { 
      state: { cardData: card } 
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 px-2 py-4">
      <div className="max-w-350 mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-gray-900">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of pending approvals and operational requests
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CardData.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className="
                bg-white
                rounded-xl
                border border-gray-200
                shadow-sm
                hover:shadow-md
                transition
                cursor-pointer
                relative
              "
            >
              {/* Accent */}
              <div className="absolute top-0 left-0 h-1 w-full bg-indigo-600 rounded-t-xl" />

              <div className="p-6 text-center">
                <p className="text-lg font-semibold text-gray-800 uppercase">
                  {card.title}
                </p>

                <p className="mt-3 text-4xl font-bold text-indigo-600">
                  {card.value}
                </p>

                <span className="inline-block mt-2 text-xs text-indigo-600 font-medium">
                  Pending
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;