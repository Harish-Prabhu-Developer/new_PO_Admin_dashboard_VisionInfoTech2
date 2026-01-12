// src/controllers/PO.Header.Controller.ts
import { Request, Response } from 'express';
import { query } from '../config/db';

const TABLE_HEADER = 'tbl_purchase_order_hdr';

// Get all purchase order headers
export const getPOHeaders = async (req: Request, res: Response) => {
    try {
        const result = await query(`SELECT * FROM ${TABLE_HEADER} ORDER BY created_date DESC`);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get a single purchase order header by po_ref_no
export const getPOHeaderByRefNo = async (req: Request, res: Response) => {
    const { po_ref_no } = req.params;
    try {
        const result = await query(`SELECT * FROM ${TABLE_HEADER} WHERE po_ref_no = $1`, [po_ref_no]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Purchase Order Header not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Create a new purchase order header
export const createPOHeader = async (req: Request, res: Response) => {
    const data = req.body;
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

    try {
        const result = await query(
            `INSERT INTO ${TABLE_HEADER} (${columns}) VALUES (${placeholders}) RETURNING *`,
            values
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update a purchase order header
export const updatePOHeader = async (req: Request, res: Response) => {
    const { po_ref_no } = req.params;
    const data = req.body;
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map((col, i) => `"${col}" = $${i + 1}`).join(', ');

    try {
        const result = await query(
            `UPDATE ${TABLE_HEADER} SET ${setClause} WHERE po_ref_no = $${values.length + 1} RETURNING *`,
            [...values, po_ref_no]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Purchase Order Header not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete a purchase order header
export const deletePOHeader = async (req: Request, res: Response) => {
    const { po_ref_no } = req.params;
    try {
        const result = await query(`DELETE FROM ${TABLE_HEADER} WHERE po_ref_no = $1 RETURNING *`, [po_ref_no]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Purchase Order Header not found' });
        }
        res.json({ message: 'Purchase Order Header deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};