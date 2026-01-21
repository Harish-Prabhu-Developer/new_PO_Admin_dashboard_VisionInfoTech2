// src/controllers/PO.Dashboard.Controller.ts
import { Request, Response } from 'express';
import { query } from '../config/db';

const TABLE_USER = 'users';
const TABLE_DASHBOARD = 'tbl_dashboard';
const TABLE_PURCHASE_ORDER_HEADER = 'tbl_purchase_order_hdr';
const TABLE_PURCHASE_ORDER_DETAIL = 'tbl_purchase_order_dtl';
const TABLE_NOTIFICATIONS = 'tbl_notifications';



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

// Get Approval Details (Fetched from DB based on Schema)
export const getApprovalDetails = async (req: Request, res: Response) => {
    try {
        // Extract parameters from request params
        const { sno } = req.params;
        
       

        if (!sno) {
            return res.status(400).json({ error: 'Dashboard Card ID (sno) is required' });
        }

        // 1. Validate: Check if the Dashboard Card exists
        // We use the sno to verify if it's a valid dashboard card requesting data
        const dashboardResult = await query(`SELECT * FROM ${TABLE_DASHBOARD} WHERE sno = $1`, [sno]);
        console.log("dashboardResult", dashboardResult.rows[0].card_value);
        
        if (dashboardResult.rows.length === 0) {
            return res.status(404).json({ error: 'Dashboard Card not found' });
        }


        
        
        // 2. Fetch Approval Details
        // Mapping DB columns to the requested JSON Keys
        // We join specific tables as requested to build the view
        const sqlQuery = `
            SELECT 
                h.sno as "id",
                CONCAT('A', h.sno) as "cell",
                CAST(h.company_id AS VARCHAR) as "comp", 
                h.po_ref_no as "poNo",
                h.purchase_type as "poType",
                CAST(h.supplier_id AS VARCHAR) as "supplier", 
                
                -- Subquery to get product info from Detail 1
                COALESCE(
                    (SELECT d.alternate_product_name FROM ${TABLE_PURCHASE_ORDER_DETAIL} d WHERE d.po_ref_no = h.po_ref_no LIMIT 1), 
                    CAST((SELECT d.product_id FROM ${TABLE_PURCHASE_ORDER_DETAIL} d WHERE d.po_ref_no = h.po_ref_no LIMIT 1) AS VARCHAR),
                    'Unknown Product'
                ) as "product",
                
                CAST(h.company_id AS VARCHAR) as "company",
                CAST(h.po_store_id AS VARCHAR) as "department",
                
                -- Formatting amount with commas (Postgres TO_CHAR for basic formatting)
                TO_CHAR(h.total_final_production_hdr_amount, 'FM9,999,999,999.00') as "amount",
                h.currency_type as "currency",
                
                CONCAT(h.requested_by, ' / ', TO_CHAR(h.requested_date, 'DD-Mon-YYYY')) as "requestedBy",
                
                -- Calculate days pending
                EXTRACT(DAY FROM (NOW() - h.po_date))::TEXT as "pendingDays",
                
                -- Response 1
                CASE 
                    WHEN h.response_1_person IS NOT NULL AND h.response_1_date IS NOT NULL THEN CONCAT(h.response_1_person, ' / ', TO_CHAR(h.response_1_date, 'DD-Mon-YYYY HH24:MI:SS'))
                    WHEN h.response_1_person IS NOT NULL THEN h.response_1_person
                    ELSE 'Pending'
                END as "response1Person",
                COALESCE(h.response_1_status, 'PENDING') as "response1Status",
                COALESCE(h.response_1_remarks, '') as "response1Remarks",
                
                -- Response 2
                CASE 
                    WHEN h.response_2_person IS NOT NULL AND h.response_2_date IS NOT NULL THEN CONCAT(h.response_2_person, ' / ', TO_CHAR(h.response_2_date, 'DD-Mon-YYYY HH24:MI:SS'))
                    WHEN h.response_2_person IS NOT NULL THEN h.response_2_person
                    ELSE 'Pending'
                END as "response2Person",
                COALESCE(h.response_2_status, 'PENDING') as "response2Status",
                COALESCE(h.response_2_remarks, '') as "response2Remarks",
                
                COALESCE(h.final_response_status, 'PENDING') as "finalStatus"
                
            FROM ${TABLE_PURCHASE_ORDER_HEADER} h
            ORDER BY h.po_date DESC
            LIMIT $1;
        `;

        const result = await query(sqlQuery, [dashboardResult.rows[0].card_value]);

        return res.status(200).json({
            length: result.rows.length,
            rows: result.rows
        });

    } catch (error) {
        console.error('Error fetching approval details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update Approval Status
export const updateApprovalStatus = async (req: Request, res: Response) => {
    try {
        const { ids, status, remarks } = req.body; // ids is array of sno

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: 'Invalid or missing IDs' });
        }
        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        // Validate Status
        const validStatuses = ['APPROVED', 'PENDING', 'REJECTED', 'HOLD'];
        if (!validStatuses.includes(status)) {
             return res.status(400).json({ error: 'Invalid Status provided' });
        }

        const userId = req.user?.sno;
        // Fetch user name for logging
        let userName = 'Unknown User';
        if (userId) {
             const userResult = await query(`SELECT emp_name FROM ${TABLE_USER} WHERE sno = $1`, [userId]);
             userName = userResult.rows[0]?.emp_name || 'Unknown User';
        }

        // Construct Update Query
        // We will update final_response_status, final_response_date, final_response_person
        // Note: For this request, we are doing a direct update on the final status column as requested.

        const updateQuery = `
            UPDATE ${TABLE_PURCHASE_ORDER_HEADER}
            SET 
                final_response_status = $1,
                final_response_date = NOW(),
                final_response_person = $2,
                final_response_remarks = COALESCE($3, final_response_remarks)
            WHERE sno = ANY($4::int[])
            RETURNING sno as "sno", po_ref_no as "po_ref_no", final_response_status as "status", created_by_user_id as "created_by_user_id";
        `;

        const result = await query(updateQuery, [status, userName, remarks || null, ids]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'No records found to update' });
        }

        // --- Notification Logic ---
        try {
            console.log(`Processing ${result.rows.length} notifications map...`);
            const notifications = result.rows.map(row => {
                let type = 'info';
                let title = 'PO Status Update';
                const poNo = row.po_ref_no;
                let message = `Your Purchase Order ${poNo} has been updated to ${status}.`;

                if (status === 'APPROVED') {
                    type = 'success';
                    title = 'PO Approved';
                    message = `Great news! Your Purchase Order ${poNo} has been APPROVED.`;
                } else if (status === 'REJECTED') {
                    type = 'error';
                    title = 'PO Rejected';
                    message = `Attention: Your Purchase Order ${poNo} has been REJECTED.`;
                } else if (status === 'HOLD') {
                    type = 'warning';
                    title = 'PO On Hold';
                    message = `Your Purchase Order ${poNo} has been put on HOLD.`;
                }

                return {
                    user_id: row.created_by_user_id,
                    title,
                    message,
                    type,
                    link: `/dashboard/po-approval/${row.sno}`,
                    date: new Date().toISOString()
                };
            });

            console.log("Generated Notifications:", notifications);

            for (const n of notifications) {
                if (n.user_id) {
                    await query(
                        `INSERT INTO ${TABLE_NOTIFICATIONS} (user_id, title, message, type, link, date) VALUES ($1, $2, $3, $4, $5, $6)`,
                        [n.user_id, n.title, n.message, n.type, n.link, n.date]
                    );
                    console.log(`Notification sent to User ${n.user_id} for PO ${n.message}`);
                } else {
                    console.warn("Skipping notification: created_by_user_id is missing for a PO.");
                }
            }
        } catch (notifError) {
            console.error('Failed to send notifications:', notifError);
        }

        return res.status(200).json({
            message: `Successfully updated ${result.rowCount} records to ${status}`,
            updatedRows: result.rows
        });

    } catch (error) {
        console.error('Error updating approval status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

