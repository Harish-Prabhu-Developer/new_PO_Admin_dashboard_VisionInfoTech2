// src/pages/Layout.jsx
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ProfileModal from "../components/ProfileModal";
import Breadcrumbs from "../components/Breadcrumbs"; // Import the component

const Layout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const location = useLocation();
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
            </div>

            {/* Right Section: Profile */}
            <div className="flex items-center shrink-0">
              <ProfileModal />
            </div>
          </div>

          {/* Bottom Row: Breadcrumbs */}
          {location.pathname !== "/" && (
            <div className="px-4 py-2 bg-gray-50">
            <Breadcrumbs />
          </div>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full overflow-y-auto p-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;