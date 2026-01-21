import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config';

// Async Thunks
export const fetchNotifications = createAsyncThunk(
    'notification/fetchNotifications',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/notifications`, {
                params: { userId }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch notifications');
        }
    }
);

export const markNotificationRead = createAsyncThunk(
    'notification/markAsRead',
    async (id, { rejectWithValue }) => {
        try {
            await axios.put(`${API_URL}/notifications/${id}/read`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to mark notification as read');
        }
    }
);

export const markAllNotificationsRead = createAsyncThunk(
    'notification/markAllAsRead',
    async (userId, { rejectWithValue }) => {
        try {
            await axios.put(`${API_URL}/notifications/mark-all-read`, { userId });
            return userId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to mark all notifications as read');
        }
    }
);

export const removeNotification = createAsyncThunk(
    'notification/deleteNotification',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/notifications/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to delete notification');
        }
    }
);

export const removeAllNotifications = createAsyncThunk(
    'notification/clearAllNotifications',
    async (userId, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/notifications/clear-all`, { data: { userId } });
            return userId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to clear notifications');
        }
    }
);

const initialState = {
    notifications: [],
    isLoading: false,
    error: null
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        addLocalNotification: (state, action) => {
            state.notifications.unshift({
                ...action.payload,
                id: Date.now(),
                read: false,
                date: new Date().toISOString()
            });
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Notifications
            .addCase(fetchNotifications.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.notifications = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Mark As Read
            .addCase(markNotificationRead.fulfilled, (state, action) => {
                const notification = state.notifications.find(n => n.id === action.payload);
                if (notification) {
                    notification.read = true;
                }
            })
            // Mark All As Read
            .addCase(markAllNotificationsRead.fulfilled, (state) => {
                state.notifications.forEach(n => {
                    n.read = true;
                });
            })
            // Delete Notification
            .addCase(removeNotification.fulfilled, (state, action) => {
                state.notifications = state.notifications.filter(n => n.id !== action.payload);
            })
            // Clear All Notifications
            .addCase(removeAllNotifications.fulfilled, (state) => {
                state.notifications = [];
            });
    }
});

export const { addLocalNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
