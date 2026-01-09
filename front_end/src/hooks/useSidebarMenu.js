// src/hooks/useSidebarMenu.js
import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { 
  toggleSidebar, 
  setSidebarOpen, 
  setUserData,
  setActiveMenuItem,
  updatePendingCount,
  clearUserData 
} from '../redux/Slice/SidebarMenu';

export const useSidebarMenu = () => {
  const dispatch = useDispatch();
  const sidebarMenu = useSelector((state) => state.sidebarMenu);

  // Memoize actions to prevent unnecessary re-renders
  const toggleSidebarAction = useCallback(() => dispatch(toggleSidebar()), [dispatch]);
  const setSidebarOpenAction = useCallback((isOpen) => dispatch(setSidebarOpen(isOpen)), [dispatch]);
  const setUserDataAction = useCallback((userData) => dispatch(setUserData(userData)), [dispatch]);
  const setActiveMenuItemAction = useCallback((path) => dispatch(setActiveMenuItem({ path })), [dispatch]);
  const updatePendingCountAction = useCallback((path, count) => dispatch(updatePendingCount({ path, count })), [dispatch]);
  const clearUserDataAction = useCallback(() => dispatch(clearUserData()), [dispatch]);

  return {
    // State
    isSidebarOpen: sidebarMenu.isOpen,
    userData: sidebarMenu.userData,
    isLoading: sidebarMenu.isLoading,
    error: sidebarMenu.error,
    menuItems: sidebarMenu.menuItems,
    
    // Actions (all memoized)
    toggleSidebar: toggleSidebarAction,
    setSidebarOpen: setSidebarOpenAction,
    setUserData: setUserDataAction,
    setActiveMenuItem: setActiveMenuItemAction,
    updatePendingCount: updatePendingCountAction,
    clearUserData: clearUserDataAction,
  };
};