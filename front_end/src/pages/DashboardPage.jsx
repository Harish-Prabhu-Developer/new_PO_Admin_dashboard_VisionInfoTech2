// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { getIconForTitle } from "../utils/IconHelper";
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
import { useSelector } from "react-redux";

const DashboardPage = () => {
  const navigate = useNavigate();


  const { data } = useSelector((state) => state.poDashboard);
  const [cardData, setCardData] = useState([]);

  useEffect(() => {
    if (data) {
      const formattedData = data.map((item) => ({
        id: item.sno,
        title: item.card_title,
        value: item.card_value,
        iconKey: getIconForTitle(item.card_title),
      }));
      console.table(formattedData);
      setCardData(formattedData);
    }
  }, [data]);

  const CardData = cardData;

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
      console.table(card);

      navigate(slug, {
        state: {
          id: card.id,
          title: card.title,
          value: card.value,
          iconKey: card.iconKey,
        },
      });
    } else {
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
            const Icon = iconMap[card.iconKey] || FileCheck;

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
