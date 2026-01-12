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

  const userName = userData?.emp_name || userData?.user_approval_name || userData?.Emp_Name || userData?.User_Approval_Name || "User";
  const userEmail = userData?.email_address || userData?.Email_Address || "No Email";

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
    localStorage.removeItem('tbgs_access_token');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleChangePassword = () => {
    setIsOpen(false);
    navigate("/change-password");
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

        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-800 truncate max-w-32">
            {userName}
          </p>
          <p className="text-xs text-gray-500 truncate max-w-32">
            {userEmail}
          </p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-5 duration-200">
          {/* User Info */}
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full mt-1 bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                {userName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
                <p className="text-xs text-gray-500 truncate max-w-48">
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