// src/redux/Slice/SidebarMenu.js
import { createSlice } from '@reduxjs/toolkit';
import { API_RESPONSE_SIMPLE_DATA } from '../../utils/Auth/dummyData';

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
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
};

// Icon mapping based on title keywords
const getIconForTitle = (title) => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('po') && lowerTitle.includes('approval')) return 'FileCheck';
  if (lowerTitle.includes('cash')) return 'Wallet';
  if (lowerTitle.includes('credit')) return 'CreditCard';
  if (lowerTitle.includes('price')) return 'Tag';
  if (lowerTitle.includes('goods')) return 'PackageCheck';
  if (lowerTitle.includes('inter-company')) return 'Building2';
  if (lowerTitle.includes('sales return')) return 'RotateCcw';
  if (lowerTitle.includes('gate pass')) return 'DoorOpen';
  if (lowerTitle.includes('product creation')) return 'Boxes';
  if (lowerTitle.includes('customer creation')) return 'UserPlus';
  if (lowerTitle.includes('wastage')) return 'Trash2';
  if (lowerTitle.includes('work order')) return 'ClipboardList';
  if (lowerTitle.includes('pfl')) return 'Factory';
  if (lowerTitle.includes('roll cutt')) return 'Scissors';
  if (lowerTitle.includes('expat travel')) return 'Plane';
  if (lowerTitle.includes('sales pi')) return 'ReceiptText';
  if (lowerTitle.includes('purchase pi')) return 'ShoppingCart';
  if (lowerTitle.includes('apparels')) return 'Shirt';
  if (lowerTitle.includes('approval head')) return 'ShieldCheck';
  if (lowerTitle.includes('overtime')) return 'Clock';
  if (lowerTitle.includes('encashment')) return 'HandCoins';
  if (lowerTitle.includes('bonce purchase')) return 'ShoppingCart';
  if (lowerTitle.includes('bond release')) return 'LockKeyhole';
  
  return 'LayoutDashboard'; // Default icon
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
      
      // Update menu items based on user permissions
      if (action.payload) {
        // Start with Dashboard
        const newMenuItems = [{ 
          id: 1, 
          name: 'Dashboard', 
          path: '/dashboard', 
          icon: 'LayoutDashboard', 
          active: false 
        }];
        
        API_RESPONSE_SIMPLE_DATA.forEach((item, index) => {
          newMenuItems.push({
            id: item.id,
            name: item.title,
            path: `/dashboard/${createSlug(item.title)}`,
            icon: getIconForTitle(item.title),
            active: false,
            pendingCount: item.value
          });
        });
        
        state.menuItems = newMenuItems;
      }
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
  setActiveMenuItem,
  updatePendingCount,
  setLoading,
  setError,
  clearUserData,
  setMenuItems
} = sidebarMenuSlice.actions;

export default sidebarMenuSlice.reducer;