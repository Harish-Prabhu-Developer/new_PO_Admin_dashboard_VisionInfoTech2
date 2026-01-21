import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
} from '../redux/Slice/Notification.Slice';
import {
    Bell,
    Check,
    Info,
    AlertTriangle,
    X,
    CheckCheck,
    Search,
    Filter,
    Trash2,
    Clock,
    Calendar
} from 'lucide-react';
import { postedTime } from '../utils/TimeHelper';

const NotificationsPage = () => {
    const notifications = useSelector((state) => state.notification.notifications);
    const { userData } = useSelector((state) => state.sidebarMenu);
    const userId = userData?.sno || userData?.id;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [filter, setFilter] = useState('all'); // all, unread, read
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch notifications on mount if userId exists
    React.useEffect(() => {
        if (userId) {
            dispatch(fetchNotifications(userId));
        }
    }, [dispatch, userId]);

    const getTypeStyles = (type) => {
        switch (type) {
            case 'success':
                return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'text-emerald-500', Icon: Check };
            case 'warning':
                return { bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: 'text-amber-500', Icon: AlertTriangle };
            case 'error':
                return { bg: 'bg-red-500/10', border: 'border-red-500/20', icon: 'text-red-500', Icon: X };
            case 'info':
            default:
                return { bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'text-blue-500', Icon: Info };
        }
    };

    const filteredNotifications = notifications.filter(n => {
        const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || n.message.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all'
            ? true
            : filter === 'unread'
                ? !n.read
                : n.read;
        return matchesSearch && matchesFilter;
    });

    const handleMarkAsRead = (id) => {
        dispatch(markAsRead(id));
    };

    const handleNotificationClick = (notification) => {
        dispatch(markAsRead(notification.id));
        if (notification.link) {
            navigate(notification.link);
        }
    };

    const handleDeleteNotification = (id) => {
        dispatch(deleteNotification(id));
    };

    const handleMarkAllRead = () => {
        if (userId) {
            dispatch(markAllAsRead(userId));
        }
    };

    const handleClearAll = () => {
        if (userId) {
            dispatch(clearAllNotifications(userId));
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <span className="p-2 bg-indigo-600 text-white rounded-lg shadow-md shadow-indigo-200">
                            <Bell size={24} />
                        </span>
                        Notifications
                    </h1>
                    <p className="text-slate-500 mt-1">Manage and view all your updates</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleMarkAllRead}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all font-medium text-sm shadow-sm"
                    >
                        <CheckCheck size={16} />
                        Mark all read
                    </button>
                    <button
                        onClick={handleClearAll}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all font-medium text-sm shadow-sm"
                    >
                        <Trash2 size={16} />
                        Clear all
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full md:w-96 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                    <Search className="text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search notifications..."
                        className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-700 placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    {['all', 'unread', 'read'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition-all ${filter === f
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => {
                        const styles = getTypeStyles(notification.type);
                        const Icon = styles.Icon;

                        return (
                            <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`
                      relative group flex items-start gap-4 p-5 rounded-2xl border transition-all duration-200 cursor-pointer
                      ${notification.read ? 'bg-white border-slate-100 shadow-sm' : 'bg-white border-indigo-100 shadow-md shadow-indigo-100/20 ring-1 ring-indigo-50'}
                      hover:shadow-md hover:-translate-y-0.5
                    `}
                            >
                                {/* Icon Bubble */}
                                <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${styles.bg} ${styles.icon}`}>
                                    <Icon size={24} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 pt-1">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                                        <h3 className={`text-base font-bold ${notification.read ? 'text-slate-700' : 'text-slate-900'}`}>
                                            {notification.title}
                                        </h3>
                                        <div className="flex items-center gap-3 text-xs text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {postedTime(notification.date)}
                                            </span>
                                        </div>
                                    </div>
                                    <p className={`text-sm leading-relaxed ${notification.read ? 'text-slate-500' : 'text-slate-600'}`}>
                                        {notification.message}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col items-end gap-2 shrink-0">
                                    {!notification.read && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" title="Unread"></div>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteNotification(notification.id);
                                        }}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Bell size={32} className="text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">No notifications found</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mt-2">
                            There are no notifications matching your filters at this time.
                        </p>
                        <button onClick={() => { setFilter('all'); setSearchTerm('') }} className="mt-4 text-indigo-600 font-semibold hover:underline">
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
