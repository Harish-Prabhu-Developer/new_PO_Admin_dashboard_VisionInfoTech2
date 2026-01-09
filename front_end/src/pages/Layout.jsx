// src/pages/Layout.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
  Bell
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setUserData, setActiveMenuItem } from '../redux/Slice/SidebarMenu';
import { useSidebarMenu } from '../hooks/useSidebarMenu';
import toast from 'react-hot-toast';
import FullscreenToggle from '../components/common/FullscreenToggle';
import Breadcrumbs from '../components/Breadcrumbs';

// Import all icons
import {
  LayoutDashboard,
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

const iconMap = {
  LayoutDashboard,
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
  Home,
  Bell
};

const Layout = ({ children }) => {
  const { 
    isSidebarOpen, 
    userData, 
    menuItems,
    setSidebarOpen,
    clearUserData,
    setActiveMenuItem: setActiveMenuItemAction
  } = useSidebarMenu();
  
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Track previous path to prevent unnecessary updates
  const prevPathRef = useRef(location.pathname);

  // Load user data from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('tbgs_access_token');
    if (token) {
      try {
        const parsedData = JSON.parse(token);
        dispatch(setUserData(parsedData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [dispatch]);

  // Update active menu item when location changes (with optimization)
  useEffect(() => {
    // Only update if path actually changed
    if (location.pathname !== prevPathRef.current) {
      setActiveMenuItemAction(location.pathname);
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname, setActiveMenuItemAction]);

  // Get username from Redux store
  const username = userData?.Emp_Name || userData?.User_Approval_Name || 'User';
  const userEmail = userData?.Email_Address || '';
  const userRole = userData?.Employee_Signed_As || 'Admin';

  // Get active approvals count
  const getActiveApprovalsCount = () => {
    if (!userData) return 0;
    let count = 0;
    Object.keys(userData).forEach(key => {
      if (key.includes('_YN') && userData[key] === 'YES') {
        count++;
      }
    });
    return count;
  };

  const activeApprovalsCount = getActiveApprovalsCount();

  // Close mobile sidebar when clicking outside
  const handleOverlayClick = () => {
    setIsMobileSidebarOpen(false);
  };

  const handleLogout = () => {
    clearUserData();
    localStorage.removeItem('tbgs_access_token');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleMenuItemClick = (item) => {
    setIsMobileSidebarOpen(false);
    navigate(item.path);
  };

  // Determine if sidebar should be in expanded mode (full width with text)
  // On mobile, it's always expanded if it's visible. On desktop, it follows the isSidebarOpen toggle.
  const isExpanded = isMobileSidebarOpen || isSidebarOpen;

  return (
    <div className="flex h-screen w-full bg-linear-to-br  from-gray-50 to-indigo-50">
      {/* Mobile overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 bg-opacity-50 z-40 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full'}
        lg:translate-x-0
        flex flex-col
        bg-linear-to-b from-indigo-700 to-indigo-900
        text-white
        ${isExpanded ? 'lg:w-72' : 'lg:w-20'}
        ${!isMobileSidebarOpen && !isSidebarOpen ? 'w-20' : 'w-72'}
        h-screen
        shadow-2xl
        border-r border-indigo-800/50
      `}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-indigo-800">
          <div className={`flex items-center space-x-3 ${!isExpanded && 'justify-center w-full'}`}>
            <div className="w-10 h-10 shrink-0 rounded-xl bg-linear-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
              <span className="font-bold text-lg text-white">{username.charAt(0)}</span>
            </div>
            {isExpanded && (
              <div className="min-w-0">
                <h1 className="text-xl font-bold bg-linear-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent truncate">
                  Approval Hub
                </h1>
                <p className="text-xs text-indigo-200 mt-1">Admin Portal</p>
              </div>
            )}
          </div>
          
          {/* Mobile close button */}
          <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-indigo-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 p-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="mb-6">
            {isExpanded && (
              <div className="px-3 mb-4">
                <div className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-2">
                  Navigation
                </div>
              </div>
            )}
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = iconMap[item.icon] || LayoutDashboard;
                const hasPendingItems = item.pendingCount > 0;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleMenuItemClick(item)}
                      className={`
                        w-full flex items-start justify-between
                        px-3 py-3
                        rounded-xl
                        transition-all duration-200
                        hover:bg-white/10 hover:shadow-md group
                        ${item.active ? 'bg-linear-to-r from-indigo-500/30 to-purple-500/30 border-l-4 border-indigo-300 shadow-md' : ''}
                        ${!isExpanded && 'justify-center items-center'}
                      `}
                    >
                      <div className="flex items-start space-x-3 min-w-0">
                        <div className={`shrink-0 mt-0.5 ${item.active ? 'text-indigo-200' : 'text-indigo-100 group-hover:text-white transition-colors'}`}>
                          <Icon size={20} />
                        </div>
                        {isExpanded && (
                          <span className={`font-medium text-sm leading-tight text-left break-words ${item.active ? 'text-white' : 'text-indigo-100 group-hover:text-white transition-colors'}`}>
                            {item.name}
                          </span>
                        )}
                      </div>
                      
                      {/* Pending Count Badge */}
                      {isExpanded && hasPendingItems && (
                        <span className="shrink-0 mt-0.5 bg-linear-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center ml-2 shadow-sm">
                          {item.pendingCount}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-indigo-800">
          <div className={`flex items-center ${!isSidebarOpen ? 'justify-center' : 'justify-between'}`}>
            {isSidebarOpen ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                      <span className="text-sm font-bold text-white">{username.charAt(0)}</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-indigo-700"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-white">{username}</p>
                    <p className="text-xs text-indigo-200 truncate">{userRole}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-indigo-800 transition-colors group"
                  title="Logout"
                >
                  <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
                </button>
              </>
            ) : (
              <button 
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-indigo-800 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto content-scrollbar">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-40 bg-linear-to-r from-white to-indigo-50 border-b border-indigo-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button 
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <Menu size={24} className="text-indigo-600" />
              </button>
              
              {/* Desktop toggle button */}
              <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="hidden lg:flex items-center justify-center p-2 rounded-lg hover:bg-indigo-100 transition-colors"
                title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                {isSidebarOpen ? <ChevronLeft size={20} className="text-indigo-600" /> : <ChevronRight size={20} className="text-indigo-600" />}
              </button>
              
              {/* Breadcrumb Navigation */}
              <div className="hidden md:flex items-center">
                <Breadcrumbs />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Full Screen Toggle */}
              <FullscreenToggle />
              
              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-indigo-900">{username}</p>
                  <p className="text-xs text-indigo-600">{userEmail}</p>
                </div>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-md cursor-pointer">
                    <span className="text-sm font-bold text-white">{username.charAt(0)}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {children || <Outlet />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;