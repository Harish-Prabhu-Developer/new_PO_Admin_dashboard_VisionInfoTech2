// src/components/ProfileModal.jsx
import { ChevronDown, KeyRound, LogOut, User, Settings, Shield } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSidebarMenu } from "../hooks/useSidebarMenu";

const ProfileModal = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Use Redux state
  const { userData, clearUserData } = useSidebarMenu();
  
  const userName = userData?.Emp_Name || userData?.User_Approval_Name || "User";
  const userEmail = userData?.Email_Address || "";
  const userRole = userData?.Employee_Signed_As || "Admin";

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
    clearUserData();
    setIsOpen(false);
    navigate("/login");
  };

  const handleChangePassword = () => {
    setIsOpen(false);
    navigate("/change-password");
  };

  const handleProfileSettings = () => {
    setIsOpen(false);
    navigate("/profile-settings");
  };

  // Count user permissions
  const countPermissions = () => {
    if (!userData) return 0;
    let count = 0;
    Object.keys(userData).forEach(key => {
      if (key.includes('_YN') && userData[key] === 'YES') {
        count++;
      }
    });
    return count;
  };

  const permissionCount = countPermissions();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none hover:bg-indigo-50 rounded-lg p-1 pr-2 transition-colors duration-200"
        aria-label="User profile menu"
        aria-expanded={isOpen}
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            {userName.charAt(0)}
          </div>
          {permissionCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">{permissionCount}</span>
            </div>
          )}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-800 truncate max-w-32">
            {userName}
          </p>
          <p className="text-xs text-gray-500 truncate max-w-32">
            {userRole}
          </p>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-5 duration-200">
          {/* User Info */}
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                {userName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
                <p className="text-xs text-gray-500 truncate max-w-48">
                  {userEmail}
                </p>
                <div className="flex items-center mt-1">
                  <Shield className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600 font-medium">
                    {permissionCount} permissions active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <div className="text-xs text-blue-600 font-medium">Company</div>
                <div className="text-sm font-bold text-gray-800">AZ</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <div className="text-xs text-green-600 font-medium">Access</div>
                <div className="text-sm font-bold text-gray-800">
                  {userData?.Online_Access === 'AC' ? 'Active' : 'Limited'}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={handleProfileSettings}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-150"
            >
              <User className="w-4 h-4" />
              <span>Profile Settings</span>
            </button>

            <button
              onClick={handleChangePassword}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-150"
            >
              <KeyRound className="w-4 h-4" />
              <span>Change Password</span>
            </button>

            <div className="border-t border-gray-100 my-1"></div>

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