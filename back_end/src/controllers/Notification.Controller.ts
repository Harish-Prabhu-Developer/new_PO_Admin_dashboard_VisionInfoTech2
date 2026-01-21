// back_end/src/controllers/Notification.Controller.ts
import { Request, Response } from 'express';
import { query } from '../config/db';

const TABLE_NOTIFICATIONS = 'tbl_notifications';

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const result = await query(
            `SELECT * FROM ${TABLE_NOTIFICATIONS} WHERE user_id = $1 ORDER BY date DESC`,
            [userId]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await query(
            `UPDATE ${TABLE_NOTIFICATIONS} SET read = TRUE WHERE id = $1`,
            [id]
        );
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const markAllAsRead = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        await query(
            `UPDATE ${TABLE_NOTIFICATIONS} SET read = TRUE WHERE user_id = $1`,
            [userId]
        );
        res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteNotification = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await query(
            `DELETE FROM ${TABLE_NOTIFICATIONS} WHERE id = $1`,
            [id]
        );
        res.status(200).json({ message: 'Notification deleted' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const clearAllNotifications = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        await query(
            `DELETE FROM ${TABLE_NOTIFICATIONS} WHERE user_id = $1`,
            [userId]
        );
        res.status(200).json({ message: 'All notifications cleared' });
    } catch (error) {
        console.error('Error clearing notifications:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
