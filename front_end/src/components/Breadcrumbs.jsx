// src/components/Breadcrumbs.jsx
import React from "react";
import { Link, useLocation, matchPath } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumbs = ({ customTitle, className = "" }) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Function to format breadcrumb text
  const formatBreadcrumb = (text) => {
    if (!text) return "";
    return text
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .replace(/\b(Az|Ab|Bc|Po|Pi|Pfl|Pprb)\b/gi, (match) => match.toUpperCase());
  };

  // Function to get route title based on path segment
  const getRouteTitle = (segment, index, fullPath) => {
    // If custom title is provided for current page, use it
    if (index === pathnames.length - 1 && customTitle) {
      return customTitle;
    }

    // Check if segment is an ID (numeric)
    if (/^\d+$/.test(segment)) {
      return "Details";
    }

    // Special case for home
    if (segment === "" && index === 0) {
      return "Dashboard";
    }

    // Check if this path matches any known routes
    const currentPath = `/${pathnames.slice(0, index + 1).join("/")}`;

    // Try to get title from location state
    if (location.state?.cardData?.title && index === pathnames.length - 1) {
      return location.state.cardData.title;
    }

    // Check if this matches the approval details route pattern
    const approvalMatch = matchPath("/:approvalType", currentPath);
    if (approvalMatch) {
      return formatBreadcrumb(approvalMatch.params.approvalType);
    }

    // Check if this matches the view details route pattern
    const detailMatch = matchPath("/:approvalType/:id", currentPath);
    if (detailMatch && index === 1) {
      return formatBreadcrumb(detailMatch.params.approvalType);
    }

    // Default formatting
    return formatBreadcrumb(segment);
  };

  // Function to build breadcrumb items
  const buildBreadcrumbs = () => {
    const items = [];

    // Always add home
    items.push({
      path: "/",
      title: "Dashboard",
      icon: <Home className="w-3.5 h-3.5" />,
    });

    // Build path segments
    pathnames.forEach((segment, index) => {
      const path = `/${pathnames.slice(0, index + 1).join("/")}`;
      const title = getRouteTitle(segment, index, path);
      
      items.push({
        path,
        title,
        isLast: index === pathnames.length - 1,
      });
    });

    return items;
  };

  const breadcrumbItems = buildBreadcrumbs();

  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      {breadcrumbItems.map((item, index) => (
        <div key={item.path} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 mx-1 shrink-0" />
          )}
          
          {item.isLast ? (
            <span className="text-gray-700 font-medium flex items-center">
              {item.icon && <span className="mr-1.5">{item.icon}</span>}
              {item.title}
            </span>
          ) : (
            <Link
              to={item.path}
              state={item.path === "/" ? undefined : location.state}
              className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center"
            >
              {item.icon && <span className="mr-1.5">{item.icon}</span>}
              {item.title}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;