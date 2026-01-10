// src/pages/Layout.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  Bell
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setUserData, setActiveMenuItem } from '../redux/Slice/SidebarMenu';
import { useSidebarMenu } from '../hooks/useSidebarMenu';
import toast from 'react-hot-toast';
import FullscreenToggle from '../components/common/FullscreenToggle';
import Breadcrumbs from '../components/Breadcrumbs';
import ProfileModal from '../components/ProfileModal';

// Import all icons for the sidebar
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
  Home
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
  const prevPathRef = useRef(location.pathname);

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

  useEffect(() => {
    if (location.pathname !== prevPathRef.current) {
      setActiveMenuItemAction(location.pathname);
      prevPathRef.current = location.pathname;
      setIsMobileSidebarOpen(false); // Auto-close on navigate
    }
  }, [location.pathname, setActiveMenuItemAction]);

  const username = userData?.Emp_Name || userData?.User_Approval_Name || 'User';
  const userRole = userData?.Employee_Signed_As || 'Admin';

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

  const isExpanded = isMobileSidebarOpen || isSidebarOpen;

  return (
    <div className="relative flex max-h-screen w-full bg-white overflow-x-hidden content-scrollbar">
      
      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-60 lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Consistent width and behavior across devices */}
      <aside className={`
        fixed inset-y-0 left-0 z-70 
        lg:static
        transform transition-all duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
        bg-linear-to-b from-indigo-800 to-indigo-950
        text-white
        ${isExpanded ? 'w-72' : 'w-20'}
        h-screen
        shadow-2xl
        border-r border-white/10
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 h-16 shrink-0">
          <div className={`flex items-center space-x-3 ${!isExpanded && 'justify-center w-full'}`}>
            <div className="w-9 h-9 shrink-0 rounded-lg bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
              <span className="font-bold text-base text-white">{username.charAt(0)}</span>
            </div>
            {isExpanded && (
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-white truncate tracking-tight">TBGS Hub</h1>
                <p className="text-[10px] text-indigo-200 font-bold uppercase opacity-70">Control Panel</p>
              </div>
            )}
          </div>
          {isMobileSidebarOpen && (
            <button onClick={() => setIsMobileSidebarOpen(false)} className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 py-4 px-2 overflow-y-auto overflow-x-hidden custom-scrollbar space-y-1">
          {menuItems.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const hasPendingItems = item.pendingCount > 0;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item)}
                className={`
                  w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all group
                  ${item.active ? 'bg-white/15 shadow-sm text-white' : 'text-indigo-100/70 hover:bg-white/10 hover:text-white'}
                  ${!isExpanded && 'justify-center'}
                `}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="relative shrink-0">
                    <Icon size={19} className={`${item.active ? 'text-white' : 'group-hover:text-white transition-colors'}`} />
                    {!isExpanded && hasPendingItems && (
                      <span className="absolute -top-2.5 -right-3.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white border-2 border-indigo-900 shadow-sm animate-pulse">
                        {item.pendingCount > 9 ? '9+' : item.pendingCount}
                      </span>
                    )}
                  </div>
                  {isExpanded && (
                    <span className="font-semibold text-sm truncate tracking-tight">{item.name}</span>
                  )}
                </div>
                {isExpanded && hasPendingItems && (
                  <span className="shrink-0 font-black text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full min-w-5 h-5 flex items-center justify-center shadow-lg shadow-red-900/40">
                    {item.pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <button 
            onClick={handleLogout}
            className={`flex items-center space-x-3 w-full p-2.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors ${!isExpanded && 'justify-center'}`}
            title="Sign Out"
          >
            <LogOut size={18} />
            {isExpanded && <span className="text-sm font-bold">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full relative">
        
        {/* Integrated Top Navigation (User-Requested Structure) */}
        <header className="bg-white sticky top-0 z-50 w-full border-b border-slate-100 shadow-xs">
          {/* Top Row: Mobile Toggle, Logo, Profile */}
          <div className="flex items-center justify-between px-4 py-2 h-14 md:h-16 w-full">
            <div className="flex items-center space-x-4 shrink-0">
              {/* Sidebar Toggles */}
              <button 
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-all"
              >
                <Menu size={22} />
              </button>
              
              <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="hidden lg:flex items-center justify-center p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-all border border-transparent hover:border-slate-100"
              >
                {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </button>

              {/* Company Logo Group */}
              <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
                <div className="h-8 md:h-10 w-px bg-slate-200" />
                <img
                  src="https://visioninfotech.co.tz/assets/images/vit-logo-dark.png"
                  alt="Vision Infotech"
                  className="h-7 md:h-9 object-contain"
                />
              </div>
            </div>

            {/* Right Group: Fullscreen, Profile */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="hidden sm:block">
                <FullscreenToggle />
              </div>
              <ProfileModal />
            </div>
          </div>

          {/* Bottom Row: Breadcrumbs Section */}
          {location.pathname !== "/" && (
            <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100">
               <Breadcrumbs />
            </div>
          )}
        </header>

        {/* Dynamic Page Container */}
        <main className="flex-1 w-full p-2 sm:p-4 lg:p-6 overflow-x-hidden overflow-y-auto bg-slate-50/50">
          <div className="max-w-[1600px] mx-auto w-full">
             {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;