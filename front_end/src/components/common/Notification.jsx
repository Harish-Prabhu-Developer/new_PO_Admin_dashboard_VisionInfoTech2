import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
} from '../../redux/Slice/Notification.Slice';
import {
    Bell,
    Check,
    Info,
    AlertTriangle,
    X,
    CheckCheck,
    Trash2,
    Clock
} from 'lucide-react';

const Notification = () => {
    const [isOpen, setIsOpen] = useState(false);
    const notifications = useSelector((state) => state.notification.notifications);
    const dispatch = useDispatch();
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }

        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAsRead = (id) => {
        dispatch(markAsRead(id));
    };

    const handleMarkAllAsRead = () => {
        dispatch(markAllAsRead());
    };

    const handleDeleteNotification = (id, e) => {
        e.stopPropagation();
        dispatch(deleteNotification(id));
    };

    const handleClearAll = () => {
        dispatch(clearAllNotifications());
    };

    const handleNotificationClick = (notification) => {
        dispatch(markAsRead(notification.id));
        setIsOpen(false);
        if (notification.link) {
            navigate(notification.link);
        }
    };

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

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
          relative p-2 rounded-xl transition-all duration-300
          hover:bg-slate-100 hover:text-indigo-600
          ${isOpen ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}
        `}
            >
                <Bell size={20} className={unreadCount > 0 ? 'animate-swing' : ''} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white"></span>
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && location.pathname !== '/notifications' && (
                <div className="absolute -right-20 md:right-1 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-fade-in-up origin-top-right">

                    {/* Header */}
                    <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                        <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-slate-800">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full">
                                    {unreadCount} New
                                </span>
                            )}
                        </div>
                        <div className="flex items-center space-x-1">
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
                                    title="Mark all as read"
                                >
                                    <CheckCheck size={16} />
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button
                                    onClick={handleClearAll}
                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Clear all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* List */}
                    <div className="max-h-[70vh] md:max-h-[400px] overflow-y-auto content-scrollbar p-2 space-y-2">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                    <Bell size={24} className="text-slate-300" />
                                </div>
                                <p className="text-slate-500 font-medium">No notifications</p>
                                <p className="text-xs text-slate-400 mt-1">You're all caught up!</p>
                            </div>
                        ) : (
                            notifications.map((notification) => {
                                const styles = getTypeStyles(notification.type);
                                const Icon = styles.Icon;

                                return (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`
                      group relative flex gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer border
                      ${notification.read ? 'bg-white border-transparent hover:bg-slate-50' : 'bg-indigo-50/30 border-indigo-100 hover:border-indigo-200'}
                    `}
                                    >
                                        {/* Icon Bubble */}
                                        <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${styles.bg} ${styles.icon}`}>
                                            <Icon size={18} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className={`text-sm font-semibold truncate ${notification.read ? 'text-slate-700' : 'text-slate-900'}`}>
                                                    {notification.title}
                                                </p>
                                                <span className="text-[10px] text-slate-400 whitespace-nowrap flex items-center gap-1">
                                                    <Clock size={10} />
                                                    {notification.time}
                                                </span>
                                            </div>
                                            <p className={`text-xs mt-0.5 line-clamp-2 ${notification.read ? 'text-slate-500' : 'text-slate-600'}`}>
                                                {notification.message}
                                            </p>
                                        </div>

                                        {/* Status Dot */}
                                        {!notification.read && (
                                            <div className="absolute top-4 right-2 w-1.5 h-1.5 rounded-full bg-indigo-500 ring-2 ring-white"></div>
                                        )}

                                        {/* Delete Action (visible on hover) */}
                                        <button
                                            onClick={(e) => handleDeleteNotification(notification.id, e)}
                                            className="absolute right-2 bottom-2 p-1.5 bg-white text-slate-300 hover:text-red-500 hover:shadow-sm rounded-full opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-2 border-t border-slate-50 bg-slate-50/50 text-center">
                            <button
                                onClick={() => {
                                    navigate('/notifications');
                                    setIsOpen(false);
                                }}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                            >
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Notification;