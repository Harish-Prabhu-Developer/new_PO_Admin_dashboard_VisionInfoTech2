// src/components/ProfileModal.jsx
import { ChevronDown, KeyRound, LogOut, User, Settings, Shield } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSidebarMenu } from "../hooks/useSidebarMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { API_URL } from "../config";
import { Eye, EyeOff, Lock, X, Loader2 } from "lucide-react";
import { decryptData, encryptData } from "../utils/cryptoUtils";

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

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = () => {
    clearUserData();
    setIsOpen(false);
    localStorage.removeItem('tbgs_access_token');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleChangePasswordClick = () => {
    setIsOpen(false);
    setShowChangePassword(true);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/auth/change-password`, {
        User_Approval_Name: userData?.user_approval_name || userData?.User_Approval_Name,
        Old_Password: passwordForm.oldPassword,
        New_Password: passwordForm.newPassword
      });

      toast.success(response.data.message || "Password changed successfully");
      const storedLogin = localStorage.getItem("rememberedLogin");
      if (storedLogin) {
        const decryptedLogin = decryptData(storedLogin);
        console.log("Decrypted Login:", decryptedLogin);
        localStorage.setItem(
          "rememberedLogin",
          encryptData({
            username: decryptedLogin.username,
            password: passwordForm.newPassword
          })
        );
      }
      setShowChangePassword(false);
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Change password error:", error);
      toast.error(error.response?.data?.error || "Failed to change password");
    } finally {
      setIsSubmitting(false);
    }
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
              onClick={handleChangePasswordClick}
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
      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-linear-to-r from-indigo-600 to-violet-700 px-6 py-8 text-white relative">
              <button
                onClick={() => setShowChangePassword(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex flex-col items-center text-center">
                <div className="bg-white/20 p-3 rounded-2xl mb-4 backdrop-blur-md">
                  <KeyRound className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Update Password</h3>
                <p className="text-indigo-100 text-sm mt-1">Please enter your old and new password</p>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-5">
              {/* Old Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type={showPasswords.old ? "text" : "password"}
                    required
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-gray-700 placeholder:text-gray-400"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    {showPasswords.old ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-gray-700 placeholder:text-gray-400"
                    placeholder="Create new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    {showPasswords.new ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-gray-700 placeholder:text-gray-400"
                    placeholder="Verify new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-linear-to-r from-indigo-600 to-violet-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileModal;