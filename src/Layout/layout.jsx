import React from "react";

const Layout = ({ header, footer, children }) => {
  return (
    <div className="h-screen w-full overflow-hidden bg-gray-200 flex flex-col">
      
      {/* Fixed Header */}
      <div className="shrink-0 sticky top-0 z-20">
        {header}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
        {children}
      </div>

      {/* Fixed Footer */}
      <div className="shrink-0 sticky bottom-0 z-20">
        {footer}
      </div>

    </div>
  );
};

export default Layout;
