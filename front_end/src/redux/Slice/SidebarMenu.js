// src/redux/Slice/SidebarMenu.js
import { createSlice } from '@reduxjs/toolkit';
import { API_RESPONSE_SIMPLE_DATA } from '../../utils/Auth/dummyData';
import { getIconForTitle } from '../../utils/IconHelper';

const initialState = {
  isOpen: true,
  userData: null,
  isLoading: false,
  error: null,
  menuItems: [
    {
      id: 1,
      name: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      active: false
    },
  ]
};

// Helper function to create slug
const createSlug = (value) => {
  return value
    .toLowerCase()
    .replace("&", " and ") // Replace & with ' and '
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/^-+|-+$/g, ""); // Trim dashes
};



const sidebarMenuSlice = createSlice({
  name: 'sidebarMenu',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen;
    },
    setSidebarOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    populateMenuFromDashboard: (state, action) => {
      const dashboardData = action.payload;
      if (!dashboardData) return;

      // Start with Dashboard
      const newMenuItems = [{ 
        id: 1, 
        name: 'Dashboard', 
        path: '/dashboard', 
        icon: 'LayoutDashboard', 
        active: false 
      }];
      
      dashboardData.forEach((item) => {
        newMenuItems.push({
          id: item.sno, // Use sno from DB as ID
          name: item.card_title, // Use card_title from DB
          path: `/dashboard/${createSlug(item.card_title)}`,
          icon: getIconForTitle(item.card_title), // Use helper function for icon
          active: false,
          pendingCount: item.card_value // Use card_value from DB
        });
      });
      
      state.menuItems = newMenuItems;
    },
    setActiveMenuItem: (state, action) => {
      const { path } = action.payload;
      
      const newMenuItems = state.menuItems.map(item => {
        let isActive = false;
        
        if (item.path === '/dashboard') {
          // Dashboard is active if path is exactly /dashboard or /
          isActive = path === '/dashboard' || path === '/dashboard/' || path === '/';
        } else {
          // For other items, check if current path starts with item path
          // (to handle deeper routes like /dashboard/po-approval/123)
          isActive = path === item.path || path.startsWith(item.path + '/');
        }
        
        return { ...item, active: isActive };
      });
      
      // Only update if something actually changed
      const hasChanged = newMenuItems.some((newItem, index) => 
        newItem.active !== state.menuItems[index]?.active
      );
      
      if (hasChanged) {
        state.menuItems = newMenuItems;
      }
    },
    updatePendingCount: (state, action) => {
      const { path, count } = action.payload;
      state.menuItems = state.menuItems.map(item => {
        if (item.path === path) {
          return {
            ...item,
            pendingCount: count
          };
        }
        return item;
      });
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearUserData: (state) => {
      state.userData = null;
      state.menuItems = initialState.menuItems;
    },
    setMenuItems: (state, action) => {
      state.menuItems = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setUserData,
  populateMenuFromDashboard,
  setActiveMenuItem,
  updatePendingCount,
  setLoading,
  setError,
  clearUserData,
  setMenuItems
} = sidebarMenuSlice.actions;

export default sidebarMenuSlice.reducer;