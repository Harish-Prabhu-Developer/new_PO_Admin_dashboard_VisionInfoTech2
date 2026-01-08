// src/components/Breadcrumbs.jsx
import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const params = useParams();
  const state = location.state || {};

  // Don't show breadcrumbs if we're on the dashboard
  if (location.pathname === '/') {
    return null;
  }

  // Get current page title
  const getPageTitle = () => {
    if (location.pathname.startsWith('/approval-details/')) {
      // For approval details pages
      return state.cardData?.title || 
             (params.approvalType 
               ? params.approvalType
                   .replace(/-/g, ' ')
                   .replace(/\b\w/g, char => char.toUpperCase())
               : 'Approval Details');
    } else {
      // For other pages, use the last path segment
      const paths = location.pathname.split('/').filter(path => path);
      const lastPath = paths[paths.length - 1];
      return lastPath
        .replace(/-/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
    }
  };

  const pageTitle = getPageTitle();

  return (
    <nav className="flex items-center space-x-1 text-sm">
      {/* Dashboard link */}
      <Link
        to="/"
        className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center"
      >
        <Home className="w-3 h-3 mr-1" />
        Dashboard
      </Link>
      
      {/* Separator */}
      <ChevronRight className="w-3 h-3 text-gray-400" />
      
      {/* Current page title */}
      <span className="text-gray-800 font-medium truncate max-w-xs">
        {pageTitle}
      </span>
    </nav>
  );
};

export default Breadcrumbs;