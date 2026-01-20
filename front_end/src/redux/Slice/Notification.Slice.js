import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    notifications: [
        {
            id: 1,
            title: 'New Order Received',
            message: 'Order #PO-2024-001 has been submitted for approval.',
            time: '5 min ago',
            date: 'Today',
            type: 'success',
            read: false,
            link: '/dashboard/PurchaseOrder'
        },
        {
            id: 2,
            title: 'System Maintenance',
            message: 'Scheduled maintenance will start in 30 minutes.',
            time: '25 min ago',
            date: 'Today',
            type: 'info',
            read: false,
        },
        {
            id: 3,
            title: 'Approval Pending',
            message: 'Purchase Order #8821 requires your approval.',
            time: '2 hours ago',
            date: 'Today',
            type: 'warning',
            read: false,
            link: '/dashboard/PurchaseOrder'
        },
        {
            id: 4,
            title: 'Connection Lost',
            message: 'Lost connection to the inventory server. Retrying...',
            time: 'Yesterday',
            date: 'Yesterday',
            type: 'error',
            read: true,
        },
        {
            id: 5,
            title: 'Weekly Report Ready',
            message: 'Your weekly analytics report is ready for download.',
            time: '10:00 AM',
            date: 'Yesterday',
            type: 'success',
            read: true,
            link: '/dashboard/Reports'
        },
        {
            id: 6,
            title: 'New User Registered',
            message: 'A new user "John Doe" has requested access.',
            time: '09:30 AM',
            date: 'Yesterday',
            type: 'info',
            read: true,
        },
        {
            id: 7,
            title: 'Server High Load',
            message: 'CPU usage is above 90% on Server-02.',
            time: '08:15 AM',
            date: 'Jan 15',
            type: 'warning',
            read: true,
        }
    ]
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        markAsRead: (state, action) => {
            const id = action.payload;
            const notification = state.notifications.find(n => n.id === id);
            if (notification) {
                notification.read = true;
            }
        },
        markAllAsRead: (state) => {
            state.notifications.forEach(n => {
                n.read = true;
            });
        },
        deleteNotification: (state, action) => {
            const id = action.payload;
            state.notifications = state.notifications.filter(n => n.id !== id);
        },
        clearAllNotifications: (state) => {
            state.notifications = [];
        },
        addNotification: (state, action) => {
            state.notifications.unshift({
                ...action.payload,
                id: Date.now(),
                read: false,
                time: 'Just now',
                date: 'Today'
            });
        }
    }
});

export const {
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    addNotification
} = notificationSlice.actions;

export default notificationSlice.reducer;
