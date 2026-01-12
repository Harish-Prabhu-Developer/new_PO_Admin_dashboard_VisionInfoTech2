// src/controllers/PO.FilesUploadDetail4.Controller.ts
import { Request, Response } from 'express';
import { query } from '../config/db';

const TABLE_FILES_UPLOAD_DETAIL_4 = 'tbl_purchase_order_files_upload';

// Get all purchase order files upload details
export const getPOFilesUploadDetails4 = async (req: Request, res: Response) => {
    try {
        const result = await query(`SELECT * FROM ${TABLE_FILES_UPLOAD_DETAIL_4} ORDER BY sno ASC`);
        
        const data = result.rows.map((row: any) => {
            const { content_data, ...rest } = row;
            if (content_data) {
                const base64Image = Buffer.from(content_data).toString('base64');
                return {
                    ...rest,
                    file_data: `data:${rest.content_type};base64,${base64Image}`
                };
            }
            return rest;
        });

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching files upload details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get purchase order files upload detail by ID
export const getPOFilesUploadDetail4ById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await query(`SELECT * FROM ${TABLE_FILES_UPLOAD_DETAIL_4} WHERE sno = $1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }
        
        const row = result.rows[0];
        const { content_data, ...rest } = row;
        
        if (content_data) {
             const base64Image = Buffer.from(content_data).toString('base64');
             const responseData = {
                 ...rest,
                 file_data: `data:${rest.content_type};base64,${base64Image}`
             };
             return res.status(200).json(responseData);
        }
        
        res.status(200).json(rest);
    } catch (error) {
        console.error('Error fetching file upload detail by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Create purchase order files upload detail
export const createPOFilesUploadDetail4 = async (req: Request, res: Response) => {
    let {
        po_ref_no,
        description_details,
        file_name,
        content_type,
        content_data,
        status_master,
        created_by,
        created_mac_address,
        file_type,
        file_data
    } = req.body;

    const created_date = new Date();

    try {
        // Handle file_data (Data URI) if present
        if (file_data && typeof file_data === 'string') {
            const matches = file_data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                content_type = matches[1];
                content_data = Buffer.from(matches[2], 'base64');
            }
        } else if (typeof content_data === 'string' && !file_data) {
             // Fallback: If content_data is sent as base64 string without data uri prefix
             // Note: Ideally users should use file_data for clarity
             try {
                content_data = Buffer.from(content_data, 'base64');
             } catch (e) {
                // Keep as is if conversion fails, let PG handle/error
             }
        }

        const sql = `
            INSERT INTO ${TABLE_FILES_UPLOAD_DETAIL_4} (
                po_ref_no, description_details, file_name, content_type, 
                content_data, status_master, created_by, created_date, 
                created_mac_address, file_type
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `;
        const params = [
            po_ref_no, description_details, file_name, content_type,
            content_data, status_master, created_by, created_date,
            created_mac_address, file_type
        ];

        const result = await query(sql, params);
        
        // Format response to include file_data
        const row = result.rows[0];
        const { content_data: savedContent, ...rest } = row;
        let responseData = rest;
        
        if (savedContent) {
             const base64Image = Buffer.from(savedContent).toString('base64');
             responseData = {
                 ...rest,
                 file_data: `data:${rest.content_type};base64,${base64Image}`
             };
        }

        res.status(201).json(responseData);
    } catch (error) {
        console.error('Error creating file upload detail:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update purchase order files upload detail
export const updatePOFilesUploadDetail4 = async (req: Request, res: Response) => {
    const { id } = req.params;
    let {
        po_ref_no,
        description_details,
        file_name,
        content_type,
        content_data,
        status_master,
        modified_by,
        modified_mac_address,
        file_type,
        file_data
    } = req.body;

    const modified_date = new Date();

    try {
        // Check if record exists
        const check = await query(`SELECT sno FROM ${TABLE_FILES_UPLOAD_DETAIL_4} WHERE sno = $1`, [id]);
        if (check.rows.length === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }

        // Handle file_data (Data URI) if present
        if (file_data && typeof file_data === 'string') {
            const matches = file_data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                content_type = matches[1];
                content_data = Buffer.from(matches[2], 'base64');
            }
        } else if (typeof content_data === 'string' && !file_data) {
             try {
                content_data = Buffer.from(content_data, 'base64');
             } catch (e) {
                // Ignore
             }
        }

        const sql = `
            UPDATE ${TABLE_FILES_UPLOAD_DETAIL_4} SET
                po_ref_no = $1,
                description_details = $2,
                file_name = $3,
                content_type = $4,
                content_data = $5,
                status_master = $6,
                modified_by = $7,
                modified_date = $8,
                modified_mac_address = $9,
                file_type = $10
            WHERE sno = $11
            RETURNING *
        `;
        const params = [
            po_ref_no, description_details, file_name, content_type,
            content_data, status_master, modified_by, modified_date,
            modified_mac_address, file_type, id
        ];

        const result = await query(sql, params);
        
        // Format response
        const row = result.rows[0];
        const { content_data: savedContent, ...rest } = row;
        let responseData = rest;
        
        if (savedContent) {
             const base64Image = Buffer.from(savedContent).toString('base64');
             responseData = {
                 ...rest,
                 file_data: `data:${rest.content_type};base64,${base64Image}`
             };
        }
        
        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error updating file upload detail:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete purchase order files upload detail
export const deletePOFilesUploadDetail4 = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await query(`DELETE FROM ${TABLE_FILES_UPLOAD_DETAIL_4} WHERE sno = $1 RETURNING *`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }
        res.status(200).json({ message: 'Record deleted successfully', deletedRecord: result.rows[0] });
    } catch (error) {
        console.error('Error deleting file upload detail:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

