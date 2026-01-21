// back_end/src/routes/Notification.Route.ts
import { Router } from 'express';
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
} from '../controllers/Notification.Controller';

const router = Router();

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.put('/mark-all-read', markAllAsRead);
router.delete('/:id', deleteNotification);
router.delete('/clear-all', clearAllNotifications);

export default router;
