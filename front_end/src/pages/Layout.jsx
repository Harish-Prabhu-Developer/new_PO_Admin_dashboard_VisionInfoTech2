// src/pages/Layout.jsx
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ProfileModal from "../components/ProfileModal";
import Breadcrumbs from "../components/Breadcrumbs"; 

const Layout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const location = useLocation();

  // Function to get custom title for current page
  const getCustomTitle = () => {
    // For approval details pages
    if (location.state?.cardData?.title) {
      return location.state.cardData.title;
    }

    // For view detail pages with ID in URL
    const pathnames = location.pathname.split("/").filter((x) => x);
    if (pathnames.length >= 2 && /^\d+$/.test(pathnames[pathnames.length - 1])) {
      return "Details";
    }

    return null;
  };

  return (
    <div className="flex min-h-screen w-full bg-white overflow-x-hidden">
      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isDesktopCollapsed ? "md:ml-20" : ""
        }`}
      >
        {/* Top Navbar */}
        <header className="bg-white shadow-sm sticky top-0 z-20 w-full">
          {/* Top Row: Logo, Profile */}
          <div className={`flex items-center justify-between px-4 py-1 ${location.pathname !== "/" ? "border-b" : ""}`}>
            {/* Left Section: Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <img
                src="https://visioninfotech.co.tz/assets/images/vit-logo-dark.png"
                alt="Vision Infotech Logo"
                className="h-8 md:h-10 object-contain"
              />
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-gray-900">Approval System</h1>
                <p className="text-xs text-gray-500">Dashboard & Management</p>
              </div>
            </div>

            {/* Right Section: Profile */}
            <div className="flex items-center shrink-0">
              <ProfileModal />
            </div>
          </div>

          {/* Bottom Row: Breadcrumbs - Show on all pages except dashboard */}
          {location.pathname !== "/" && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
              <div className="w-full mx-auto">
                <Breadcrumbs customTitle={getCustomTitle()} />
              </div>
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full overflow-y-auto p-2 md:p-4">
          <div className="w-full mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-gray-200 bg-white py-3">
          <div className="w-full mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
              <p>© {new Date().getFullYear()} Vision Infotech Ltd. All rights reserved.</p>
              <p className="mt-1 md:mt-0">Approval System v1.0.0</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;