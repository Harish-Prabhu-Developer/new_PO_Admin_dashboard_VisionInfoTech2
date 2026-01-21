// src/utils/TimeHelper.js
/**
 * This function is help the posted second like justnow, 5 min ago, 2 hours ago, yesterday, 10:00 AM, 09:30 AM, 08:15 AM, Jan 15
 */

export const postedTime = (dateStringOrDate) => {
    if (!dateStringOrDate) return "";
    const date = new Date(dateStringOrDate);
    const now = new Date();
    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    const isSameDay = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    // 1. Just now (< 1 min)
    if (seconds < 60) return "Just now";

    // 2. X min ago (< 1 hour)
    if (minutes < 60) return `${minutes} min ago`;

    // 3. X hours ago (Today, within last 12 hours)
    if (isSameDay && hours < 12) return `${hours} hours ago`;

    // 4. Today (Older than 12 hours) -> 10:00 AM
    if (isSameDay) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }

    // 5. Yesterday
    if (isYesterday) return "Yesterday";

    // 6. Older dates -> Jan 15
    const options = { month: 'short', day: 'numeric' };

    // 7. Different year -> Jan 15, 2024
    if (date.getFullYear() !== now.getFullYear()) {
        options.year = 'numeric';
    }

    return date.toLocaleDateString('en-US', options);
};