// src/controllers/PO.Detail1.Controller.ts
import { Request, Response } from 'express';
import { query } from '../config/db';

const TABLE_DETAIL_1 = 'tbl_purchase_order_dtl';

// Get all purchase order details 1
export const getPODetails1 = async (req: Request, res: Response) => {
    try {
        const result = await query(`SELECT * FROM ${TABLE_DETAIL_1} ORDER BY created_date DESC`);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get a single purchase order detail 1 by sno
export const getPODetail1BySno = async (req: Request, res: Response) => {
    const { sno } = req.params;
    try {
        const result = await query(`SELECT * FROM ${TABLE_DETAIL_1} WHERE sno = $1`, [sno]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Purchase Order Detail 1 not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Create a new purchase order detail 1
export const createPODetail1 = async (req: Request, res: Response) => {
    const data = req.body;
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

    try {
        const result = await query(
            `INSERT INTO ${TABLE_DETAIL_1} (${columns}) VALUES (${placeholders}) RETURNING *`,
            values
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update a purchase order detail 1
export const updatePODetail1 = async (req: Request, res: Response) => {
    const { sno } = req.params;
    const data = req.body;
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map((col, i) => `"${col}" = $${i + 1}`).join(', ');

    try {
        const result = await query(
            `UPDATE ${TABLE_DETAIL_1} SET ${setClause} WHERE sno = $${values.length + 1} RETURNING *`,
            [...values, sno]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Purchase Order Detail 1 not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete a purchase order detail 1
export const deletePODetail1 = async (req: Request, res: Response) => {
    const { sno } = req.params;
    try {
        const result = await query(`DELETE FROM ${TABLE_DETAIL_1} WHERE sno = $1 RETURNING *`, [sno]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Purchase Order Detail 1 not found' });
        }
        res.json({ message: 'Purchase Order Detail 1 deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};