import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config';
import toast from 'react-hot-toast';

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

export const markAsRead = createAsyncThunk(
    'notification/markAsRead',
    async (id, { rejectWithValue }) => {
        try {
            await axios.put(`${API_URL}/notifications/${id}/read`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to update notification');
        }
    }
);

export const markAllAsRead = createAsyncThunk(
    'notification/markAllAsRead',
    async (userId, { rejectWithValue }) => {
        try {
            await axios.put(`${API_URL}/notifications/mark-all-read`, { userId });
            toast.success('All notifications marked as read');
            return userId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to update notifications');
        }
    }
);

export const deleteNotification = createAsyncThunk(
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

export const clearAllNotifications = createAsyncThunk(
    'notification/clearAllNotifications',
    async (userId, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/notifications/clear-all`, { data: { userId } });
            toast.success('All notifications cleared');
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
        addNotification: (state, action) => {
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
            // Mark As Read (using == for type flexibility)
            .addCase(markAsRead.fulfilled, (state, action) => {
                const notification = state.notifications.find(n => n.id == action.payload);
                if (notification) {
                    notification.read = true;
                }
            })
            // Mark All As Read
            .addCase(markAllAsRead.fulfilled, (state) => {
                state.notifications.forEach(n => {
                    n.read = true;
                });
            })
            // Delete Notification (using == for type flexibility)
            .addCase(deleteNotification.fulfilled, (state, action) => {
                state.notifications = state.notifications.filter(n => n.id != action.payload);
            })
            // Clear All Notifications
            .addCase(clearAllNotifications.fulfilled, (state) => {
                state.notifications = [];
            });
    }
});

export const { addNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
