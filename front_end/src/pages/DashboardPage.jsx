import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FileCheck,
  Wallet,
  CreditCard,
  Tag,
  PackageCheck,
  Building2,
  RotateCcw,
  DoorOpen,
  Boxes,
  UserPlus,
  Trash2,
  ClipboardList,
  Factory,
  Scissors,
  Plane,
  ReceiptText,
  ShoppingCart,
  Shirt,
  ShieldCheck,
  Clock,
  HandCoins,
  LockKeyhole,
} from "lucide-react";
import toast from "react-hot-toast";

const DashboardPage = () => {
  const navigate = useNavigate();

  const CardData = [
    { id: 1, title: "PO Approval", value: 0, iconKey: "FileCheck" },
    { id: 2, title: "Cash Advance Approval", value: 10, iconKey: "Wallet" },
    { id: 3, title: "Credit Limit Approval", value: 5, iconKey: "CreditCard" },
    { id: 4, title: "Price Approval", value: 8, iconKey: "Tag" },
    { id: 5, title: "Goods Request Approval", value: 2, iconKey: "PackageCheck" },
    { id: 6, title: "Inter-company Approval", value: 4, iconKey: "Building2" },
    { id: 7, title: "Sales Return Approval", value: 1, iconKey: "RotateCcw" },
    { id: 8, title: "Gate Pass Approval", value: 3, iconKey: "DoorOpen" },
    { id: 9, title: "Product Creation Approval", value: 6, iconKey: "Boxes" },
    { id: 10, title: "Customer Creation Approval", value: 7, iconKey: "UserPlus" },
    { id: 11, title: "Wastage Delivery Approval", value: 9, iconKey: "Trash2" },
    { id: 12, title: "Work Order Approval", value: 11, iconKey: "ClipboardList" },
    { id: 13, title: "PFL Work Order Approval", value: 12, iconKey: "Factory" },
    { id: 14, title: "PPRB Roll Cutt Templates", value: 13, iconKey: "Scissors" },
    { id: 15, title: "Expat Travel Leave Approval", value: 14, iconKey: "Plane" },
    { id: 16, title: "SALES PI Approval", value: 15, iconKey: "ReceiptText" },
    { id: 17, title: "PURCHASE PI Approval", value: 16, iconKey: "ShoppingCart" },
    { id: 18, title: "Apparels Dashboard", value: 17, iconKey: "Shirt" },
    { id: 19, title: "PO Approval Head", value: 18, iconKey: "ShieldCheck" },
    { id: 20, title: "Overtime Approval", value: 19, iconKey: "Clock" },
    { id: 21, title: "Expat Leave Encashment", value: 20, iconKey: "HandCoins" },
    { id: 22, title: "Bonce Purchase Order Approval", value: 21, iconKey: "ShoppingCart" },
    { id: 23, title: "Bond Release Request Approval", value: 22, iconKey: "LockKeyhole" },
  ];

  // Icon map (used only in this component)
  const iconMap = {
    FileCheck,
    Wallet,
    CreditCard,
    Tag,
    PackageCheck,
    Building2,
    RotateCcw,
    DoorOpen,
    Boxes,
    UserPlus,
    Trash2,
    ClipboardList,
    Factory,
    Scissors,
    Plane,
    ReceiptText,
    ShoppingCart,
    Shirt,
    ShieldCheck,
    Clock,
    HandCoins,
    LockKeyhole,
  };

  const handleCardClick = (card) => {
    const slug = card.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    // ✅ pass ONLY serializable data
    console.log(slug);  
    if (card.value > 0) {
      navigate(slug, {
      state: {
        id: card.id,
        title: card.title,
        value: card.value,
        iconKey: card.iconKey,
      },
    });
    }else{
      toast.error(`No pending for ${card.title}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-2 py-4">
      <div className="max-w-350 mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of pending approvals and operational requests
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CardData.map((card) => {
            const Icon = iconMap[card.iconKey];

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer relative group"
              >
                <div className="absolute top-0 left-0 h-1 w-full bg-indigo-600 rounded-t-xl" />

                <div className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition">
                      <Icon className="h-7 w-7 text-indigo-600" />
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    {card.title}
                  </p>

                  <p className="mt-3 text-4xl font-bold text-indigo-600">
                    {card.value}
                  </p>

                  {card.value > 0 && (
                    <span className="inline-block mt-2 text-xs text-indigo-600 font-medium animate-pulse">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
