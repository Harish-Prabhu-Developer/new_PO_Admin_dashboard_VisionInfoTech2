// src/controllers/PO.ConversationDetail3.Controller.ts
import { Request, Response } from 'express';
import { query } from '../config/db';

const TABLE_CONVERSATION_DETAIL_3 = 'tbl_purchase_order_conversation_dtl';

// Get all purchase order conversation details
export const getPOConversationDetails3 = async (req: Request, res: Response) => {
    try {
        const result = await query(`SELECT * FROM ${TABLE_CONVERSATION_DETAIL_3} ORDER BY sno ASC`);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching conversation details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get purchase order conversation detail by ID
export const getPOConversationDetail3ById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await query(`SELECT * FROM ${TABLE_CONVERSATION_DETAIL_3} WHERE sno = $1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching conversation detail by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Create purchase order conversation detail
export const createPOConversationDetail3 = async (req: Request, res: Response) => {
    const {
        po_ref_no,
        respond_person,
        discussion_details,
        response_status,
        status_entry,
        remarks,
        created_by,
        created_mac_address
    } = req.body;

    const created_date = new Date();

    try {
        const sql = `
            INSERT INTO ${TABLE_CONVERSATION_DETAIL_3} (
                po_ref_no, respond_person, discussion_details, response_status,
                status_entry, remarks, created_by, created_date, created_mac_address
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
        const params = [
            po_ref_no, respond_person, discussion_details, response_status,
            status_entry, remarks, created_by, created_date, created_mac_address
        ];

        const result = await query(sql, params);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating conversation detail:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update purchase order conversation detail
export const updatePOConversationDetail3 = async (req: Request, res: Response) => {
    const { id } = req.params;
    const {
        po_ref_no,
        respond_person,
        discussion_details,
        response_status,
        status_entry,
        remarks,
        modified_by,
        modified_mac_address
    } = req.body;

    const modified_date = new Date();

    try {
        // Check if record exists
        const check = await query(`SELECT sno FROM ${TABLE_CONVERSATION_DETAIL_3} WHERE sno = $1`, [id]);
        if (check.rows.length === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }

        const sql = `
            UPDATE ${TABLE_CONVERSATION_DETAIL_3} SET
                po_ref_no = $1,
                respond_person = $2,
                discussion_details = $3,
                response_status = $4,
                status_entry = $5,
                remarks = $6,
                modified_by = $7,
                modified_date = $8,
                modified_mac_address = $9
            WHERE sno = $10
            RETURNING *
        `;
        const params = [
            po_ref_no, respond_person, discussion_details, response_status,
            status_entry, remarks, modified_by, modified_date, 
            modified_mac_address, id
        ];

        const result = await query(sql, params);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating conversation detail:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete purchase order conversation detail
export const deletePOConversationDetail3 = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await query(`DELETE FROM ${TABLE_CONVERSATION_DETAIL_3} WHERE sno = $1 RETURNING *`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }
        res.status(200).json({ message: 'Record deleted successfully', deletedRecord: result.rows[0] });
    } catch (error) {
        console.error('Error deleting conversation detail:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
