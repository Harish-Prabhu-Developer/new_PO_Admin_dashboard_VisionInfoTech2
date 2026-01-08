// src/components/ProfileModal.jsx
import { ChevronDown, KeyRound, LogOut, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfileModal = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Parse token safely
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("tbgs_access_token")) || {};
  } catch {
    user = {};
  }

  const userName = user?.Emp_Name || user?.User_Approval_Name || "User";
  const userEmail = user?.Email_Address || "";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("tbgs_access_token");
    setIsOpen(false);
    navigate("/login");
  };

  const handleChangePassword = () => {
    setIsOpen(false);
    navigate("/change-password");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none hover:bg-indigo-50 rounded-lg p-1 pr-2 transition-colors duration-200"
      >
        <img
          src={`https://placehold.co/40x40/4f46e5/ffffff?text=${userName.charAt(0)}`}
          alt="profile"
          className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-indigo-500 transition-all duration-300 hover:scale-[1.05] object-cover"
        />
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-800 truncate max-w-30">
            {userName}
          </p>
          <p className="text-xs text-gray-500 truncate max-w-30">
            {userEmail}
          </p>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-5 duration-200">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{userName}</p>
                <p className="text-xs text-gray-500 truncate max-w-40">
                  {userEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={handleChangePassword}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-150"
            >
              <KeyRound className="w-4 h-4" />
              <span>Change Password</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Arrow */}
          <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default ProfileModal;