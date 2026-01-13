// src/controllers/PO.Dashboard.Controller.ts
import { Request, Response } from 'express';
import { query } from '../config/db';

const TABLE_USER = 'users';
const TABLE_DASHBOARD = 'tbl_dashboard';
const TABLE_PURCHASE_ORDER_HEADER = 'tbl_purchase_order_hdr';
const TABLE_PURCHASE_ORDER_DETAIL = 'tbl_purchase_order_dtl';




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
        
        console.log("Approval Details Request Params (sno):", sno);

        if (!sno) {
            return res.status(400).json({ error: 'Dashboard Card ID (sno) is required' });
        }

        // 1. Validate: Check if the Dashboard Card exists
        // We use the sno to verify if it's a valid dashboard card requesting data
        const dashboardResult = await query(`SELECT * FROM ${TABLE_DASHBOARD} WHERE sno = $1`, [sno]);
        
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
                
                -- Formatting amount with commas (Postgres TO_CHAR for basic formatting, or handle in frontend. Here using simple cast)
                TO_CHAR(h.total_final_production_hdr_amount, 'FM9,999,999,999.00') as "amount",
                h.currency_type as "currency",
                
                CONCAT(h.requested_by, ' / ', TO_CHAR(h.requested_date, 'DD-Mon-YYYY')) as "requestedBy",
                
                -- Calculate days pending
                EXTRACT(DAY FROM (NOW() - h.po_date))::TEXT as "pendingDays",
                
                -- Response 1
                COALESCE(h.response_1_person, 'Pending') as "response1Person",
                COALESCE(h.response_1_status, 'PENDING') as "response1Status",
                COALESCE(h.response_1_remarks, '') as "response1Remarks",
                
                -- Response 2
                COALESCE(h.response_2_person, 'Pending') as "response2Person",
                COALESCE(h.response_2_status, 'PENDING') as "response2Status",
                COALESCE(h.response_2_remarks, '') as "response2Remarks",
                
                COALESCE(h.final_response_status, 'PENDING') as "finalStatus"
                
            FROM ${TABLE_PURCHASE_ORDER_HEADER} h
            -- Potentially filter by status_entry = 'Active' or similar standard filters
            -- WHERE h.status_entry = 'Active'
            ORDER BY h.po_date DESC;
        `;

        const result = await query(sqlQuery);

        // If DB has data, return it
        if (result.rows.length > 0) {
            return res.status(200).json({
                length: result.rows.length,
                rows: result.rows
            });
        }

        // Fallback: If DB is empty, return Mock Data (for demo/development purposes)
        const mockTableData = [
            {
                id: 1,
                cell: "A1",
                comp: "AZ",
                poNo: "AZ/MOFF/25-28/PO/2568",
                poType: "DOMESTIC",
                supplier: "ADDAMO MARINA HARDWARE",
                product: "RED SILICON B50/PC",
                company: "AZ",
                department: "ATOZ 1 DEPT",
                amount: "29,500",
                currency: "TSH",
                requestedBy: "raw / 07-Jan-2026",
                pendingDays: "0",
                response1Person: "Mr. Kalpesh",
                response1Status: "APPROVED",
                response1Remarks: "Quality checked",
                response2Person: "Shaaf",
                response2Status: "PENDING",
                response2Remarks: "",
                finalStatus: "HOLD",
            },
            ...Array.from({ length: 15 }, (_, i) => ({
                id: i + 2,
                cell: `A${i + 2}`,
                comp: "AZ",
                poNo: `AZ/MOFF/25-28/PO/25${60 + i}`,
                poType: i % 2 === 0 ? "DOMESTIC" : "IMPORT",
                supplier: i % 3 === 0 ? "ADDAMO MARINA HARDWARE" : i % 3 === 1 ? "VISION INFOTECH LTD" : "POLYFOAM LIMITED",
                product: `Industrial Part ${i + 101}`,
                company: "AZ",
                department: i % 2 === 0 ? "AZ MEDICAL" : "FLEXIBLE PACKAGING",
                amount: `${(Math.random() * 5000000).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
                currency: i % 2 === 0 ? "TSH" : "USD",
                requestedBy: `user${i} / ${i + 1}-Jan-2026`,
                pendingDays: `${i}`,
                response1Person: i % 4 === 0 ? "Mr.Kalpesh / 07-Jan-2026 12:53:24" : "Mr. John",
                response1Status: i % 4 === 0 ? "APPROVED" : i % 5 === 0 ? "HOLD" : "APPROVED",
                response1Remarks: i % 6 === 0 ? "Some remarks here" : "",
                response2Person: i % 7 === 0 ? "Mr.Shaaf / 06-Jan-2026 09:36:30" : "Shaaf",
                response2Status: i % 7 === 0 ? "APPROVED" : "PENDING",
                response2Remarks: i % 8 === 0 ? "Additional remarks" : "",
                finalStatus: i % 4 === 0 ? "APPROVED" : i % 5 === 0 ? "HOLD" : "PENDING",
            }))
        ];

        return res.status(200).json({
            length: mockTableData.length,
            rows: mockTableData
        });

    } catch (error) {
        console.error('Error fetching approval details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
