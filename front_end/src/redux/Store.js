// src/redux/Store.js
import { configureStore } from '@reduxjs/toolkit';
import sidebarMenuReducer from './Slice/SidebarMenu';

const Store = configureStore({
  reducer: {
    sidebarMenu: sidebarMenuReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['sidebarMenu/setUserData'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.signature'],
        // Ignore these paths in the state
        ignoredPaths: ['sidebarMenu.userData.signature'],
      },
    }),
});

export default Store;