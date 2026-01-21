import { Request, Response } from 'express';
import { query } from '../config/db';
import { generateToken } from '../utils/jwthelper';

const TABLE_USER = 'users';

// Login user
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { User_Approval_Name, Password_User } = req.body;
        
        // Use correct column names from the users table schema
        const result = await query(
            `SELECT * FROM ${TABLE_USER} WHERE user_approval_name = $1 AND password_user = $2`, 
            [User_Approval_Name, Password_User]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid User Name or Password' });
        }
        
        const user = result.rows[0];
        
        // Generate JWT Token
        const token = generateToken(user);
        
        // Return user and token
        res.status(200).json({ user, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


//change Password
export const changePassword = async (req: Request, res: Response) => {
    try {
        const { User_Approval_Name, Old_Password, New_Password } = req.body;
        
        // Verify old password
        const result = await query(
            `SELECT * FROM ${TABLE_USER} WHERE user_approval_name = $1 AND password_user = $2`, 
            [User_Approval_Name, Old_Password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid User Name or Old Password' });
        }
        
        // Update to new password
        await query(
            `UPDATE ${TABLE_USER} SET password_user = $1 WHERE user_approval_name = $2`,
            [New_Password, User_Approval_Name]
        );
        
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
