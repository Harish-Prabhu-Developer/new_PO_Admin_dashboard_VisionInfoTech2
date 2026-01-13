// src/redux/Store.js
import { configureStore } from '@reduxjs/toolkit';
import sidebarMenuReducer from './Slice/SidebarMenu';
import poFilesUploadDetail4Reducer from './Slice/PO.FilesUploadDetail4.Slice';
import poHeaderReducer from './Slice/PO.Header.Slice';
import poDetail1Reducer from './Slice/PO.Detail1.Slice';
import poAddCostDetail2Reducer from './Slice/PO.AddCostDetail2.Slice';
import poConversationDetail3Reducer from './Slice/PO.ConversationDetail3.Slice';
import poDashboardReducer from './Slice/PO.Dashboard.Slice';
import approvalDetailsReducer from './Slice/ApprovalDetails.Slice';

const Store = configureStore({
  reducer: {
    sidebarMenu: sidebarMenuReducer,
    poFilesUploadDetail4: poFilesUploadDetail4Reducer,
    poHeader: poHeaderReducer,
    poDetail1: poDetail1Reducer,
    poAddCostDetail2: poAddCostDetail2Reducer,
    poConversationDetail3: poConversationDetail3Reducer,
    poDashboard: poDashboardReducer,
    approvalDetails: approvalDetailsReducer,
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

