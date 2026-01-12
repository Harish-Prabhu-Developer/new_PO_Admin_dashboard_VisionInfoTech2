
// src/controllers/PO.Dashboard.Controller.ts
import { Request, Response } from 'express';
import { query } from '../config/db';

const TABLE_USER = 'users';
const TABLE_DASHBOARD = 'tbl_dashboard';

// Get Dashboard data filtered by User Permissions
export const getPODashboard = async (req: Request, res: Response) => {
    try {
        // User is attached to request by authMiddleware
        const userId = req.user?.sno;

        if (!userId) {
             return res.status(401).json({ error: 'Unauthorized: User not identified' });
        }

        // 1. Get the User's permissions
        const userResult = await query(`SELECT * FROM ${TABLE_USER} WHERE sno = $1`, [userId]);
        
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userResult.rows[0];

        // 2. Get all Active Dashboard Cards
        const dashboardResult = await query(`SELECT * FROM ${TABLE_DASHBOARD} WHERE status_master = 'Active'`);
        const allCards = dashboardResult.rows;

        // 3. Filter Cards based on User Permissions
        // If a card has a 'permission_column' defined, check if the user has that permission (true)
        // If 'permission_column' is null/empty, assume it's visible to everyone OR handle as needed (here assuming visible)
        const allowedCards = allCards.filter((card: any) => {
            const permissionCol = card.permission_column;
            
            // If no specific permission column is linked, show it (or hide it, depending on requirement. Showing it by default here)
            if (!permissionCol) return true;

            // Check if user has this permission set to true
            return user[permissionCol] === true;
        });

        res.status(200).json(allowedCards);

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}; 
