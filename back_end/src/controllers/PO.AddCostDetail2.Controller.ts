// src/controllers/PO.AddCostDetail2.Controller.ts
import { Request, Response } from 'express';
import { query } from '../config/db';

const TABLE_ADD_COST_DETAIL_2 = 'tbl_purchase_order_additional_cost_details';

// Get all purchase order additional cost details
export const getPOAddCostDetails2 = async (req: Request, res: Response) => {
    try {
        const result = await query(`SELECT * FROM ${TABLE_ADD_COST_DETAIL_2} ORDER BY created_date DESC`);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get a single purchase order additional cost detail by sno
export const getPOAddCostDetail2BySno = async (req: Request, res: Response) => {
    const { sno } = req.params;
    try {
        const result = await query(`SELECT * FROM ${TABLE_ADD_COST_DETAIL_2} WHERE sno = $1`, [sno]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Purchase Order Additional Cost Detail 2 not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Create a new purchase order additional cost detail
export const createPOAddCostDetail2 = async (req: Request, res: Response) => {
    const data = req.body;
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

    try {
        const result = await query(
            `INSERT INTO ${TABLE_ADD_COST_DETAIL_2} (${columns}) VALUES (${placeholders}) RETURNING *`,
            values
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update a purchase order additional cost detail
export const updatePOAddCostDetail2 = async (req: Request, res: Response) => {
    const { sno } = req.params;
    const data = req.body;
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map((col, i) => `"${col}" = $${i + 1}`).join(', ');

    try {
        const result = await query(
            `UPDATE ${TABLE_ADD_COST_DETAIL_2} SET ${setClause} WHERE sno = $${values.length + 1} RETURNING *`,
            [...values, sno]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Purchase Order Additional Cost Detail 2 not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete a purchase order additional cost detail
export const deletePOAddCostDetail2 = async (req: Request, res: Response) => {
    const { sno } = req.params;
    try {
        const result = await query(`DELETE FROM ${TABLE_ADD_COST_DETAIL_2} WHERE sno = $1 RETURNING *`, [sno]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Purchase Order Additional Cost Detail 2 not found' });
        }
        res.json({ message: 'Purchase Order Additional Cost Detail 2 deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};